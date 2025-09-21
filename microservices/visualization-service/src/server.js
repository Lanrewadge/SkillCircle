const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const { createCanvas, loadImage } = require('canvas');
const sharp = require('sharp');
const puppeteer = require('puppeteer');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const logger = require('../../shared/logger');
const PerformanceOptimizer = require('../../shared/performance/PerformanceOptimizer');
const CacheManager = require('../../shared/cache/CacheManager');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3005;

// Performance optimization
const optimizer = new PerformanceOptimizer({
  clustering: false, // Disable clustering for WebSocket service
  compression: true,
  caching: true
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skill_circle_visualizations', {
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

// Visualization Schema
const VisualizationSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: uuidv4 },
  title: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: [
      'interactive_diagram', 'skill_roadmap', 'progress_chart', 'concept_map',
      'flowchart', 'timeline', 'graph_network', 'dashboard', 'infographic',
      'simulation', '3d_model', 'animated_chart'
    ],
    required: true
  },
  category: String,
  subcategory: String,
  tags: [String],

  // Visualization configuration
  config: {
    // Canvas/SVG properties
    dimensions: {
      width: { type: Number, default: 800 },
      height: { type: Number, default: 600 }
    },

    // Interactive elements
    interactive: {
      enabled: { type: Boolean, default: true },
      zoomable: { type: Boolean, default: true },
      draggable: { type: Boolean, default: false },
      clickable: { type: Boolean, default: true },
      hoverable: { type: Boolean, default: true }
    },

    // Animation settings
    animation: {
      enabled: { type: Boolean, default: false },
      duration: { type: Number, default: 1000 },
      easing: { type: String, default: 'ease-in-out' },
      autoplay: { type: Boolean, default: false }
    },

    // Color scheme
    colors: {
      primary: { type: String, default: '#2196F3' },
      secondary: { type: String, default: '#4CAF50' },
      accent: { type: String, default: '#FF9800' },
      background: { type: String, default: '#FFFFFF' },
      text: { type: String, default: '#212121' }
    },

    // Typography
    typography: {
      fontFamily: { type: String, default: 'Arial, sans-serif' },
      fontSize: { type: Number, default: 14 },
      fontWeight: { type: String, default: 'normal' }
    }
  },

  // Data structure
  data: {
    // Nodes for network/graph visualizations
    nodes: [{
      id: String,
      label: String,
      type: String,
      position: { x: Number, y: Number },
      properties: mongoose.Schema.Types.Mixed,
      style: mongoose.Schema.Types.Mixed
    }],

    // Edges/connections
    edges: [{
      id: String,
      source: String,
      target: String,
      label: String,
      type: String,
      properties: mongoose.Schema.Types.Mixed,
      style: mongoose.Schema.Types.Mixed
    }],

    // Chart data
    charts: [{
      type: String, // 'bar', 'line', 'pie', 'scatter', etc.
      data: mongoose.Schema.Types.Mixed,
      options: mongoose.Schema.Types.Mixed
    }],

    // Custom data
    custom: mongoose.Schema.Types.Mixed
  },

  // Generated assets
  assets: {
    // Static images
    images: [{
      format: String, // 'png', 'jpg', 'svg'
      size: String, // 'small', 'medium', 'large'
      url: String,
      s3Key: String,
      dimensions: { width: Number, height: Number }
    }],

    // Interactive versions
    interactive: {
      html: String,
      css: String,
      javascript: String,
      htmlUrl: String
    },

    // 3D models
    models: [{
      format: String, // 'gltf', 'obj', 'fbx'
      url: String,
      s3Key: String,
      size: Number
    }]
  },

  // Interaction analytics
  analytics: {
    views: { type: Number, default: 0 },
    interactions: { type: Number, default: 0 },
    averageEngagementTime: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    hotspots: [{
      elementId: String,
      clickCount: { type: Number, default: 0 },
      hoverCount: { type: Number, default: 0 }
    }]
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
    courseIds: [String]
  },

  // Version control
  version: { type: Number, default: 1 },
  parentId: String, // For version history

  // Ownership
  createdBy: { type: String, required: true },
  updatedBy: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

VisualizationSchema.index({ type: 1, category: 1 });
VisualizationSchema.index({ tags: 1 });
VisualizationSchema.index({ createdBy: 1 });

const Visualization = mongoose.model('Visualization', VisualizationSchema);

// Template Schema for reusable visualization templates
const TemplateSchema = new mongoose.Schema({
  id: { type: String, unique: true, default: uuidv4 },
  name: { type: String, required: true },
  description: String,
  type: String,
  category: String,

  // Template configuration
  template: {
    config: mongoose.Schema.Types.Mixed,
    dataStructure: mongoose.Schema.Types.Mixed,
    defaultData: mongoose.Schema.Types.Mixed
  },

  // Preview
  preview: {
    thumbnail: String,
    description: String
  },

  isPublic: { type: Boolean, default: false },
  usageCount: { type: Number, default: 0 },
  createdBy: String,
  createdAt: { type: Date, default: Date.now }
});

const Template = mongoose.model('Template', TemplateSchema);

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
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

  jwt.verify(token, process.env.JWT_SECRET || 'visualization-secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Visualization Generation Functions

// Generate skill roadmap visualization
async function generateSkillRoadmap(data) {
  const { skills, connections, userProgress = {} } = data;

  const width = 1200;
  const height = 800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, width, height);

  // Draw skills as nodes
  skills.forEach((skill, index) => {
    const x = 100 + (index % 4) * 250;
    const y = 100 + Math.floor(index / 4) * 150;

    // Node circle
    ctx.beginPath();
    const isCompleted = userProgress[skill.id]?.completed;
    const isInProgress = userProgress[skill.id]?.inProgress;

    ctx.fillStyle = isCompleted ? '#4CAF50' : isInProgress ? '#FF9800' : '#2196F3';
    ctx.arc(x, y, 40, 0, 2 * Math.PI);
    ctx.fill();

    // Skill label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(skill.name, x, y + 5);

    // Progress indicator
    if (userProgress[skill.id]?.progress) {
      ctx.beginPath();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      const progress = userProgress[skill.id].progress / 100;
      ctx.arc(x, y, 45, -Math.PI/2, -Math.PI/2 + (2 * Math.PI * progress));
      ctx.stroke();
    }
  });

  // Draw connections
  connections.forEach(connection => {
    const sourceSkill = skills.find(s => s.id === connection.source);
    const targetSkill = skills.find(s => s.id === connection.target);

    if (sourceSkill && targetSkill) {
      const sourceIndex = skills.indexOf(sourceSkill);
      const targetIndex = skills.indexOf(targetSkill);

      const x1 = 100 + (sourceIndex % 4) * 250;
      const y1 = 100 + Math.floor(sourceIndex / 4) * 150;
      const x2 = 100 + (targetIndex % 4) * 250;
      const y2 = 100 + Math.floor(targetIndex / 4) * 150;

      ctx.beginPath();
      ctx.strokeStyle = '#9E9E9E';
      ctx.lineWidth = 2;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Arrow head
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2 - 15 * Math.cos(angle - Math.PI/6), y2 - 15 * Math.sin(angle - Math.PI/6));
      ctx.lineTo(x2, y2);
      ctx.lineTo(x2 - 15 * Math.cos(angle + Math.PI/6), y2 - 15 * Math.sin(angle + Math.PI/6));
      ctx.stroke();
    }
  });

  return canvas.toBuffer('image/png');
}

// Generate interactive concept map
function generateConceptMapHTML(data) {
  const { concepts, relationships } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Interactive Concept Map</title>
      <script src="https://d3js.org/d3.v7.min.js"></script>
      <style>
        .node circle { stroke: #fff; stroke-width: 3px; }
        .node text { font: 12px sans-serif; }
        .link { stroke: #999; stroke-opacity: 0.6; }
        .tooltip { position: absolute; background: rgba(0,0,0,0.8); color: white; padding: 8px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div id="visualization"></div>
      <script>
        const data = ${JSON.stringify({ concepts, relationships })};

        const width = 800;
        const height = 600;

        const svg = d3.select("#visualization")
          .append("svg")
          .attr("width", width)
          .attr("height", height);

        const simulation = d3.forceSimulation(data.concepts)
          .force("link", d3.forceLink(data.relationships).id(d => d.id))
          .force("charge", d3.forceManyBody().strength(-200))
          .force("center", d3.forceCenter(width / 2, height / 2));

        const link = svg.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(data.relationships)
          .enter().append("line")
          .attr("class", "link");

        const node = svg.append("g")
          .attr("class", "nodes")
          .selectAll("g")
          .data(data.concepts)
          .enter().append("g")
          .attr("class", "node")
          .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        node.append("circle")
          .attr("r", d => d.importance * 10 + 10)
          .attr("fill", d => d.category === 'core' ? '#2196F3' : '#4CAF50');

        node.append("text")
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text(d => d.name);

        simulation.on("tick", () => {
          link.attr("x1", d => d.source.x)
              .attr("y1", d => d.source.y)
              .attr("x2", d => d.target.x)
              .attr("y2", d => d.target.y);

          node.attr("transform", d => "translate(" + d.x + "," + d.y + ")");
        });

        function dragstarted(event, d) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(event, d) {
          d.fx = event.x;
          d.fy = event.y;
        }

        function dragended(event, d) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
      </script>
    </body>
    </html>
  `;
}

// API Routes

// Get all visualizations
app.get('/api/visualizations', authenticateToken, async (req, res) => {
  try {
    const {
      type,
      category,
      tags,
      search,
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
        { 'accessControl.allowedUsers': req.user.id }
      ];
    }

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (tags) filter.tags = { $in: tags.split(',') };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOrder = order === 'desc' ? -1 : 1;
    const sortObj = { [sort]: sortOrder };

    const skip = (page - 1) * limit;

    const [visualizations, total] = await Promise.all([
      Visualization.find(filter)
        .select('-data -assets.interactive.html -assets.interactive.css -assets.interactive.javascript')
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Visualization.countDocuments(filter)
    ]);

    res.json({
      visualizations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Error fetching visualizations:', error);
    res.status(500).json({ error: 'Failed to fetch visualizations' });
  }
});

// Create new visualization
app.post('/api/visualizations', authenticateToken, async (req, res) => {
  try {
    const visualizationData = {
      ...req.body,
      id: uuidv4(),
      createdBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const visualization = new Visualization(visualizationData);
    await visualization.save();

    // Generate assets based on type
    await generateVisualizationAssets(visualization);

    logger.info(`Visualization created: ${visualization.id}`);
    res.status(201).json(visualization);

  } catch (error) {
    logger.error('Error creating visualization:', error);
    res.status(500).json({ error: 'Failed to create visualization' });
  }
});

// Generate visualization assets
async function generateVisualizationAssets(visualization) {
  try {
    const assets = { images: [], interactive: {}, models: [] };

    switch (visualization.type) {
      case 'skill_roadmap':
        const roadmapImage = await generateSkillRoadmap(visualization.data);
        // In a real implementation, you'd upload this to S3
        assets.images.push({
          format: 'png',
          size: 'large',
          url: `/temp/${visualization.id}_roadmap.png`,
          dimensions: { width: 1200, height: 800 }
        });
        break;

      case 'concept_map':
        const conceptMapHTML = generateConceptMapHTML(visualization.data);
        assets.interactive.html = conceptMapHTML;
        break;

      case 'interactive_diagram':
        // Generate interactive diagram assets
        break;

      default:
        logger.info(`No specific asset generation for type: ${visualization.type}`);
    }

    await Visualization.findByIdAndUpdate(visualization._id, { assets });

  } catch (error) {
    logger.error('Error generating visualization assets:', error);
  }
}

// Get visualization by ID
app.get('/api/visualizations/:id', authenticateToken, async (req, res) => {
  try {
    const visualization = await Visualization.findOne({
      $or: [{ id: req.params.id }, { _id: req.params.id }]
    }).lean();

    if (!visualization) {
      return res.status(404).json({ error: 'Visualization not found' });
    }

    // Check access permissions
    if (visualization.visibility === 'private' &&
        visualization.createdBy !== req.user.id &&
        req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Increment view count
    await Visualization.findByIdAndUpdate(visualization._id, {
      $inc: { 'analytics.views': 1 }
    });

    res.json(visualization);

  } catch (error) {
    logger.error('Error fetching visualization:', error);
    res.status(500).json({ error: 'Failed to fetch visualization' });
  }
});

// Get visualization templates
app.get('/api/templates', async (req, res) => {
  try {
    const { type, category, page = 1, limit = 20 } = req.query;

    const filter = { isPublic: true };
    if (type) filter.type = type;
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    const templates = await Template.find(filter)
      .sort({ usageCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.json({ templates });

  } catch (error) {
    logger.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Create visualization from template
app.post('/api/visualizations/from-template/:templateId', authenticateToken, async (req, res) => {
  try {
    const template = await Template.findOne({
      $or: [{ id: req.params.templateId }, { _id: req.params.templateId }]
    });

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const visualizationData = {
      ...req.body,
      id: uuidv4(),
      config: { ...template.template.config, ...req.body.config },
      data: { ...template.template.defaultData, ...req.body.data },
      createdBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const visualization = new Visualization(visualizationData);
    await visualization.save();

    // Increment template usage count
    await Template.findByIdAndUpdate(template._id, {
      $inc: { usageCount: 1 }
    });

    // Generate assets
    await generateVisualizationAssets(visualization);

    res.status(201).json(visualization);

  } catch (error) {
    logger.error('Error creating visualization from template:', error);
    res.status(500).json({ error: 'Failed to create visualization from template' });
  }
});

// WebSocket connections for real-time collaboration
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('join-visualization', (visualizationId) => {
    socket.join(visualizationId);
    logger.info(`Client ${socket.id} joined visualization ${visualizationId}`);
  });

  socket.on('visualization-update', (data) => {
    const { visualizationId, update } = data;
    socket.to(visualizationId).emit('visualization-updated', update);
  });

  socket.on('interaction', (data) => {
    const { visualizationId, elementId, action } = data;

    // Track interaction analytics
    Visualization.findOneAndUpdate(
      { $or: [{ id: visualizationId }, { _id: visualizationId }] },
      {
        $inc: {
          'analytics.interactions': 1,
          [`analytics.hotspots.${elementId}.${action}Count`]: 1
        }
      }
    ).catch(error => logger.error('Error updating interaction analytics:', error));

    socket.to(visualizationId).emit('user-interaction', data);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    await redis.ping();

    res.json({
      status: 'healthy',
      service: 'visualization-service',
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
  server.listen(PORT, () => {
    logger.info(`Visualization Service running on port ${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
      mongoose.connection.close();
      redis.disconnect();
      process.exit(0);
    });
  });
}

module.exports = { app, server };