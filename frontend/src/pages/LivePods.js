import React, { useState } from 'react';
import { toast } from 'react-toastify';

const LivePods = () => {
  const [booked, setBooked] = useState(false);
  const token = localStorage.getItem('token');

  const handleBook = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pods/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Booked successfully!');
        setBooked(true);
      } else {
        toast.error(data?.message || 'Booking failed.');
      }
    } catch (error) {
      toast.error('Network error.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>🎙️ Live Pods Booking</h2>
        <p style={styles.subtext}>
          You get <strong>1 free pod/week</strong>. Each additional pod costs <strong>50 credits</strong>.
        </p>

        <button onClick={handleBook} style={styles.bookBtn}>
          Book Pod
        </button>

        {booked && (
          <div style={styles.iframeWrapper}>
            <h4 style={{ marginBottom: '10px' }}>Live Session</h4>
            <iframe
              src="https://meet.jit.si/LanguageKonnectPod"
              width="100%"
              height="500"
              allow="camera; microphone"
              style={{ border: 'none', borderRadius: '10px' }}
              title="Live Pod"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    minHeight: '100vh',
    background: 'linear-gradient(to right, #d1f4f9, #fff)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '30px',
    maxWidth: '600px',
    width: '100%',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  header: {
    fontSize: '26px',
    color: '#1e88e5',
    marginBottom: '15px'
  },
  subtext: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '25px'
  },
  bookBtn: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background 0.3s'
  },
  iframeWrapper: {
    marginTop: '30px'
  }
};

export default LivePods;
