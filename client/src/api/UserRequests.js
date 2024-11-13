import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

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

export const getUser = (userId) => API.get(`/user/${userId}`);
export const updateUser = (id, formData) =>  API.put(`/user/${id}`, formData);
export const getAllUser = ()=> API.get('/user')
export const followUser = (id,data)=> API.put(`/user/${id}/follow`, data)
export const unfollowUser = (id, data)=> API.put(`/user/${id}/unfollow`, data)
