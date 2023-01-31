/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors")

module.exports = {
    content: [
        './index.html', 
        './src/**/*.{vue,js,ts,jsx,tsx}',
        './node_modules/vue-tailwind-datepicker/**/*.js',
        'node_modules/vue-tailwind/dist/*.js'
    ],
    theme: {
        container: {
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '8rem',
            },
            colors: {
                mainColor: '#108a00'
            }
        },
        extend: {
            colors: {
                'main-color': '#108a00',
                "vtd-primary": colors.green,
                "vtd-secondary": colors.gray,
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
