const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const sharp = require('sharp');
const AWS = require('aws-sdk');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const Jimp = require('jimp');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const mime = require('mime-types');
const { fromBuffer } = require('file-type');

const logger = require('../../shared/logger');
const PerformanceOptimizer = require('../../shared/performance/PerformanceOptimizer');
const CacheManager = require('../../shared/cache/CacheManager');

const app = express();
const PORT = process.env.PORT || 3004;

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'skill-circle-content';

// Performance optimization
const optimizer = new PerformanceOptimizer({
  clustering: process.env.NODE_ENV === 'production',
  compression: true,
  caching: true
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skill_circle_content', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Redis connection
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

// Cache manager
const cacheManager = new CacheManager({
  redis,
  defaultTTL: 3600,
  memoryCache: true
});

// Content Schema
const ContentSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: uuidv4 },
  title: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['video', 'audio', 'image', 'document', 'presentation', 'interactive', 'quiz'],
    required: true
  },
  category: String,
  subcategory: String,
  tags: [String],

  // File information
  originalFile: {
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
    s3Key: String
  },

  // Processed versions
  versions: [{
    quality: String, // 'low', 'medium', 'high', 'original'
    format: String,
    size: Number,
    url: String,
    s3Key: String,
    dimensions: {
      width: Number,
      height: Number
    },
    duration: Number, // for videos/audio
    bitrate: Number
  }],

  // Thumbnails and previews
  thumbnails: [{
    size: String, // 'small', 'medium', 'large'
    url: String,
    s3Key: String,
    dimensions: {
      width: Number,
      height: Number
    }
  }],

  // Content metadata
  metadata: {
    duration: Number, // seconds for video/audio
    resolution: {
      width: Number,
      height: Number
    },
    codec: String,
    bitrate: Number,
    frameRate: Number,
    aspectRatio: String,
    language: String,
    subtitles: [{
      language: String,
      url: String,
      s3Key: String
    }],
    chapters: [{
      title: String,
      startTime: Number,
      endTime: Number,
      description: String
    }]
  },

  // Text content (extracted from documents)
  textContent: {
    fullText: String,
    summary: String,
    keywords: [String]
  },

  // Interactive content
  interactive: {
    type: String, // 'h5p', 'custom', 'embed'
    config: mongoose.Schema.Types.Mixed,
    embedCode: String,
    interactionData: mongoose.Schema.Types.Mixed
  },

  // Access control
  visibility: {
    type: String,
    enum: ['public', 'private', 'restricted'],
    default: 'private'
  },
  accessControl: {
    allowedRoles: [String],
    allowedUsers: [String],
    courseRestricted: Boolean,
    courseIds: [String]
  },

  // Analytics
  analytics: {
    viewCount: { type: Number, default: 0 },
    downloadCount: { type: Number, default: 0 },
    engagementScore: { type: Number, default: 0 },
    averageWatchTime: Number,
    completionRate: Number
  },

  // Processing status
  processing: {
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    progress: { type: Number, default: 0 },
    error: String,
    startedAt: Date,
    completedAt: Date
  },

  // Ownership and tracking
  createdBy: { type: String, required: true },
  updatedBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ContentSchema.index({ type: 1, category: 1 });
ContentSchema.index({ tags: 1 });
ContentSchema.index({ createdBy: 1 });
ContentSchema.index({ 'textContent.fullText': 'text', title: 'text', description: 'text' });

const Content = mongoose.model('Content', ContentSchema);

// Storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types - we'll validate in the route
    cb(null, true);
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Lower limit for content service due to large files
  message: 'Too many requests from this IP'
});
app.use(limiter);

// Performance monitoring
app.use(optimizer.getMetricsMiddleware());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'content-secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Utility Functions

// Upload file to S3
async function uploadToS3(buffer, key, contentType) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    ServerSideEncryption: 'AES256'
  };

  const result = await s3.upload(params).promise();
  return result.Location;
}

// Generate S3 signed URL
function getSignedUrl(s3Key, expiresIn = 3600) {
  return s3.getSignedUrl('getObject', {
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Expires: expiresIn
  });
}

// Process image
async function processImage(buffer, options = {}) {
  const { width, height, quality = 80, format = 'jpeg' } = options;

  let processor = sharp(buffer);

  if (width || height) {
    processor = processor.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  if (format === 'jpeg') {
    processor = processor.jpeg({ quality });
  } else if (format === 'png') {
    processor = processor.png({ quality });
  } else if (format === 'webp') {
    processor = processor.webp({ quality });
  }

  return processor.toBuffer();
}

// Process video
async function processVideo(inputPath, outputPath, options = {}) {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath);

    if (options.resolution) {
      command = command.size(options.resolution);
    }

    if (options.bitrate) {
      command = command.videoBitrate(options.bitrate);
    }

    if (options.codec) {
      command = command.videoCodec(options.codec);
    }

    command
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}

// Extract text from document
async function extractTextFromDocument(buffer, mimeType) {
  try {
    if (mimeType === 'application/pdf') {
      const data = await pdfParse(buffer);
      return data.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    return '';
  } catch (error) {
    logger.error('Error extracting text:', error);
    return '';
  }
}

// Content Routes

// Upload content
app.post('/api/content/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description, category, subcategory, tags, visibility = 'private' } = req.body;
    const file = req.file;

    // Detect file type
    const fileType = await fromBuffer(file.buffer);
    const mimeType = fileType ? fileType.mime : file.mimetype;

    // Determine content type
    let contentType;
    if (mimeType.startsWith('image/')) {
      contentType = 'image';
    } else if (mimeType.startsWith('video/')) {
      contentType = 'video';
    } else if (mimeType.startsWith('audio/')) {
      contentType = 'audio';
    } else if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('presentation')) {
      contentType = 'document';
    } else {
      contentType = 'document'; // Default
    }

    // Create content record
    const contentId = uuidv4();
    const s3Key = `content/${contentId}/${file.originalname}`;

    // Upload original file to S3
    const originalUrl = await uploadToS3(file.buffer, s3Key, mimeType);

    const content = new Content({
      id: contentId,
      title,
      description,
      type: contentType,
      category,
      subcategory,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      originalFile: {
        filename: file.originalname,
        originalName: file.originalname,
        mimeType,
        size: file.size,
        url: originalUrl,
        s3Key
      },
      visibility,
      createdBy: req.user.id,
      processing: {
        status: 'pending',
        progress: 0,
        startedAt: new Date()
      }
    });

    await content.save();

    // Start background processing
    processContentAsync(content);

    res.status(201).json({
      id: content.id,
      title: content.title,
      type: content.type,
      status: content.processing.status,
      message: 'Content uploaded successfully and processing started'
    });

  } catch (error) {
    logger.error('Error uploading content:', error);
    res.status(500).json({ error: 'Failed to upload content' });
  }
});

// Background content processing
async function processContentAsync(content) {
  try {
    await Content.findByIdAndUpdate(content._id, {
      'processing.status': 'processing',
      'processing.progress': 10
    });

    // Download original file for processing
    const s3Object = await s3.getObject({
      Bucket: BUCKET_NAME,
      Key: content.originalFile.s3Key
    }).promise();

    const buffer = s3Object.Body;

    if (content.type === 'image') {
      await processImageContent(content, buffer);
    } else if (content.type === 'video') {
      await processVideoContent(content, buffer);
    } else if (content.type === 'audio') {
      await processAudioContent(content, buffer);
    } else if (content.type === 'document') {
      await processDocumentContent(content, buffer);
    }

    await Content.findByIdAndUpdate(content._id, {
      'processing.status': 'completed',
      'processing.progress': 100,
      'processing.completedAt': new Date()
    });

    logger.info(`Content processing completed: ${content.id}`);

  } catch (error) {
    logger.error(`Error processing content ${content.id}:`, error);

    await Content.findByIdAndUpdate(content._id, {
      'processing.status': 'failed',
      'processing.error': error.message,
      'processing.completedAt': new Date()
    });
  }
}

// Process image content
async function processImageContent(content, buffer) {
  const versions = [];
  const thumbnails = [];

  // Generate different sizes
  const sizes = [
    { name: 'small', width: 400, quality: 70 },
    { name: 'medium', width: 800, quality: 80 },
    { name: 'large', width: 1200, quality: 85 },
    { name: 'original', quality: 95 }
  ];

  for (const size of sizes) {
    const processedBuffer = await processImage(buffer, size);
    const s3Key = `content/${content.id}/versions/${size.name}.jpg`;
    const url = await uploadToS3(processedBuffer, s3Key, 'image/jpeg');

    const metadata = await sharp(processedBuffer).metadata();

    versions.push({
      quality: size.name,
      format: 'jpeg',
      size: processedBuffer.length,
      url,
      s3Key,
      dimensions: {
        width: metadata.width,
        height: metadata.height
      }
    });
  }

  // Generate thumbnails
  const thumbSizes = [
    { name: 'small', width: 150, height: 150 },
    { name: 'medium', width: 300, height: 300 },
    { name: 'large', width: 500, height: 500 }
  ];

  for (const thumbSize of thumbSizes) {
    const thumbBuffer = await processImage(buffer, {
      width: thumbSize.width,
      height: thumbSize.height,
      quality: 80
    });

    const s3Key = `content/${content.id}/thumbnails/${thumbSize.name}.jpg`;
    const url = await uploadToS3(thumbBuffer, s3Key, 'image/jpeg');

    thumbnails.push({
      size: thumbSize.name,
      url,
      s3Key,
      dimensions: thumbSize
    });
  }

  await Content.findByIdAndUpdate(content._id, {
    versions,
    thumbnails,
    'processing.progress': 80
  });
}

// Process document content
async function processDocumentContent(content, buffer) {
  // Extract text content
  const textContent = await extractTextFromDocument(buffer, content.originalFile.mimeType);

  // Generate keywords (simple implementation)
  const keywords = textContent
    .toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3)
    .reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

  const topKeywords = Object.entries(keywords)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([word]) => word);

  // Generate summary (first 500 characters)
  const summary = textContent.substring(0, 500) + (textContent.length > 500 ? '...' : '');

  await Content.findByIdAndUpdate(content._id, {
    textContent: {
      fullText: textContent,
      summary,
      keywords: topKeywords
    },
    'processing.progress': 80
  });
}

// Get content list
app.get('/api/content', authenticateToken, async (req, res) => {
  try {
    const {
      type,
      category,
      tags,
      search,
      visibility,
      sort = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};

    // Access control
    if (req.user.role !== 'admin') {
      filter.$or = [
        { createdBy: req.user.id },
        { visibility: 'public' },
        { 'accessControl.allowedUsers': req.user.id },
        { 'accessControl.allowedRoles': { $in: req.user.roles || [] } }
      ];
    }

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (visibility) filter.visibility = visibility;
    if (tags) filter.tags = { $in: tags.split(',') };

    if (search) {
      filter.$text = { $search: search };
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sort]: sortOrder };

    const skip = (page - 1) * limit;

    const [contents, total] = await Promise.all([
      Content.find(filter)
        .select('-textContent.fullText') // Exclude large text content
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Content.countDocuments(filter)
    ]);

    res.json({
      contents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Get content by ID
app.get('/api/content/:id', authenticateToken, async (req, res) => {
  try {
    const content = await Content.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }]
    }).lean();

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Check access permissions
    if (content.visibility === 'private' &&
        content.createdBy !== req.user.id &&
        req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Generate signed URLs for secure access
    if (content.originalFile?.s3Key) {
      content.originalFile.signedUrl = getSignedUrl(content.originalFile.s3Key);
    }

    content.versions?.forEach(version => {
      if (version.s3Key) {
        version.signedUrl = getSignedUrl(version.s3Key);
      }
    });

    content.thumbnails?.forEach(thumbnail => {
      if (thumbnail.s3Key) {
        thumbnail.signedUrl = getSignedUrl(thumbnail.s3Key);
      }
    });

    // Increment view count
    await Content.findByIdAndUpdate(content._id, {
      $inc: { 'analytics.viewCount': 1 }
    });

    res.json(content);

  } catch (error) {
    logger.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

// Update content
app.put('/api/content/:id', authenticateToken, async (req, res) => {
  try {
    const content = await Content.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }]
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Check permissions
    if (content.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedContent = await Content.findByIdAndUpdate(
      content._id,
      {
        ...req.body,
        updatedBy: req.user.id,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json(updatedContent);

  } catch (error) {
    logger.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

// Delete content
app.delete('/api/content/:id', authenticateToken, async (req, res) => {
  try {
    const content = await Content.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }]
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Check permissions
    if (content.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete files from S3
    const s3Keys = [content.originalFile?.s3Key]
      .concat(content.versions?.map(v => v.s3Key) || [])
      .concat(content.thumbnails?.map(t => t.s3Key) || [])
      .filter(Boolean);

    if (s3Keys.length > 0) {
      await s3.deleteObjects({
        Bucket: BUCKET_NAME,
        Delete: {
          Objects: s3Keys.map(Key => ({ Key }))
        }
      }).promise();
    }

    await Content.findByIdAndDelete(content._id);

    res.json({ message: 'Content deleted successfully' });

  } catch (error) {
    logger.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

// Search content
app.get('/api/content/search', authenticateToken, async (req, res) => {
  try {
    const { q, type, category, page = 1, limit = 20 } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }

    const filter = {
      $text: { $search: q },
      $or: [
        { visibility: 'public' },
        { createdBy: req.user.id }
      ]
    };

    if (type) filter.type = type;
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    const contents = await Content.find(filter, { score: { $meta: 'textScore' } })
      .select('-textContent.fullText')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.json({ contents });

  } catch (error) {
    logger.error('Error searching content:', error);
    res.status(500).json({ error: 'Failed to search content' });
  }
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    await redis.ping();

    res.json({
      status: 'healthy',
      service: 'content-service',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Error handling
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
if (require.main === module) {
  optimizer.setupClustering(() => {
    const server = app.listen(PORT, () => {
      logger.info(`Content Service running on port ${PORT}`);
    });

    optimizer.setupGracefulShutdown(server, async () => {
      await mongoose.connection.close();
      await redis.disconnect();
    });
  });
}

module.exports = app;