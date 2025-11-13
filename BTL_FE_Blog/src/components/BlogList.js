import React, { useEffect, useState } from 'react';
import { getBlogs } from '../services/blogService';

const BlogList = ({ onSelect }) => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getBlogs().then(res => setBlogs(res.data));
  }, []);

  return (
    <div>
      <h2>Danh sách Blog</h2>
      <ul>
        {blogs.map(blog => (
          <li key={blog.id} onClick={() => onSelect(blog.id)}>
            {blog.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;