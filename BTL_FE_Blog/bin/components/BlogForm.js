import React, { useState } from 'react';
import { createBlog } from '../services/blogService';

const BlogForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    createBlog({ title, content }).then(res => {
      onAdd(res.data);
      setTitle('');
      setContent('');
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Đăng Blog Mới</h2>
      <input 
        placeholder="Tiêu đề" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />
      <textarea 
        placeholder="Nội dung" 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
      />
      <button type="submit">Đăng</button>
    </form>
  );
};

export default BlogForm;