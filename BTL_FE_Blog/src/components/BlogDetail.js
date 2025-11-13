import React, { useEffect, useState } from 'react';
import { getBlog } from '../services/blogService';

const BlogDetail = ({ id }) => {
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (id) {
      getBlog(id).then(res => setBlog(res.data));
    }
  }, [id]);

  if (!blog) return <div>Chọn blog để xem chi tiết</div>;

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.content}</p>
    </div>
  );
};

export default BlogDetail;