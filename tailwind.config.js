module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      minHeight: {
        'hero-lg': 'calc(100svh - 14rem)',   // large screen
        'hero': 'calc(100svh - 8rem)',      // default
      },
      height: {
        'hero-lg': 'calc(100svh - 14rem)',   // large screen
        'hero': 'calc(100svh - 8rem)',      // default
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
      },
      animation: {
        shake: 'shake 0.3s ease-in-out',
      },
      colors: {
        primary: "#113F67",         // background
        accent_blue: "#91C8E4",     // highlight blue
        accent_purple: "#483AA0",   // highlight purple
        light: "#F9F5EE",           // text beige
        smooth_dark: "#1A1A1A",     // text lighter dark
        error_red: "#cc0000",       // error text red

      },
      boxShadow: {
        'stacked': '5px 5px 0px 0px #91C8E4, 10px 10px 0px 0px #483AA0, 15px 15px 0px 0px #91C8E4, 5px 5px 15px 5px rgba(0,0,0,0)',
      },
      fontFamily: {
        konkhmer: ["Konkhmer Sleokchher", "sans-serif"],
        spartan: ["League Spartan", "sans-serif"],
        montserrat: ["Montserrat"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};


