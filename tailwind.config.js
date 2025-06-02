/** @type {import('tailwindcss').Config} */
export default {
content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],  theme: {
    extend: {
      	colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#E67E22',
					foreground: '#FFFFFF',
					50: '#FDF2E7',
					100: '#FBEBD6',
					200: '#F7D6AD',
					300: '#F3C084',
					400: '#EFAB5B',
					500: '#E67E22',
					600: '#D35400',
					700: '#A04000',
					800: '#6D2B00',
					900: '#3A1600'
				},
				secondary: {
					DEFAULT: '#F8F9FA',
					foreground: '#2C3E50'
				},
				accent: {
					DEFAULT: '#FFF5F0',
					foreground: '#E67E22'
				},
				destructive: {
					DEFAULT: '#E74C3C',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#F8F9FA',
					foreground: '#7F8C8D'
				},
				wood: {
					100: '#F4E6D3',
					200: '#E9D1B8',
					300: '#D4B896',
					400: '#C19A6B',
					500: '#A67C52',
					600: '#8B5A3C',
					700: '#6D4C41',
					800: '#5D4037',
					900: '#3E2723'
				},
				bookclub: {
					orange: '#E67E22',
					'orange-dark': '#D35400',
					cream: '#FFF5F0',
					navy: '#2C3E50',
					gray: '#7F8C8D',
					'gray-light': '#BDC3C7',
					cream1:"#fffdfc",
					white:"#ffffff"
				}
			},
    },
  },
  plugins: [],
}

