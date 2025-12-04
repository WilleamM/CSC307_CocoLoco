import React, { useState } from 'react';
import axios from 'axios';
import './CreatePost.css';
import { API_BASE_URL } from '../apiConfig.js';

function CreatePost() {
  const [isOpen, setIsOpen] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    authorId: '',
    author: '',
    title: '',
    body: '',
    visibility: 'friends',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!form.authorId || !form.author || !form.body) {
      setMessage('authorId, author, and body are required.');
      return;
    }
    const data = new FormData();
    data.append('authorId', form.authorId);
    data.append('author', form.author);
    data.append('title', form.title);
    data.append('body', form.body);
    data.append('visibility', form.visibility);
    if (form.image) {
      data.append('image', form.image);
    }

    try {
      setSubmitting(true);
      await axios.post(`${API_BASE_URL}/posts`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Post created successfully.');
      setForm({
        authorId: '',
        author: '',
        title: '',
        body: '',
        visibility: 'friends',
        image: null,
      });
    } catch (err) {
      console.error(err);
      setMessage('Failed to create post. Check console for details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-post-page">
      <button className="open-modal-btn" onClick={() => setIsOpen(true)}>
        New Post
      </button>

      {message && <div className="status">{message}</div>}

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="modal-header">
              <h2>Create Post</h2>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                ×
              </button>
            </div>

            <form className="post-form" onSubmit={handleSubmit}>
              <label>
                Author ID
                <input
                  name="authorId"
                  value={form.authorId}
                  onChange={handleChange}
                  placeholder="MongoDB user _id"
                  required
                />
              </label>

              <label>
                Author Username
                <input
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  placeholder="username"
                  required
                />
              </label>

              <label>
                Title
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Optional title"
                />
              </label>

              <label>
                Body
                <textarea
                  name="body"
                  value={form.body}
                  onChange={handleChange}
                  placeholder="What's on your mind?"
                  rows={4}
                  required
                />
              </label>

              <label>
                Visibility
                <select
                  name="visibility"
                  value={form.visibility}
                  onChange={handleChange}
                >
                  <option value="public">Public</option>
                  <option value="friends">Friends</option>
                  <option value="private">Private</option>
                </select>
              </label>

              <label>
                Image (optional)
                <input type="file" accept="image/*" onChange={handleFile} />
              </label>

              <button type="submit" disabled={submitting}>
                {submitting ? 'Creating…' : 'Create Post'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePost;
