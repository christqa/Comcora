import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "4rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        suisse: ["var(--font-suisse)", "sans-serif"],
      },
      fontSize: {
        "10-medium": [
          "0.625rem",
          {
            lineHeight: "0.75rem",
            fontWeight: 500,
          },
        ],
        "12-regular": [
          "0.75rem",
          {
            lineHeight: "1rem",
            fontWeight: 400,
          },
        ],
        "12-medium": [
          "0.75rem",
          {
            lineHeight: "1rem",
            fontWeight: 500,
          },
        ],
        "14-medium": [
          "0.875rem",
          {
            lineHeight: "1rem",
            fontWeight: 500,
          },
        ],
        "16-medium": [
          "1rem",
          {
            lineHeight: "1.5rem",
            fontWeight: 500,
          },
        ],
        "16-semibold": [
          "1rem",
          {
            lineHeight: "1.5rem",
            fontWeight: 600,
          },
        ],
        "24-semibold": [
          "1.5rem",
          {
            lineHeight: "2rem",
            fontWeight: 600,
          },
        ],
        "20-medium": [
          "1.25rem",
          {
            lineHeight: "2rem",
            fontWeight: 500,
            letterSpacing: "-0.03rem",
          },
        ],
        "24-medium": [
          "1.5rem",
          {
            lineHeight: "2rem",
            fontWeight: 500,
            letterSpacing: "-0.03rem",
          },
        ],
        "32-medium": [
          "2rem",
          {
            lineHeight: "2.5rem",
            fontWeight: 500,
            letterSpacing: "-0.04rem",
          },
        ],
        "40-medium": [
          "2.5rem",
          {
            lineHeight: "3rem",
            fontWeight: 500,
          },
        ],
        "48-medium": [
          "2.5rem",
          {
            lineHeight: "3rem",
            fontWeight: 500,
          },
        ],
      },
      scale: {
        "200": "2",
        "250": "2.5",
        "300": "3",
      },
      spacing: {
        "18": "4.5rem",
      },
      gridTemplateColumns: {
        "2": "repeat(2, minmax(0, 1fr))",
        "4": "repeat(4, 4.5rem)",
        "12": "repeat(12, 4.5rem)",
        "12-sub": "repeat(12, 2.5rem)",
      },
      colors: {
        "typography-primary": "hsl(var(--color-typography-primary))",
        "typography-primary-inverse":
          "hsl(var(--color-typography-primary-inverse))",
        "typography-secondary": "hsl(var(--color-typography-secondary))",
        "typography-disabled": "hsl(var(--color-typography-disabled))",
        "typography-surface": "hsl(var(--color-typography-surface))",
        "typography-surface-inverse":
          "hsl(var(--color-typography-surface-inverse))",
        "typography-success": "hsl(var(--color-typography-success))",
        "typography-caution": "hsl(var(--color-typography-caution))",
        "typography-critical": "hsl(var(--color-typography-critical))",
        "fill-background-main": "hsl(var(--color-fill-background-main))",
        "fill-primary": "hsl(var(--color-fill-primary))",
        "fill-primary-light": "hsl(var(--color-fill-primary-light))",
        "fill-primary-active": "hsl(var(--color-fill-primary-active))",
        "fill-primary-inverse": "hsl(var(--color-fill-primary-inverse))",
        "fill-primary-inverse_active":
          "hsl(var(--color-fill-primary-inverse_active))",
        "fill-secondary": "hsl(var(--color-fill-secondary))",
        "fill-secondary-active": "hsl(var(--color-fill-secondary-active))",
        "fill-disabled": "hsl(var(--color-fill-disabled))",
        "fill-surface": "hsl(var(--color-fill-surface))",
        "fill-surface-inverse": "hsl(var(--color-fill-surface-inverse))",
        "fill-accent": "hsl(var(--color-fill-accent))",
        "fill-accent-active": "hsl(var(--color-fill-accent-active))",
        "fill-primary-success": "hsl(var(--color-fill-primary-success))",
        "fill-secondary-success": "hsl(var(--color-fill-secondary-success))",
        "fill-primary-caution": "hsl(var(--color-fill-primary-caution))",
        "fill-secondary-caution": "hsl(var(--color-fill-secondary-caution))",
        "fill-primary-critical": "hsl(var(--color-fill-primary-critical))",
        "fill-secondary-critical": "hsl(var(--color-fill-secondary-critical))",
        "fill-black-a02": "rgba(0, 0, 0, 0.02)",
        "fill-black-a3": "rgba(0, 0, 0, 0.3)",
        "stroke-primary": "hsl(var(--color-stroke-primary))",
        "stroke-primary-light": "hsl(var(--color-stroke-primary-light))",
        "stroke-secondary": "hsl(var(--color-stroke-secondary))",
        "stroke-secondary-active": "hsl(var(--color-stroke-secondary-active))",
        "stroke-accent": "hsl(var(--color-stroke-accent))",
        "stroke-primary-success": "hsl(var(--color-stroke-primary-success))",
        "icon-primary": "hsl(var(--color-icon-primary))",
        "icon-primary-inverse": "hsl(var(--color-icon-primary-inverse))",
        "icon-primary-light": "hsl(var(--color-icon-primary-light))",
        "icon-secondary": "hsl(var(--color-icon-secondary))",
        "icon-disabled": "hsl(var(--color-icon-disabled))",
        "icon-surface": "hsl(var(--color-icon-surface))",
        "icon-surface-inverse": "hsl(var(--color-icon-surface-inverse))",
        "icon-accent": "hsl(var(--color-icon-accent))",
        "icon-success": "hsl(var(--color-icon-success))",
        "icon-caution": "hsl(var(--color-icon-caution))",
        "icon-critical": "hsl(var(--color-icon-critical))",
        "color-dark": "hsl(var(--color-dark))",

        //extras
        "black-t-2": "rgba(0, 0, 0, 0.02)",
        "brand-master-card":
          "linear-gradient(110deg, #424242 0%, #141413 100%)",

        // SHADCN
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },

      backgroundImage: {
        "brand-mastercard": "linear-gradient(110deg, #424242 0%, #141413 100%)",
        "gradient-opacity":
          "linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%)",
        "gradient-fade":
          "linear-gradient(to top, hsl(var(--color-fill-background-main)), transparent)",
        "banner-gradient":
          "linear-gradient(220.83deg, #BCF222 -9.88%, #88FFD4 87.66%)",
      },

      borderRadius: {
        // Default tailwind
        sm: "0.125rem" /* 2px */,
        md: "0.375rem" /* 6px */,
        lg: "0.5rem" /* 8px */,
        xl: "0.75rem" /* 12px */,
        "2xl": "1rem" /* 16px */,
        "3xl": "1.5rem" /* 24px */,
        // Project specific
        "4xl": "2rem" /* 32px */,
        "5xl": "3rem" /* 48px */,
      },
      backdropFilter: {
        none: "none",
        blur: "blur(30px)",
      },
      boxShadow: {
        mHover: "0px 12px 32px 24px rgba(0, 0, 0, 0.1)",
        l: "0px 48px 74px -64px rgba(0, 0, 0, 0.2), 0px 16px 56px 2px rgba(0, 0, 0, 0.1)",
        m: "0px 12px 32px -14px rgba(0, 0, 0, 0.08)",
        s: "0px 4px 12px 0px rgba(0, 0, 0, 0.04), 0px 2px 2px 0px rgba(0, 0, 0, 0.03);",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        spin: {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        spin: "spin 2s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
