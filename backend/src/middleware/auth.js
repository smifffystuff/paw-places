import { clerkClient } from '@clerk/backend';

export async function authenticateRequest(request, reply) {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7);
    
    // Verify the Clerk session token
    const session = await clerkClient.sessions.verifySession(token);
    
    if (!session) {
      return reply.code(401).send({ error: 'Invalid session' });
    }

    // Attach user info to request
    request.user = {
      clerkId: session.userId,
      sessionId: session.id
    };
  } catch (error) {
    console.error('Auth error:', error);
    return reply.code(401).send({ error: 'Authentication failed' });
  }
}
