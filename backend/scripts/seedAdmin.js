import mongoose from 'mongoose'
import dotenv from 'dotenv'
import dns from 'dns'
import { User } from '../models/User.js'
import { config } from '../config/env.js'

try {
  dns.setServers(['8.8.8.8', '1.1.1.1'])
} catch {}

dotenv.config()

const seedAdmin = async () => {
  const args = process.argv.slice(2)
  const email = (args[0] || process.env.ADMIN_SEED_EMAIL || 'admin@countryholidaysinnsuites.com').toLowerCase().trim()
  const password = args[1] || process.env.ADMIN_SEED_PASSWORD || 'Admin@CHIS2026!'
  const name = args[2] || process.env.ADMIN_SEED_NAME || 'Principal Administrator'

  console.log('\n=============================================================')
  console.log('🛡️  COUNTRY HOLIDAYS INN & SUITES - ADMIN SEEDING UTILITY')
  console.log('=============================================================')
  console.log(`Target Email: ${email}`)
  console.log(`Target Name:  ${name}`)
  console.log('Connecting to database...')

  if (!config.mongoUri) {
    console.error('❌ MONGODB_URI is not set in backend/.env.')
    console.error('   Please add MONGODB_URI to your backend/.env before running this script.')
    process.exit(1)
  }

  try {
    await mongoose.connect(config.mongoUri, { serverSelectionTimeoutMS: 8000 })
    console.log('✅ Connected to MongoDB.')

    let user = await User.findOne({ email }).select('+password')

    if (user) {
      console.log(`ℹ️ Account already exists. Updating credentials for ${email}...`)
      user.name = name
      user.password = password
      user.role = 'super_admin'
      user.isActive = true
      await user.save()
      console.log(`✅ Super Admin account updated successfully!`)
    } else {
      user = new User({
        name,
        email,
        password,
        role: 'super_admin',
        isActive: true,
      })
      await user.save()
      console.log(`✅ Super Admin account created successfully!`)
    }

    console.log('\nCredentials:')
    console.log(`- Email:    ${email}`)
    console.log(`- Role:     super_admin`)
    console.log(`- Status:   Active`)
    console.log('=============================================================\n')

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    process.exit(1)
  }
}

seedAdmin()
