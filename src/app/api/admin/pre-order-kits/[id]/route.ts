import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const formData = await request.formData();

  const club = (formData.get("club") as string).trim();
  const kitName = (formData.get("kitName") as string).trim();
  const price = parseInt(formData.get("price") as string, 10);
  const status = formData.get("status") as string;
  const demandPercent = parseInt((formData.get("demandPercent") as string) || "0", 10);
  const defaultImageIndex = parseInt((formData.get("defaultImageIndex") as string) || "0", 10);

  const imageLines = ((formData.get("imageUrls") as string) ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (!club || !kitName || imageLines.length === 0) {
    return NextResponse.json(
      { success: false, error: "Club, kit name, and at least one image are required." },
      { status: 400 }
    );
  }

  await prisma.preOrderKit.update({
    where: { id },
    data: {
      club,
      kitName,
      fullName: `${club} ${kitName}`,
      imagesJson: JSON.stringify(imageLines),
      defaultImageIndex,
      price,
      status,
      demandPercent,
    },
  });

  revalidatePath("/pre-orders");
  revalidatePath("/admin/pre-order-kits");

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.preOrderKit.delete({ where: { id } });

  revalidatePath("/pre-orders");
  revalidatePath("/admin/pre-order-kits");

  return NextResponse.json({ success: true });
}
