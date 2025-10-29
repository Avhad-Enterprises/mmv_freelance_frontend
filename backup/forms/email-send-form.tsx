// components/forms/email-send-form.tsx
"use client";
import React from 'react';

const EmailSendForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Email send functionality not implemented yet.');
    // Implement your email sending logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="emailSenderName" className="form-label">Your Name</label>
        <input type="text" className="form-control" id="emailSenderName" placeholder="John Doe" required />
      </div>
      <div className="mb-3">
        <label htmlFor="emailSenderSubject" className="form-label">Subject</label>
        <input type="text" className="form-control" id="emailSenderSubject" placeholder="Regarding your profile" required />
      </div>
      <div className="mb-3">
        <label htmlFor="emailSenderMessage" className="form-label">Message</label>
        <textarea className="form-control" id="emailSenderMessage" rows={5} placeholder="Your message..." required></textarea>
      </div>
      <button type="submit" className="btn btn-primary w-100">Send Email</button>
    </form>
  );
};

export default EmailSendForm;