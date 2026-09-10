import { prisma } from "./prisma";

export async function getSiteContentMap() {
  const rows = await prisma.siteContent.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<
    string,
    string
  >;
}

export async function getPublicData() {
  const [content, packages, services, gallery] = await Promise.all([
    getSiteContentMap(),
    prisma.package.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.service.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.galleryImage.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return { content, packages, services, gallery };
}
