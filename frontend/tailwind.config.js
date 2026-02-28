module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Example: Blue-500
        secondary: '#10B981', // Example: Green-500
        pending: '#F59E0B', // Example: Amber-500
        approved: '#10B981', // Example: Green-500
        rejected: '#EF4444', // Example: Red-500
      },
    },
  },
  plugins: [],
}
