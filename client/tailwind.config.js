module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
   darkMode: false, // or 'media' or 'class'
   theme: {
     fontfamily: {
      body: ['Nunito', 'sans-serif']
     },
     extend: {
      colors: {
      "green-custom": "#00cd0d",
      "green-custom-darker": "#00b40b"
      },
      inset: {
      'menu-item': 'calc(50% - 0.6rem)',
      '1': '1.6rem'
      },
      maxWidth: {
      'card-full': '38rem'
      },
      spacing: {
      'mini-dash': 'calc(100vw - 4rem)',
      'max-dash': 'calc(100vw - 15rem)',
      'card-full': '38rem',
      'card-medium': '22rem'
      }
     },
   },
   variants: {
     extend: {
      transform: ['hover'],
      scale: ['hover'],
      backgroundColor: ['active', 'checked', 'disabled'],
      borderColor: ['active', 'checked'],
      filter: ['active', 'checked'],
      opacity: ['disabled']
     },
   },
   plugins: [],
 }