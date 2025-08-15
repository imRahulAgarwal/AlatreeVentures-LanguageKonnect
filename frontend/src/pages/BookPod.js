// src/pages/BookPod.js
import React, { useState } from 'react';

function BookPod() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  const handleBook = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/pods/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ date, time })
    });

    const data = await res.json();
    setMessage(data.message || 'Booking failed');
  };

  return (
    <div>
      <h2>Book a Live Pod</h2>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <input type="time" value={time} onChange={e => setTime(e.target.value)} />
      <button onClick={handleBook}>Book</button>
      <p>{message}</p>
    </div>
  );
}

export default BookPod;
