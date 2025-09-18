import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create skill categories
  const categories = await Promise.all([
    prisma.skillCategory.upsert({
      where: { name: 'Technology' },
      update: {},
      create: {
        name: 'Technology',
        description: 'Programming, web development, data science, and more',
        icon: '💻',
        color: '#3B82F6'
      }
    }),
    prisma.skillCategory.upsert({
      where: { name: 'Cooking' },
      update: {},
      create: {
        name: 'Cooking',
        description: 'Culinary arts, baking, international cuisines',
        icon: '🍳',
        color: '#EF4444'
      }
    }),
    prisma.skillCategory.upsert({
      where: { name: 'Languages' },
      update: {},
      create: {
        name: 'Languages',
        description: 'Learn new languages and improve communication',
        icon: '🗣️',
        color: '#10B981'
      }
    }),
    prisma.skillCategory.upsert({
      where: { name: 'Music' },
      update: {},
      create: {
        name: 'Music',
        description: 'Instruments, composition, music theory',
        icon: '🎵',
        color: '#8B5CF6'
      }
    }),
    prisma.skillCategory.upsert({
      where: { name: 'Arts & Crafts' },
      update: {},
      create: {
        name: 'Arts & Crafts',
        description: 'Painting, drawing, sculpting, handmade crafts',
        icon: '🎨',
        color: '#F59E0B'
      }
    }),
    prisma.skillCategory.upsert({
      where: { name: 'Sports & Fitness' },
      update: {},
      create: {
        name: 'Sports & Fitness',
        description: 'Physical training, sports coaching, wellness',
        icon: '⚽',
        color: '#06B6D4'
      }
    })
  ])

  console.log('✅ Categories created')

  // Create skills
  const skills = await Promise.all([
    // Technology skills
    prisma.skill.upsert({
      where: { name_categoryId: { name: 'React Development', categoryId: categories[0].id } },
      update: {},
      create: {
        name: 'React Development',
        description: 'Learn modern React with hooks, context, and best practices',
        categoryId: categories[0].id,
        tags: ['JavaScript', 'Frontend', 'Web Development', 'UI/UX']
      }
    }),
    prisma.skill.upsert({
      where: { name_categoryId: { name: 'Python Programming', categoryId: categories[0].id } },
      update: {},
      create: {
        name: 'Python Programming',
        description: 'Master Python for web development, data science, and automation',
        categoryId: categories[0].id,
        tags: ['Python', 'Backend', 'Data Science', 'Automation']
      }
    }),
    prisma.skill.upsert({
      where: { name_categoryId: { name: 'Mobile App Development', categoryId: categories[0].id } },
      update: {},
      create: {
        name: 'Mobile App Development',
        description: 'Build mobile apps with React Native and Flutter',
        categoryId: categories[0].id,
        tags: ['React Native', 'Flutter', 'Mobile', 'Cross-platform']
      }
    }),

    // Cooking skills
    prisma.skill.upsert({
      where: { name_categoryId: { name: 'Italian Cooking', categoryId: categories[1].id } },
      update: {},
      create: {
        name: 'Italian Cooking',
        description: 'Authentic Italian recipes and cooking techniques',
        categoryId: categories[1].id,
        tags: ['Pasta', 'Pizza', 'Mediterranean', 'Traditional']
      }
    }),
    prisma.skill.upsert({
      where: { name_categoryId: { name: 'Baking & Pastries', categoryId: categories[1].id } },
      update: {},
      create: {
        name: 'Baking & Pastries',
        description: 'Learn to bake bread, cakes, and French pastries',
        categoryId: categories[1].id,
        tags: ['Bread', 'Cakes', 'Pastries', 'French Technique']
      }
    }),

    // Language skills
    prisma.skill.upsert({
      where: { name_categoryId: { name: 'Spanish Conversation', categoryId: categories[2].id } },
      update: {},
      create: {
        name: 'Spanish Conversation',
        description: 'Improve your Spanish speaking and listening skills',
        categoryId: categories[2].id,
        tags: ['Conversation', 'Grammar', 'Pronunciation', 'Culture']
      }
    }),
    prisma.skill.upsert({
      where: { name_categoryId: { name: 'Japanese Language', categoryId: categories[2].id } },
      update: {},
      create: {
        name: 'Japanese Language',
        description: 'Learn Japanese from basics to advanced conversation',
        categoryId: categories[2].id,
        tags: ['Hiragana', 'Katakana', 'Kanji', 'Business Japanese']
      }
    }),

    // Music skills
    prisma.skill.upsert({
      where: { name_categoryId: { name: 'Guitar Lessons', categoryId: categories[3].id } },
      update: {},
      create: {
        name: 'Guitar Lessons',
        description: 'Learn acoustic and electric guitar from beginner to advanced',
        categoryId: categories[3].id,
        tags: ['Acoustic', 'Electric', 'Music Theory', 'Songwriting']
      }
    }),
    prisma.skill.upsert({
      where: { name_categoryId: { name: 'Piano & Keyboard', categoryId: categories[3].id } },
      update: {},
      create: {
        name: 'Piano & Keyboard',
        description: 'Classical and modern piano techniques',
        categoryId: categories[3].id,
        tags: ['Classical', 'Jazz', 'Pop', 'Music Theory']
      }
    })
  ])

  console.log('✅ Skills created')

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@skillcircle.com' },
      update: {},
      create: {
        email: 'alice@skillcircle.com',
        username: 'alice_dev',
        name: 'Alice Johnson',
        password: hashedPassword,
        bio: 'Full-stack developer with 5+ years of experience. Love teaching React and Python!',
        isTeacher: true,
        isLearner: true,
        rating: 4.8,
        reviewCount: 24,
        verified: true,
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Tech Street',
        city: 'New York',
        country: 'USA',
        profile: {
          create: {
            maxDistance: 25,
            preferredMeetingType: 'both',
            languagePreferences: ['English', 'Spanish'],
            timezone: 'America/New_York'
          }
        }
      }
    }),
    prisma.user.upsert({
      where: { email: 'bob@skillcircle.com' },
      update: {},
      create: {
        email: 'bob@skillcircle.com',
        username: 'chef_bob',
        name: 'Bob Smith',
        password: hashedPassword,
        bio: 'Professional chef specializing in Italian cuisine. 15 years of restaurant experience.',
        isTeacher: true,
        isLearner: false,
        rating: 4.9,
        reviewCount: 31,
        verified: true,
        latitude: 40.7589,
        longitude: -73.9851,
        address: '456 Culinary Ave',
        city: 'New York',
        country: 'USA',
        profile: {
          create: {
            maxDistance: 30,
            preferredMeetingType: 'in-person',
            languagePreferences: ['English', 'Italian'],
            timezone: 'America/New_York'
          }
        }
      }
    }),
    prisma.user.upsert({
      where: { email: 'carlos@skillcircle.com' },
      update: {},
      create: {
        email: 'carlos@skillcircle.com',
        username: 'carlos_music',
        name: 'Carlos Rodriguez',
        password: hashedPassword,
        bio: 'Guitar instructor and music producer. Taught over 100 students!',
        isTeacher: true,
        isLearner: true,
        rating: 4.7,
        reviewCount: 18,
        verified: true,
        latitude: 34.0522,
        longitude: -118.2437,
        address: '789 Music Blvd',
        city: 'Los Angeles',
        country: 'USA',
        profile: {
          create: {
            maxDistance: 20,
            preferredMeetingType: 'both',
            languagePreferences: ['English', 'Spanish'],
            timezone: 'America/Los_Angeles'
          }
        }
      }
    }),
    prisma.user.upsert({
      where: { email: 'diana@skillcircle.com' },
      update: {},
      create: {
        email: 'diana@skillcircle.com',
        username: 'diana_lang',
        name: 'Diana Kim',
        password: hashedPassword,
        bio: 'Native Japanese speaker and certified language teacher. Making learning fun!',
        isTeacher: true,
        isLearner: true,
        rating: 4.9,
        reviewCount: 42,
        verified: true,
        latitude: 37.7749,
        longitude: -122.4194,
        address: '321 Language Lane',
        city: 'San Francisco',
        country: 'USA',
        profile: {
          create: {
            maxDistance: 15,
            preferredMeetingType: 'online',
            languagePreferences: ['English', 'Japanese', 'Korean'],
            timezone: 'America/Los_Angeles'
          }
        }
      }
    })
  ])

  console.log('✅ Users created')

  // Create user skills (what users teach)
  await Promise.all([
    // Alice teaches React and Python
    prisma.userSkill.upsert({
      where: { userId_skillId_role: { userId: users[0].id, skillId: skills[0].id, role: 'TEACHER' } },
      update: {},
      create: {
        userId: users[0].id,
        skillId: skills[0].id,
        role: 'TEACHER',
        level: 'EXPERT',
        experience: '5+ years of professional React development',
        hourlyRate: 75,
        currency: 'USD',
        certifications: ['Meta React Certificate', 'AWS Developer Associate']
      }
    }),
    prisma.userSkill.upsert({
      where: { userId_skillId_role: { userId: users[0].id, skillId: skills[1].id, role: 'TEACHER' } },
      update: {},
      create: {
        userId: users[0].id,
        skillId: skills[1].id,
        role: 'TEACHER',
        level: 'ADVANCED',
        experience: '4+ years of Python for web and data science',
        hourlyRate: 65,
        currency: 'USD',
        certifications: ['Python Institute PCPP-32-1']
      }
    }),

    // Bob teaches Italian cooking
    prisma.userSkill.upsert({
      where: { userId_skillId_role: { userId: users[1].id, skillId: skills[3].id, role: 'TEACHER' } },
      update: {},
      create: {
        userId: users[1].id,
        skillId: skills[3].id,
        role: 'TEACHER',
        level: 'EXPERT',
        experience: '15+ years as professional chef, specializing in Italian cuisine',
        hourlyRate: 85,
        currency: 'USD',
        certifications: ['Culinary Institute of America', 'Italian Culinary Certificate']
      }
    }),
    prisma.userSkill.upsert({
      where: { userId_skillId_role: { userId: users[1].id, skillId: skills[4].id, role: 'TEACHER' } },
      update: {},
      create: {
        userId: users[1].id,
        skillId: skills[4].id,
        role: 'TEACHER',
        level: 'EXPERT',
        experience: 'Master baker with focus on French pastries and artisan breads',
        hourlyRate: 90,
        currency: 'USD',
        certifications: ['French Pastry School Certificate']
      }
    }),

    // Carlos teaches guitar
    prisma.userSkill.upsert({
      where: { userId_skillId_role: { userId: users[2].id, skillId: skills[7].id, role: 'TEACHER' } },
      update: {},
      create: {
        userId: users[2].id,
        skillId: skills[7].id,
        role: 'TEACHER',
        level: 'EXPERT',
        experience: '8+ years teaching guitar, from beginner to advanced students',
        hourlyRate: 60,
        currency: 'USD',
        certifications: ['Berklee Guitar Certificate', 'RockSchool Grade 8']
      }
    }),

    // Diana teaches Japanese
    prisma.userSkill.upsert({
      where: { userId_skillId_role: { userId: users[3].id, skillId: skills[6].id, role: 'TEACHER' } },
      update: {},
      create: {
        userId: users[3].id,
        skillId: skills[6].id,
        role: 'TEACHER',
        level: 'EXPERT',
        experience: 'Native speaker with 6+ years of teaching experience',
        hourlyRate: 55,
        currency: 'USD',
        certifications: ['JLPT N1', 'Teaching Japanese as Foreign Language Certificate']
      }
    }),
    prisma.userSkill.upsert({
      where: { userId_skillId_role: { userId: users[3].id, skillId: skills[5].id, role: 'TEACHER' } },
      update: {},
      create: {
        userId: users[3].id,
        skillId: skills[5].id,
        role: 'TEACHER',
        level: 'ADVANCED',
        experience: 'Bilingual Spanish speaker, conversation practice specialist',
        hourlyRate: 45,
        currency: 'USD',
        certifications: ['DELE B2', 'Spanish Teaching Certificate']
      }
    })
  ])

  console.log('✅ User skills created')

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })