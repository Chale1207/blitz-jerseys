"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, timingSafeEqual } from "crypto";
import { signAdminToken, ADMIN_COOKIE } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

// Hash both sides to a fixed-length digest before comparing, so the branch
// on string length that a direct `!==` would take can't leak how many
// leading characters of the password guess were correct via response timing.
function safeCompare(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const ip = await getClientIp();
  const now = new Date();

  const existing = await prisma.loginAttempt.findUnique({ where: { ip } });
  const withinWindow = existing ? now.getTime() - existing.firstFailAt.getTime() < WINDOW_MS : false;

  if (existing && withinWindow && existing.failCount >= MAX_ATTEMPTS) {
    const retryAfterMs = WINDOW_MS - (now.getTime() - existing.firstFailAt.getTime());
    const minutes = Math.max(1, Math.ceil(retryAfterMs / 60000));
    redirect(`/admin/login?error=locked&minutes=${minutes}`);
  }

  if (!adminPassword || !safeCompare(password, adminPassword)) {
    if (existing) {
      await prisma.loginAttempt.update({
        where: { ip },
        data: withinWindow
          ? { failCount: { increment: 1 }, lastFailAt: now }
          : { failCount: 1, firstFailAt: now, lastFailAt: now },
      });
    } else {
      await prisma.loginAttempt.create({ data: { ip, firstFailAt: now, lastFailAt: now } });
    }
    redirect("/admin/login?error=invalid");
  }

  if (existing) {
    await prisma.loginAttempt.delete({ where: { ip } }).catch(() => {});
  }

  const token = await signAdminToken();
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
