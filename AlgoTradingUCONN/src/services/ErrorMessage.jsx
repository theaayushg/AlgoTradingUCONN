import React from 'react'

function ErrorMessage({ message, onClose }) {
  return (
    <div>
      <span>{message}</span>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default ErrorMessage;