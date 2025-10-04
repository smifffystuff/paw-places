import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set auth token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Places API
export const placesAPI = {
  getNearby: (params) => api.get('/places', { params }),
  getById: (id) => api.get(`/places/${id}`),
  create: (data) => api.post('/places', data),
  getReviews: (id) => api.get(`/places/${id}/reviews`),
  addReview: (id, data) => api.post(`/places/${id}/reviews`, data),
};

// Users API
export const usersAPI = {
  getProfile: (clerkId) => api.get(`/users/${clerkId}`),
  updateProfile: (data) => api.post('/users/profile', data),
  addPet: (data) => api.post('/users/pets', data),
};

// Feed API
export const feedAPI = {
  getFeed: (params) => api.get('/feed', { params }),
  createPost: (data) => api.post('/posts', data),
  likePost: (postId) => api.post(`/like/${postId}`),
  unlikePost: (postId) => api.delete(`/like/${postId}`),
};
