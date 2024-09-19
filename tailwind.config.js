import { fontFamily } from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export const darkMode = ['class']
export const content = [
  './pages/**/*.{ts,tsx}',
  './components/**/*.{ts,tsx}',
  './src/**/*.{ts,tsx}',
]

export const theme = {
  fontFamily: {
    sans: [...fontFamily.sans],
  },
}
