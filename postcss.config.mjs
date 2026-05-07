const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
  theme: {
    extend: {
      width: {
        '1/5': '20%',
        '4/5': '80%',
      },
      margin: {
        '1/5': '20%',
      }
    }
  }
};

export default config;
