import React from 'react';

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3 py-2 border rounded ${className}`}
    {...props}
  />
);

export default Input; 