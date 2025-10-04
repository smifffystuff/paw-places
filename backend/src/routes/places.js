import { getDB } from '../db.js';
import { ObjectId } from 'mongodb';

export async function placesRoutes(fastify) {
  // Get nearby places
  fastify.get('/places', async (request, reply) => {
    const { near, category } = request.query;
    const db = getDB();
    
    try {
      const query = {};
      
      // Filter by category if provided
      if (category) {
        query.category = category;
      }

      // If near coordinates provided, use geospatial query
      if (near) {
        const [lng, lat] = near.split(',').map(parseFloat);
        query.geo = {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            $maxDistance: 10000 // 10km radius
          }
        };
      }

      const places = await db.collection('places')
        .find(query)
        .limit(50)
        .toArray();

      return { places };
    } catch (error) {
      console.error('Error fetching places:', error);
      return reply.code(500).send({ error: 'Failed to fetch places' });
    }
  });

  // Get a single place by ID
  fastify.get('/places/:id', async (request, reply) => {
    const { id } = request.params;
    const db = getDB();

    try {
      const place = await db.collection('places').findOne({ _id: new ObjectId(id) });
      
      if (!place) {
        return reply.code(404).send({ error: 'Place not found' });
      }

      return { place };
    } catch (error) {
      console.error('Error fetching place:', error);
      return reply.code(500).send({ error: 'Failed to fetch place' });
    }
  });

  // Add a new place (protected route)
  fastify.post('/places', {
    preHandler: fastify.auth
  }, async (request, reply) => {
    const { name, category, description, geo, tags, photos } = request.body;
    const db = getDB();

    try {
      const newPlace = {
        name,
        category,
        description: description || '',
        geo: {
          type: 'Point',
          coordinates: [geo.lng, geo.lat]
        },
        tags: tags || [],
        photos: photos || [],
        addedBy: request.user.clerkId,
        createdAt: new Date()
      };

      const result = await db.collection('places').insertOne(newPlace);

      return reply.code(201).send({ 
        success: true, 
        placeId: result.insertedId 
      });
    } catch (error) {
      console.error('Error adding place:', error);
      return reply.code(500).send({ error: 'Failed to add place' });
    }
  });

  // Get reviews for a place
  fastify.get('/places/:id/reviews', async (request, reply) => {
    const { id } = request.params;
    const db = getDB();

    try {
      const reviews = await db.collection('reviews')
        .find({ placeId: new ObjectId(id) })
        .sort({ createdAt: -1 })
        .toArray();

      return { reviews };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return reply.code(500).send({ error: 'Failed to fetch reviews' });
    }
  });

  // Add a review to a place (protected route)
  fastify.post('/places/:id/reviews', {
    preHandler: fastify.auth
  }, async (request, reply) => {
    const { id } = request.params;
    const { text, rating, photos } = request.body;
    const db = getDB();

    try {
      const newReview = {
        placeId: new ObjectId(id),
        userId: request.user.clerkId,
        text,
        rating,
        photos: photos || [],
        createdAt: new Date()
      };

      const result = await db.collection('reviews').insertOne(newReview);

      return reply.code(201).send({ 
        success: true, 
        reviewId: result.insertedId 
      });
    } catch (error) {
      console.error('Error adding review:', error);
      return reply.code(500).send({ error: 'Failed to add review' });
    }
  });
}
