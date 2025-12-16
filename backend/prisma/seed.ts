import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create sample locations
  const location1 = await prisma.location.upsert({
    where: { id: 'loc-1' },
    update: {},
    create: {
      id: 'loc-1',
      name: 'Times Square Billboard',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      address: 'Times Square, New York, NY 10036',
      latitude: 40.7580,
      longitude: -73.9855,
      description: 'Premium billboard location in the heart of Times Square',
      isActive: true,
    },
  });

  const location2 = await prisma.location.upsert({
    where: { id: 'loc-2' },
    update: {},
    create: {
      id: 'loc-2',
      name: 'Hollywood Boulevard',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      address: 'Hollywood Blvd, Los Angeles, CA 90028',
      latitude: 34.0928,
      longitude: -118.3287,
      description: 'Iconic billboard on Hollywood Boulevard',
      isActive: true,
    },
  });

  // Create sample templates
  const template1 = await prisma.template.upsert({
    where: { id: 'tpl-1' },
    update: {},
    create: {
      id: 'tpl-1',
      name: 'Classic Portrait',
      description: 'Traditional portrait layout for photos',
      previewUrl: 'https://example.com/templates/classic-portrait.jpg',
      isActive: true,
    },
  });

  const template2 = await prisma.template.upsert({
    where: { id: 'tpl-2' },
    update: {},
    create: {
      id: 'tpl-2',
      name: 'Modern Landscape',
      description: 'Contemporary landscape layout',
      previewUrl: 'https://example.com/templates/modern-landscape.jpg',
      isActive: true,
    },
  });

  // Create sample plans (prices in Indian Rupees)
  const plan1 = await prisma.plan.upsert({
    where: { id: 'plan-1' },
    update: {
      price: 1999,
      displayDurationSeconds: 15,
    },
    create: {
      id: 'plan-1',
      name: 'Basic',
      description: 'Perfect for personal messages',
      price: 1999,
      duration: 1,
      displayDurationSeconds: 15, // 15 seconds display
      features: ['1 day display', '15 seconds duration', 'Standard resolution', 'Email support'],
      isActive: true,
    },
  });

  const plan2 = await prisma.plan.upsert({
    where: { id: 'plan-2' },
    update: {
      price: 2999,
      displayDurationSeconds: 30,
    },
    create: {
      id: 'plan-2',
      name: 'Premium',
      description: 'Ideal for special occasions',
      price: 2999,
      duration: 3,
      displayDurationSeconds: 30, // 30 seconds display
      features: ['3 days display', '30 seconds duration', 'High resolution', 'Priority support'],
      isActive: true,
    },
  });

  const plan3 = await prisma.plan.upsert({
    where: { id: 'plan-3' },
    update: {
      price: 3999,
      displayDurationSeconds: null, // Custom duration
    },
    create: {
      id: 'plan-3',
      name: 'Custom',
      description: 'Maximum visibility with customizable duration',
      price: 3999,
      duration: 7,
      displayDurationSeconds: null, // null for custom plans
      features: ['7 days display', 'Custom duration', 'Ultra HD resolution', '24/7 support', 'Analytics'],
      isActive: true,
    },
  });

  console.log('Seed data created:', {
    locations: [location1, location2],
    templates: [template1, template2],
    plans: [plan1, plan2, plan3],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

