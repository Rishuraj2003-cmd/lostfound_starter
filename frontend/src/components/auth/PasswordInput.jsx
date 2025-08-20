// src/components/auth/PasswordInput.jsx

import React, { useState } from 'react';

// You can place these SVG components inside this file or import them from elsewhere
const EyeOpenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639l4.43-4.43a1.012 1.012 0 011.415 0l3.18 3.18a1.012 1.012 0 010 1.415l-4.43 4.43a1.012 1.012 0 01-1.415 0l-3.18-3.18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243l-4.243-4.243" />
  </svg>
);


export default function PasswordInput({ value, onChange, name, placeholder, required = true }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        // The type changes based on our state
        type={showPassword ? 'text' : 'password'}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      <button
        type="button" // Important: type="button" prevents the form from submitting
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
        aria-label="Toggle password visibility"
      >
        {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
      </button>
    </div>
  );
}