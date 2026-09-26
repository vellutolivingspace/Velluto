# Velluto Living Space

> Precision Modular Furniture. Made in India. Engineered to Perfection.

Velluto Living Space is a luxury modular architectural living brand manufactured in Gandhinagar, Gujarat. We build high-precision modular kitchens, wardrobes, and living room units using automated computerized beam saws, CNC machining centers, and PUR edge-banding technology.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Luxury CSS Architecture
- **Interactive Experience**: HTML5 Canvas frame scrubbing engine for 3D walkthroughs
- **Icons**: [Lucide React](https://lucide.dev/)
- **Inquiry Backend**: Google Apps Script & Google Sheets webhook integration with instant email notifications

---

## 📁 Repository Structure

```
├── google-apps-script/
│   └── Code.gs               # Backend webhook script for Google Sheets & email alerts
├── public/
│   ├── Frames/               # High-resolution sequential 3D walkthrough frames
│   └── brand/                # Brand emblems, logos, and vector assets
├── src/
│   ├── components/
│   │   ├── FeaturesSection.tsx       # Factory machinery, materials, and inquiry form
│   │   ├── Footer.tsx                # Branded footer and contact info
│   │   ├── HeroScrollNarrative.tsx   # Hero typography & scroll indicators
│   │   ├── Navbar.tsx                # Floating glassmorphic navigation
│   │   ├── ScrollCanvasSequence.tsx  # 3D frame scrubbing canvas engine
│   │   └── VellutoLogo.tsx           # Scalable brand logo component
│   ├── config/
│   │   └── inquiry.ts                # Inquiry service & endpoint configuration
│   ├── hooks/
│   │   └── useScrollReveal.ts        # IntersectionObserver scroll animations
│   ├── App.tsx                       # Main layout and stationery background canvas
│   ├── index.css                     # Design system, rich brown gradients & tokens
│   └── main.tsx                      # Application root entry point
├── GOOGLE_SHEET_SETUP.md     # 4-step setup guide for Google Sheets inquiry system
└── package.json
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/vellutolivingspace/Velluto.git
cd Velluto
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your deployed Google Apps Script URL for inquiry logging:
```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 4. Run the development server
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 📄 License

&copy; 2026 Velluto Living Space. All Rights Reserved.
