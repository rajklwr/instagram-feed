'use client';

import { useEffect, useState } from 'react';

const InstagramFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        const res = await fetch('/api/instagram');
        const data = await res.json();
        setPosts(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  return (
    <div style={styles.container}>
      {posts?.map((post) => (
        <div key={post.id} style={styles.card}>
          <a href={post.permalink} target="_blank" rel="noopener noreferrer">
            {post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM' ? (
              <img src={post.media_url} alt={post.caption} style={styles.image} />
            ) : post.media_type === 'VIDEO' ? (
              <video controls style={styles.image}>
                <source src={post.media_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : null}
          </a>
          <p style={styles.caption}>{post.caption || 'No caption available'}</p>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
  },
  caption: {
    padding: '10px',
    fontSize: '14px',
    color: '#333',
    borderTop: '1px solid #eee',
  },
};

export default InstagramFeed;
