import { Express } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import skillRoutes from './skills';
import matchRoutes from './matches';
import sessionRoutes from './sessions';
import messageRoutes from './messages';
import reviewRoutes from './reviews';

export const setupRoutes = (app: Express) => {
  // API prefix
  const API_PREFIX = '/api/v1';

  // Health check
  app.get(`${API_PREFIX}/health`, (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'SkillCircle API'
    });
  });

  // Route handlers
  app.use(`${API_PREFIX}/auth`, authRoutes);
  app.use(`${API_PREFIX}/users`, userRoutes);
  app.use(`${API_PREFIX}/skills`, skillRoutes);
  app.use(`${API_PREFIX}/matches`, matchRoutes);
  app.use(`${API_PREFIX}/sessions`, sessionRoutes);
  app.use(`${API_PREFIX}/messages`, messageRoutes);
  app.use(`${API_PREFIX}/reviews`, reviewRoutes);
};