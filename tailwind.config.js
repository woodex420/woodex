/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// Workspace.AE Design System Colors
				'text-primary': '#333333',
				'text-primary-alt': '#232323',
				'text-secondary': '#484848',
				'surface-base': '#FFFFFF',
				'surface-ink': '#000000',
				'separator': 'rgba(183, 183, 183, 0.11)',
				
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: '#FFFFFF',
				foreground: '#333333',
				primary: {
					DEFAULT: '#333333',
					foreground: '#FFFFFF',
				},
				secondary: {
					DEFAULT: '#484848',
					foreground: '#FFFFFF',
				},
				accent: {
					DEFAULT: '#000000',
					foreground: '#FFFFFF',
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#FFFFFF',
				},
				muted: {
					DEFAULT: '#F5F5F5',
					foreground: '#484848',
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#333333',
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#333333',
				},
			},
			fontFamily: {
				sans: ['Raleway', 'sans-serif'],
			},
			fontSize: {
				'xs': '11px',
				'sm': '12px',
				'base': '14px',
				'lg': '16px',
				'xl': '18px',
				'2xl': '22px',
				'3xl': '26px',
				'4xl': '32px',
				'5xl': '40px',
				'6xl': '51px',
			},
			spacing: {
				'section': '100px',
				'component': '30px',
			},
			screens: {
				'xs': '480px',
				'sm': '640px',
				'md': '768px',
				'lg': '992px',
				'xl': '1280px',
				'2xl': '1400px',
			},
			borderRadius: {
				lg: '8px',
				md: '6px',
				sm: '4px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'fade-in': {
					from: { opacity: 0 },
					to: { opacity: 1 },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
}