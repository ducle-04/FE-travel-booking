import axios from 'axios';

const API_URL = 'http://localhost:8080/api/blogs';

export const getBlogs = () => axios.get(API_URL);
export const getBlog = (id) => axios.get(`${API_URL}/${id}`);
export const createBlog = (blog) => axios.post(API_URL, blog);