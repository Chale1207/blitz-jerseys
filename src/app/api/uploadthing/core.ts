import { createUploadthing, type FileRouter } from "uploadthing/next";
import { verifyToken, ADMIN_COOKIE } from "@/lib/auth";
import { cookies } from "next/headers";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: "8MB", maxFileCount: 8 } })
    .middleware(async () => {
      const store = await cookies();
      const token = store.get(ADMIN_COOKIE)?.value;
      if (!token || !(await verifyToken(token))) throw new Error("Unauthorized");
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
