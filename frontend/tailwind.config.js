/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Nunito", "Inter", "sans-serif"],
            },
            colors: {
                peach: {
                    50: "#fff8f5",
                    100: "#ffe8da",
                    200: "#ffd4bc",
                    300: "#ffb899",
                    400: "#ff9671",
                    500: "#f97048",
                    600: "#e05233",
                    700: "#bf3a20",
                    800: "#8f2510",
                    900: "#5e1608",
                },
            },
            backgroundImage: {
                "peach-gradient": "linear-gradient(135deg, #fff8f5 0%, #ffe8da 50%, #ffd4bc 100%)",
                "peach-hero": "linear-gradient(135deg, #fff3ee 0%, #ffe8da 40%, #ffd4bc 100%)",
                "peach-dark": "linear-gradient(135deg, #8f2510 0%, #bf3a20 50%, #e05233 100%)",
            },
            boxShadow: {
                "peach": "0 4px 24px 0 rgba(249,112,72,0.15)",
                "peach-lg": "0 8px 40px 0 rgba(249,112,72,0.22)",
            },
            animation: {
                "float": "float 3s ease-in-out infinite",
                "fade-in": "fadeIn 0.4s ease-out",
                "slide-up": "slideUp 0.3s ease-out",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-8px)" },
                },
                fadeIn: {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                slideUp: {
                    from: { opacity: "0", transform: "translateY(16px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
            },
        },
    },
    plugins: [],
};
