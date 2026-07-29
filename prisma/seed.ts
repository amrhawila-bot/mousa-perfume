import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.resolve(__dirname, "..", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.admin.upsert({
    where: { email: "admin@noir.com" },
    update: {},
    create: {
      email: "admin@noir.com",
      password: adminPassword,
      name: "مدير المتجر",
    },
  });

  const categories = [
    { nameAr: "رجالي", nameEn: "Men", slug: "men" },
    { nameAr: "حريمي", nameEn: "Women", slug: "women" },
    { nameAr: "يونيسكس", nameEn: "Unisex", slug: "unisex" },
    { nameAr: "نيش", nameEn: "Niche", slug: "niche" },
    { nameAr: "عروض", nameEn: "Offers", slug: "offers" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const catMen = await prisma.category.findUnique({ where: { slug: "men" } });
  const catWomen = await prisma.category.findUnique({ where: { slug: "women" } });
  const catUnisex = await prisma.category.findUnique({ where: { slug: "unisex" } });
  const catNiche = await prisma.category.findUnique({ where: { slug: "niche" } });

  const products = [
    {
      nameAr: "نوار أبسولو",
      nameEn: "Noir Absolu",
      description: "عطر فاخر يجمع بين البرغموت والعنبر والعود. تجربة حسية لا تُنسى.",
      brand: "MOUSA",
      categoryId: catMen!.id,
      price: 320,
      oldPrice: 380,
      stock: 15,
      gender: "رجالي",
      concentration: "Eau de Parfum",
      size: "100ml",
      featured: true,
    },
    {
      nameAr: "روز إيترنيل",
      nameEn: "Rose Éternelle",
      description: "عطر زهري أنيق مستوحى من الورود الدمشقية النادرة مع لمسات من الزعفران والعنبر.",
      brand: "MOUSA",
      categoryId: catWomen!.id,
      price: 380,
      stock: 12,
      gender: "حريمي",
      concentration: "Eau de Parfum",
      size: "100ml",
      featured: true,
    },
    {
      nameAr: "سانتال رويال",
      nameEn: "Santal Royal",
      description: "عطر خشبي فاخر يجمع بين خشب الصندل والفانيليا والكشمير. دفء وأناقة.",
      brand: "MOUSA",
      categoryId: catUnisex!.id,
      price: 350,
      oldPrice: 400,
      stock: 20,
      gender: "يونيسكس",
      concentration: "Eau de Parfum",
      size: "100ml",
      featured: true,
    },
    {
      nameAr: "أمبر نايت",
      nameEn: "Ambre Nuit",
      description: "عطر ليلي غامض يمزج بين العنبر والتونكا والجلود. شخصية وجاذبية.",
      brand: "MOUSA",
      categoryId: catMen!.id,
      price: 420,
      stock: 8,
      gender: "رجالي",
      concentration: "Extrait de Parfum",
      size: "75ml",
      featured: true,
    },
    {
      nameAr: "جاردين سيكريت",
      nameEn: "Jardin Secret",
      description: "عطر حديقة سرية تجتمع فيه الزهور النادرة والفواكه الاستوائية.",
      brand: "MOUSA",
      categoryId: catWomen!.id,
      price: 290,
      stock: 25,
      gender: "حريمي",
      concentration: "Eau de Toilette",
      size: "100ml",
      featured: false,
    },
    {
      nameAr: "أوديسي",
      nameEn: "Odyssey",
      description: "رحلة عطرية عبر البحر الأبيض المتوسط. مزيج منعش من الحمضيات.",
      brand: "MOUSA",
      categoryId: catNiche!.id,
      price: 450,
      oldPrice: 520,
      stock: 5,
      gender: "يونيسكس",
      concentration: "Extrait de Parfum",
      size: "50ml",
      featured: false,
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { nameEn: product.nameEn },
    });
    if (!existing) {
      await prisma.product.create({ data: product });
    }
  }

  console.log("✅ Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
