import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        swiss: '#DA291C',
        saffron: '#FF9933',
        india: '#138808',
        navy: '#000080',
        ink: '#1a1a1a',
        mist: '#f6f6f4',
      },
      fontFamily: { sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'] },
    },
  },
  plugins: [],
} satisfies Config;
