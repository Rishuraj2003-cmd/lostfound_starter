// src/components/auth/GoogleLogin.jsx

import React from 'react';

export default function GoogleLogin() {
    const handleGoogleLogin = () => {
        // This creates the full, correct URL to your backend's Google auth route.
        // It should not have 'undefined' in it.
        const googleAuthUrl = 'http://localhost:5001/api/auth/google';
        
        // This command tells the browser to go to that URL.
        window.location.href = googleAuthUrl;
    };

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex justify-center items-center gap-2 border p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google icon" className="w-6 h-6" />
            <span className="text-gray-700 font-medium">Continue with Google</span>
        </button>
    );
}