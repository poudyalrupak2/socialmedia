import axios from 'axios'


const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }
  
    return req;
  });
  // Response interceptor to track errors and handle logout on token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired, so log the user out
      console.error("Authorization error: Invalid or expired token");
      localStorage.removeItem('profile'); // Clear stored token
      window.location.href = '/auth'; // Redirect to login page
    }
    return Promise.reject(error); // Reject the error for further handling if needed
  }
);
export const addComment = (commentData) => {
  return API.post(`/comments`, commentData);
};
export const getCommentsByPostId = (id) => {
  return API.get(`/comments/${id}`);
};

export const getTimelinePosts= (id)=> API.get(`/posts/${id}/timeline`);
export const likePost=(id, userId)=>API.put(`posts/${id}/like`, {userId: userId})