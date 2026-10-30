import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema(
  {
    internalId: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Property name is required'],
      trim: true,
      maxlength: [200, 'Property name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase alphanumeric characters and hyphens'],
    },
    source: {
      type: String,
      enum: {
        values: ['VIA_OTA', 'VIA_OTA_EXCHANGE'],
        message: '{VALUE} is not a valid property source',
      },
      default: 'VIA_OTA',
      index: true,
    },
    externalId: {
      type: String,
      trim: true,
      default: '',
    },
    externalSyncStatus: {
      type: String,
      enum: ['SYNCED', 'PENDING', 'NOT_APPLICABLE', 'FAILED'],
      default: 'NOT_APPLICABLE',
    },
    externalSyncNotes: {
      type: String,
      trim: true,
      default: '',
    },
    lastExternalSyncAt: {
      type: Date,
      default: null,
    },
    destination: {
      type: String,
      required: [true, 'Destination identifier is required (e.g., Agra, Hawaii)'],
      trim: true,
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Display location is required'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    country: {
      type: String,
      trim: true,
      default: 'India',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    mapQuery: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    destinationDescription: {
      type: String,
      trim: true,
      default: '',
    },
    knowYourDestination: {
      type: String,
      trim: true,
      default: '',
    },
    highlights: {
      type: [String],
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      required: [true, 'Cover image URL is required'],
      trim: true,
    },
    gallery: {
      type: [String],
      default: [],
    },
    contactDetails: {
      phone: { type: String, trim: true, default: '' },
      email: { type: String, trim: true, default: '' },
      website: { type: String, trim: true, default: '' },
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'archived'],
        message: '{VALUE} is not a valid status',
      },
      default: 'draft',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    bufferCommands: false,
  }
)

// Compound indexes for high performance public filtering
propertySchema.index({ status: 1, isActive: 1, featured: -1, createdAt: -1 })
propertySchema.index({ destination: 1, status: 1, isActive: 1 })
propertySchema.index({ source: 1, status: 1 })

// Text index for server-side full-text search
propertySchema.index({
  name: 'text',
  location: 'text',
  destination: 'text',
  city: 'text',
  description: 'text',
})

// Auto-generate internalId if not supplied
propertySchema.pre('validate', async function (next) {
  if (!this.internalId) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const timestampSuffix = Date.now().toString().slice(-4)
    this.internalId = `CHIS-PROP-${timestampSuffix}${randomSuffix}`
  }

  // Fallback for mapQuery if not provided
  if (!this.mapQuery) {
    this.mapQuery = `${this.name} ${this.location}`
  }

  next()
})

export const Property = mongoose.model('Property', propertySchema)
