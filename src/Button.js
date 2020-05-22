import React from 'react';

const Button = ({ onClick, title, children }) => (
  <button title={title} onClick={onClick}>
    {children}
  </button>
);

export default Button;
