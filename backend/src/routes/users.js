import { getDB } from '../db.js';

export async function usersRoutes(fastify) {
  // Get user profile
  fastify.get('/users/:clerkId', async (request, reply) => {
    const { clerkId } = request.params;
    const db = getDB();

    try {
      const user = await db.collection('users').findOne({ clerkId });
      
      if (!user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      // Get user's pets
      const pets = await db.collection('pets')
        .find({ userId: clerkId })
        .toArray();

      return { user: { ...user, pets } };
    } catch (error) {
      console.error('Error fetching user:', error);
      return reply.code(500).send({ error: 'Failed to fetch user' });
    }
  });

  // Create or update user profile (protected route)
  fastify.post('/users/profile', {
    preHandler: fastify.auth
  }, async (request, reply) => {
    const { name, bio, avatarUrl } = request.body;
    const db = getDB();

    try {
      const result = await db.collection('users').updateOne(
        { clerkId: request.user.clerkId },
        { 
          $set: { 
            name, 
            bio, 
            avatarUrl,
            updatedAt: new Date()
          },
          $setOnInsert: {
            clerkId: request.user.clerkId,
            createdAt: new Date()
          }
        },
        { upsert: true }
      );

      return { success: true, userId: request.user.clerkId };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return reply.code(500).send({ error: 'Failed to update profile' });
    }
  });

  // Add a pet (protected route)
  fastify.post('/users/pets', {
    preHandler: fastify.auth
  }, async (request, reply) => {
    const { name, species, breed, photoUrl } = request.body;
    const db = getDB();

    try {
      const newPet = {
        userId: request.user.clerkId,
        name,
        species,
        breed: breed || '',
        photoUrl: photoUrl || '',
        createdAt: new Date()
      };

      const result = await db.collection('pets').insertOne(newPet);

      return reply.code(201).send({ 
        success: true, 
        petId: result.insertedId 
      });
    } catch (error) {
      console.error('Error adding pet:', error);
      return reply.code(500).send({ error: 'Failed to add pet' });
    }
  });
}
