#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up SkillCircle development environment...\n');

// Function to run commands and handle errors
function runCommand(command, description, cwd = process.cwd()) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: cwd,
      timeout: 300000 // 5 minutes timeout
    });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.log(`⚠️  ${description} failed, but continuing...\n`);
  }
}

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Please run this script from the SkillCircle root directory');
  process.exit(1);
}

try {
  // 1. Install root dependencies
  runCommand('npm install', 'Installing root dependencies');

  // 2. Install workspace dependencies
  runCommand('npm run install:workspaces', 'Installing workspace dependencies');

  // 3. Generate Prisma client
  runCommand('npx prisma generate', 'Generating Prisma client', './backend');

  // 4. Create database and run migrations
  runCommand('npx prisma migrate dev --name init', 'Creating database and running migrations', './backend');

  // 5. Seed the database
  runCommand('npm run db:seed', 'Seeding database with sample data', './backend');

  console.log('🎉 Setup complete! You can now run:');
  console.log('');
  console.log('  npm run dev     # Start both frontend and backend');
  console.log('  npm run dev:web # Start only frontend');
  console.log('  npm run dev:backend # Start only backend');
  console.log('');
  console.log('🌐 Frontend: http://localhost:3000');
  console.log('🔧 Backend:  http://localhost:3001');
  console.log('📊 Database: backend/dev.db (SQLite)');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  console.log('\n💡 You can try running the commands manually:');
  console.log('  cd backend && npm install');
  console.log('  cd backend && npx prisma generate');
  console.log('  cd backend && npx prisma migrate dev');
  console.log('  cd backend && npm run db:seed');
  process.exit(1);
}