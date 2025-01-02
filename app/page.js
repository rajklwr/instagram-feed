import InstagramFeed from './components/InstagramFeed';

export default function Home() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>My Instagram Feed</h1>
        <p style={styles.subtitle}>Explore my latest Instagram posts below!</p>
      </header>
      <InstagramFeed />
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#555',
  },
};
