# Spentiva Website

Spentiva by Exyconn - Official marketing website built with Astro v5.15.8.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The site will be available at `http://localhost:4321`

## 📁 Project Structure

```
website/
├── src/
│   ├── components/
│   │   ├── Header.astro       # Navigation header
│   │   └── Footer.astro       # Site footer
│   ├── layouts/
│   │   └── BaseLayout.astro   # Base HTML layout
│   ├── pages/
│   │   ├── index.astro        # Home page
│   │   ├── about.astro        # About page
│   │   ├── pricing.astro      # Pricing page
│   │   ├── contact.astro      # Contact page
│   │   ├── upcoming-features.astro # Upcoming features
│   │   ├── use-cases.astro    # Use cases
│   │   ├── privacy-policy.astro
│   │   ├── terms-and-conditions.astro
│   │   ├── data-policy.astro
│   │   ├── cookie-policy.astro
│   │   └── blog/
│   │       ├── index.astro    # Blog listing
│   │       └── [slug].astro   # Blog post template
│   └── styles/
│       └── global.scss        # Global styles
├── astro.config.mjs           # Astro configuration
├── tailwind.config.mjs        # Tailwind CSS configuration
└── package.json
```

## 🎨 Tech Stack

- **Framework:** Astro v5.15.8
- **Styling:** Tailwind CSS + SCSS
- **Icons:** FontAwesome 6.5.1 (CDN)
- **Fonts:** Inter (Google Fonts)

## 📄 Pages

- **Home** (`/`) - Hero, features, testimonials, FAQ
- **About** (`/about`) - Company story, team, values
- **Pricing** (`/pricing`) - Plans, comparison, FAQ
- **Contact** (`/contact`) - Contact form, info
- **Upcoming Features** (`/upcoming-features`) - Roadmap and future plans
- **Use Cases** (`/use-cases`) - Scenarios and applications
- **Blog** (`/blog`) - Article listings and posts
- **Privacy Policy** (`/privacy-policy`)
- **Terms & Conditions** (`/terms-and-conditions`)
- **Data Policy** (`/data-policy`)
- **Cookie Policy** (`/cookie-policy`)

## 🎯 Features

- ✅ Fully responsive design
- ✅ Dynamic content rendering
- ✅ SEO optimized
- ✅ Accessibility compliant
- ✅ FontAwesome icons
- ✅ Smooth animations
- ✅ Mobile-first approach
- ✅ Fast page loads

## 🔧 Configuration

### Update Site URL
Edit `astro.config.mjs`:
```js
export default defineConfig({
  site: 'https://spentiva.com',
  // ...
});
```

### Customize Colors
Edit `tailwind.config.mjs` to modify the color palette.

### Update Content
All page content is in the respective `.astro` files in `src/pages/`.

## 📝 License

Copyright © 2025 Spentiva by Exyconn. All rights reserved.
