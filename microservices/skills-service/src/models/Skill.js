const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  // Basic information
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },

  // Categorization
  category: {
    type: String,
    required: true,
    enum: ['technology', 'programming', 'design', 'business', 'science', 'languages', 'health', 'cooking', 'creative', 'academic']
  },
  subcategory: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],

  // Skill metadata
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  },
  estimatedHours: {
    type: Number,
    min: 1,
    max: 1000
  },
  popularity: {
    type: Number,
    default: 0,
    min: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },

  // Prerequisites and dependencies
  prerequisites: [{
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill'
    },
    name: String,
    required: {
      type: Boolean,
      default: true
    },
    proficiencyLevel: {
      type: String,
      enum: ['basic', 'intermediate', 'advanced'],
      default: 'basic'
    }
  }],

  // Learning outcomes
  learningOutcomes: [{
    title: String,
    description: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    }
  }],

  // Skill breakdown
  topics: [{
    name: String,
    description: String,
    order: Number,
    estimatedHours: Number,
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    }
  }],

  // Career and industry information
  industries: [{
    type: String,
    trim: true
  }],
  jobRoles: [{
    type: String,
    trim: true
  }],
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },

  // Skills pathways
  pathways: [{
    name: String,
    description: String,
    skills: [{
      skillId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill'
      },
      order: Number,
      isOptional: {
        type: Boolean,
        default: false
      }
    }]
  }],

  // Resources and references
  resources: [{
    type: {
      type: String,
      enum: ['article', 'video', 'course', 'book', 'tool', 'documentation'],
      required: true
    },
    title: String,
    url: String,
    description: String,
    author: String,
    isPremium: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      min: 0,
      max: 5
    }
  }],

  // Visualization data
  visualization: {
    type: {
      type: String,
      enum: ['programming', 'design', 'business', 'science', 'language', 'health', 'cooking'],
      default: 'programming'
    },
    color: {
      type: String,
      default: '#3b82f6'
    },
    icon: String,
    customData: mongoose.Schema.Types.Mixed
  },

  // Content metadata
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  publishedAt: Date,

  // Statistics
  stats: {
    enrolledCount: {
      type: Number,
      default: 0
    },
    completedCount: {
      type: Number,
      default: 0
    },
    averageCompletionTime: Number,
    viewCount: {
      type: Number,
      default: 0
    }
  },

  // SEO and metadata
  seo: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String
  },

  // Versioning
  version: {
    type: String,
    default: '1.0.0'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: String, // User ID from user service
    required: true
  },
  updatedBy: String

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
skillSchema.index({ name: 'text', description: 'text', tags: 'text' });
skillSchema.index({ category: 1, subcategory: 1 });
skillSchema.index({ difficulty: 1 });
skillSchema.index({ popularity: -1 });
skillSchema.index({ 'rating.average': -1 });
skillSchema.index({ slug: 1 });
skillSchema.index({ isActive: 1, isPublic: 1 });
skillSchema.index({ createdAt: -1 });

// Virtual for completion rate
skillSchema.virtual('completionRate').get(function() {
  if (this.stats.enrolledCount === 0) return 0;
  return (this.stats.completedCount / this.stats.enrolledCount) * 100;
});

// Virtual for skill level progression
skillSchema.virtual('levelProgression').get(function() {
  const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
  const currentIndex = levels.indexOf(this.difficulty);
  return {
    current: this.difficulty,
    currentIndex,
    next: levels[currentIndex + 1] || null,
    previous: levels[currentIndex - 1] || null
  };
});

// Pre-save middleware
skillSchema.pre('save', function(next) {
  // Generate slug from name if not provided
  if (!this.slug) {
    this.slug = this.name.toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Update lastUpdated timestamp
  this.lastUpdated = new Date();

  next();
});

// Static methods
skillSchema.statics.findByCategory = function(category, options = {}) {
  const query = { category, isActive: true, isPublic: true };
  return this.find(query, null, options);
};

skillSchema.statics.findPopular = function(limit = 10) {
  return this.find({ isActive: true, isPublic: true })
    .sort({ popularity: -1, 'rating.average': -1 })
    .limit(limit);
};

skillSchema.statics.search = function(searchTerm, options = {}) {
  const query = {
    $text: { $search: searchTerm },
    isActive: true,
    isPublic: true
  };

  return this.find(query, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' }, popularity: -1 })
    .limit(options.limit || 20);
};

// Instance methods
skillSchema.methods.addPrerequisite = function(prerequisiteSkill, required = true, proficiencyLevel = 'basic') {
  this.prerequisites.push({
    skillId: prerequisiteSkill._id,
    name: prerequisiteSkill.name,
    required,
    proficiencyLevel
  });
  return this.save();
};

skillSchema.methods.removePrerequisite = function(skillId) {
  this.prerequisites = this.prerequisites.filter(
    prereq => !prereq.skillId.equals(skillId)
  );
  return this.save();
};

skillSchema.methods.updateStats = function(statsUpdate) {
  Object.assign(this.stats, statsUpdate);
  return this.save();
};

skillSchema.methods.incrementView = function() {
  this.stats.viewCount += 1;
  return this.save();
};

module.exports = mongoose.model('Skill', skillSchema);