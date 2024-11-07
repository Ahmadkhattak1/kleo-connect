module.exports = {
  darkMode: ['class'],
  content: ['./dist/**/*.html', './src/**/*.{js,jsx,ts,tsx}', './*.html'],
  plugins: [
    require('@tailwindcss/forms'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#D0D5DD #F9FAFB'
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#D0D5DD',
            marginTop: '5px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#F9FAFB',
            borderRadius: '100vw',
            width: '6px'
          }
        }
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    },
    require('tailwindcss-animate')
  ],
  variants: {
    extend: {
      opacity: ['disabled']
    }
  },
  theme: {
    extend: {
      flexGrow: {
        2: '2',
        3: '3'
      },
      fontFamily: {
        inter: ['inter', 'sans-serif'],
        shoreline: ['shoreline', 'sans-serif']
      },
      dropShadow: {
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
        '4xl': [
          '0 35px 35px rgba(0, 0, 0, 0.25)',
          '0 85px 65px rgba(0, 0, 0, 0.15)'
        ],
        '5xl': '0px 0px 63px 26px rgba(16, 24, 40, 0.24)',
        '6xl': '-8px -8px 20px 0px rgba(0, 0, 0, 0.16);'
      },
      boxShadow: {
        '6xl': '-8px -8px 20px 0px rgba(0, 0, 0, 0.16);',
        '7xl':
          '0px 0px 0px 5.09091px #F4EBFF, 0px 1.27273px 2.54545px 0px rgba(16, 24, 40, 0.05);'
      },
      colors: {
        overlay: 'rgba(52, 64, 84, 0.7)',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        'gray-lightest': '#f9fafb',
        'gray-subheader': '#98A2B3',
        'gray-background': '#F2F4F7',
        'gray-row-dark': '#333F53',
        'yt-card': '#293056',
        grayblue: {
          25: '#FCFCFD', // AA 6.07
          50: '#F8F9FC', // AA 5.91
          100: '#EAECF5', // AA 5.29
          200: '#D5D9EB', // AA 4.43
          300: '#B3B8DB', // AA 1.94
          400: '#717BBC', // AA 4.01
          500: '#4E5BA6', // AA 6.24
          600: '#3E4784', // AA 8.59
          700: '#363F72', // AAA 9.99
          800: '#293056', // AAA 12.72
          900: '#101323' // AAA 18.43
        },
        'purple-card': '#7F56D9',
        'primary-btn': {
          100: '#D8B4FE',
          200: '#C084F5',
          300: '#A855F7',
          400: '#9333EA',
          500: '#7F56D9',
          600: '#6B21A8'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
          scrollbarColor: '#D0D5DD #F9FAFB'
        },
        '.scrollbar-webkit': {
          '&::-webkit-scrollbar': {
            width: '6px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#D0D5DD',
            marginTop: '5px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#F9FAFB',
            borderRadius: '100vw',
            width: '6px'
          }
        }
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ]
}
