import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';

export async function feedRoutes(fastify) {
  // Get feed posts
  fastify.get('/feed', async (request, reply) => {
    const { limit = 20, skip = 0 } = request.query;
    const db = getDB();

    try {
      const posts = await db.collection('posts')
        .find({})
        .sort({ createdAt: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .toArray();

      return { posts };
    } catch (error) {
      console.error('Error fetching feed:', error);
      return reply.code(500).send({ error: 'Failed to fetch feed' });
    }
  });

  // Create a post (protected route)
  fastify.post('/posts', {
    preHandler: fastify.auth
  }, async (request, reply) => {
    const { placeId, photoUrl, caption } = request.body;
    const db = getDB();

    try {
      const newPost = {
        userId: request.user.clerkId,
        placeId: placeId ? new ObjectId(placeId) : null,
        photoUrl,
        caption: caption || '',
        createdAt: new Date()
      };

      const result = await db.collection('posts').insertOne(newPost);

      return reply.code(201).send({ 
        success: true, 
        postId: result.insertedId 
      });
    } catch (error) {
      console.error('Error creating post:', error);
      return reply.code(500).send({ error: 'Failed to create post' });
    }
  });

  // Like a post (protected route)
  fastify.post('/like/:postId', {
    preHandler: fastify.auth
  }, async (request, reply) => {
    const { postId } = request.params;
    const db = getDB();

    try {
      // Check if already liked
      const existingLike = await db.collection('likes').findOne({
        postId: new ObjectId(postId),
        userId: request.user.clerkId
      });

      if (existingLike) {
        return reply.code(400).send({ error: 'Already liked' });
      }

      const newLike = {
        postId: new ObjectId(postId),
        userId: request.user.clerkId,
        createdAt: new Date()
      };

      await db.collection('likes').insertOne(newLike);

      return { success: true };
    } catch (error) {
      console.error('Error liking post:', error);
      return reply.code(500).send({ error: 'Failed to like post' });
    }
  });

  // Unlike a post (protected route)
  fastify.delete('/like/:postId', {
    preHandler: fastify.auth
  }, async (request, reply) => {
    const { postId } = request.params;
    const db = getDB();

    try {
      await db.collection('likes').deleteOne({
        postId: new ObjectId(postId),
        userId: request.user.clerkId
      });

      return { success: true };
    } catch (error) {
      console.error('Error unliking post:', error);
      return reply.code(500).send({ error: 'Failed to unlike post' });
    }
  });
}
