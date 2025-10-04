import Fastify from 'fastify';
import cors from '@fastify/cors';
import 'dotenv/config';
import { connectDB } from './db.js';
import { authenticateRequest } from './middleware/auth.js';
import { placesRoutes } from './routes/places.js';
import { usersRoutes } from './routes/users.js';
import { feedRoutes } from './routes/feed.js';

const fastify = Fastify({
  logger: true
});

// Register CORS
await fastify.register(cors, {
  origin: true // Allow all origins in development
});

// Register auth middleware as a decorator
fastify.decorate('auth', authenticateRequest);

// Connect to MongoDB
await connectDB(process.env.MONGODB_URI);

// Health check route
fastify.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Register routes
await fastify.register(placesRoutes);
await fastify.register(usersRoutes);
await fastify.register(feedRoutes);

// Start server
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
