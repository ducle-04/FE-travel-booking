import React, { useState } from 'react';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import BlogForm from './components/BlogForm';

function App() {
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [blogsUpdated, setBlogsUpdated] = useState(false);

  const handleSelect = (id) => setSelectedBlogId(id);
  const handleAdd = () => setBlogsUpdated(!blogsUpdated); // cập nhật list

  return (
    <div>
      <BlogForm onAdd={handleAdd} />
      <BlogList key={blogsUpdated} onSelect={handleSelect} />
      <BlogDetail id={selectedBlogId} />
    </div>
  );
}

export default App;