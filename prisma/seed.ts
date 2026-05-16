import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clear existing data
  await prisma.task.deleteMany({})
  await prisma.project.deleteMany({})
  await prisma.user.deleteMany({})

  // Create Admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create Members
  const memberPassword = await bcrypt.hash('member123', 10)
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: memberPassword,
      role: 'MEMBER',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: memberPassword,
      role: 'MEMBER',
    },
  })

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      title: 'Website Redesign',
      description: 'Overhaul the company website with modern aesthetics.',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      createdById: admin.id,
      memberIds: [admin.id, user1.id, user2.id],
    },
  })

  const project2 = await prisma.project.create({
    data: {
      title: 'Mobile App Development',
      description: 'Develop a cross-platform mobile app for clients.',
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      createdById: admin.id,
      memberIds: [admin.id, user1.id],
    },
  })

  // Create Tasks for Project 1
  await prisma.task.createMany({
    data: [
      {
        title: 'Initial Research',
        description: 'Analyze competitor websites and user needs.',
        status: 'DONE',
        priority: 'MEDIUM',
        projectId: project1.id,
        assignedToId: user1.id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Wireframing',
        description: 'Create low-fidelity wireframes for main pages.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        projectId: project1.id,
        assignedToId: user2.id,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'UI Design',
        description: 'Design the final UI mockups in Figma.',
        status: 'TODO',
        priority: 'URGENT',
        projectId: project1.id,
        assignedToId: user1.id,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
    ],
  })

  // Create Tasks for Project 2
  await prisma.task.createMany({
    data: [
      {
        title: 'Setup Flutter Environment',
        description: 'Prepare development machines for Flutter dev.',
        status: 'DONE',
        priority: 'LOW',
        projectId: project2.id,
        assignedToId: user1.id,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'API Integration',
        description: 'Connect the app to the backend services.',
        status: 'TODO',
        priority: 'HIGH',
        projectId: project2.id,
        assignedToId: user1.id,
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      },
    ],
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
