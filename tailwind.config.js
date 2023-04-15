/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class', '[data-theme="dark"]'],
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        'node_modules/daisyui/dist/**/*.js',
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('daisyui'),
        require('tailwindcss-animate'),
    ],
    daisyui: {
        themes: ['light', 'dark'],
    },
};
