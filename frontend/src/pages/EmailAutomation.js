import React, { useState } from 'react';
import { toast } from 'react-toastify';

const EmailAutomation = () => {
  const [email, setEmail] = useState('');

  const sendEmail = async (type) => {
    const subject =
      type === 'onboarding'
        ? 'Welcome to LanguageKonnect'
        : '🎉 You won today’s prize!';

    const html =
      type === 'onboarding'
        ? `<p>Your referral link: <a href="https://languagekonnect.com/r/abc123">Click here</a></p><p>Upload entry: <a href="https://languagekonnect.com/upload">Upload</a></p>`
        : `<p>Please verify payout details.</p>`;

    const response = await fetch('http://localhost:5000/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: email, subject, html }),
    });

    if (response.ok) {
      toast.success('Email sent!');
      setEmail('');
    } else {
      toast.error('Failed to send email.');
    }
  };

  return (
    <div className="container mt-5 p-4 border rounded shadow" style={{ maxWidth: '500px' }}>
      <h3 className="mb-4 text-center">📧 Email Automation</h3>

      <div className="mb-3">
        <label htmlFor="emailInput" className="form-label">User Email</label>
        <input
          id="emailInput"
          type="email"
          className="form-control"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="d-flex gap-2 justify-content-between">
        <button
          className="btn btn-primary w-100"
          onClick={() => sendEmail('onboarding')}
        >
          Send Onboarding Email
        </button>
        <button
          className="btn btn-success w-100"
          onClick={() => sendEmail('winner')}
        >
          Send Winner Email
        </button>
      </div>
    </div>
  );
};

export default EmailAutomation;
