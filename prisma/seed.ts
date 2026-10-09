import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

const products = [
  ['Kashmiri Red Chilli Powder 200g', 'Spices', 690, 'Vibrant colour, mild heat. Sealed pack from Indian growers.'],
  ['Garam Masala 100g', 'Spices', 590, 'Classic north-Indian blend, freshly ground.'],
  ['Darjeeling First Flush Tea 100g', 'Tea & Coffee', 1490, 'Light, floral first-flush leaves.'],
  ['Assorted Mithai Box (Sealed)', 'Snacks & Sweets', 1890, 'Shelf-stable assorted sweets, sealed box.'],
  ['Cotton Kurta – Men (M/L/XL)', 'Clothing', 3990, 'Breathable handloom cotton. Tell us your size in the order notes.'],
  ['Brass Puja Diya Set', 'Home & Puja', 2490, 'Hand-finished brass diyas, set of 4.'],
  ['Amla Hair Oil 200ml', 'Ayurveda & Care', 790, 'Traditional cold-infused amla oil.'],
] as const;

async function main() {
  for (const [name, category, priceRappen, description] of products) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    await db.product.upsert({ where: { slug }, update: {}, create: { slug, name, category, priceRappen, description } });
  }
}
main().finally(() => db.$disconnect());
