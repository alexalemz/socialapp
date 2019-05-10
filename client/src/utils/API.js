import axios from 'axios';

export default {
  login: function(data) {
    return axios.post('/api/login', data);
  },
  register: function(data) {
    return axios.post('/api/register', data);
  },
  logout: function() {
    return axios.get('/api/logout');
  },
  user_data: function() {
    return axios.get('/api/user_data');
  },
  getUsers: function(data) {
    return axios.get('/api/users', {params: data});
  },
  getUserProfile: function(data) {
    return axios.get('/api/users/profile', {params: data});
  },
  follow: function(data) {
    return axios.post('/api/users/follow', data);
  },
  unfollow: function(data) {
    return axios.delete('/api/users/follow', {data: data});
  },
  getPosts: function(data) {
    return axios.get('/api/posts', {params: data});
  },
  getPostDetails: function(postId, data) {
    return axios.get(`/api/posts/${postId}`, {params: data});
  },
  getHomeFeed: function(data) {
    return axios.get('/api/posts/homefeed', {params: data});
  },
  createPost: function(data) {
    return axios.post('/api/posts', data);
  },
  createComment: function(data) {
    return axios.post('/api/comments', data);
  },
}