# Quick Glow Grocer - Figma Design Specification

This document provides the exact parameters and layout details to build the **Quick Glow Grocer** UI in Figma.

## 🎨 Color Palette (Tokens)

| Token | HSL | HEX (Use in Figma) | Usage |
| :--- | :--- | :--- | :--- |
| **Primary (Emerald)** | `155 60% 40%` | `#29A36B` | Main branding, primary buttons, active icons. |
| **Primary Glow** | `155 60% 45%` | `#2EB476` | Hover states, glowing effects. |
| **Accent (Amber)** | `35 95% 55%` | `#FF9D1C` | Flash deals, badges, secondary call-to-action. |
| **Secondary (Mint)** | `156 30% 94%` | `#E8F5EE` | Card backgrounds, subtle highlights. |
| **Background** | `156 33% 97%` | `#F4FAF7` | Page background (Light mode). |
| **Text (Midnight)** | `220 25% 12%` | `#171C26` | Headings, primary body text. |
| **Muted Text** | `220 10% 50%` | `#737B8C` | Descriptions, meta-info. |
| **Glass Border** | `0 0% 100% / 0.3` | `#FFFFFF4D` | Borders on glass cards. |

---

## 🖋️ Typography (Plus Jakarta Sans)

| Level | Size | Weight | Line Height | Case |
| :--- | :--- | :--- | :--- | :--- |
| **Display (Hero)** | 64px | 800 (ExtraBold) | 120% | Default |
| **Heading 1** | 32px | 700 (Bold) | 130% | Default |
| **Heading 2** | 24px | 700 (Bold) | 130% | Default |
| **Body Large** | 18px | 500 (Medium) | 150% | Default |
| **Body Regular** | 14px | 400 (Regular) | 150% | Default |
| **Label/Meta** | 12px | 600 (SemiBold) | 120% | Uppercase (optional) |

---

## 🧱 Component Library

### 1. Primary Button
- **Background:** Linear Gradient (#29A36B → #36D399)
- **Border Radius:** 16px
- **Padding:** 14px (Vertical) / 32px (Horizontal)
- **Shadow:** `0px 4px 12px rgba(41, 163, 107, 0.2)`
- **Text:** White, 14px, SemiBold

### 2. Product Card
- **Background:** White (#FFFFFF)
- **Border Radius:** 24px
- **Border:** 1px solid #E8F5EE
- **Padding:** 16px
- **Image Container:** 120px x 120px, #F4FAF7 background, 20px radius.
- **Shadow:** `0px 8px 24px rgba(41, 163, 107, 0.06)`

### 3. Glass Navbar (Floating)
- **Background:** White at 70% opacity (#FFFFFFB3)
- **Background Blur:** 20px
- **Border:** 1px solid #FFFFFF4D (Top)
- **Shadow:** `0px 1px 20px rgba(41, 163, 107, 0.05)`

---

## 📱 Mobile Screen Mockups (Specs)

### **Home Screen**
1. **Luxury Top Bar (80px height):**
   - Left: Profile Avatar (40x40, 12px radius).
   - Center: Delivery Location (Icon + "Set Address").
   - Right: Notification Bell.
2. **Hero Carousel (200px height):**
   - 28px Corner Radius.
   - Background: #F5F9FF.
   - Content: "Flash Offer" badge + Product Image + Discount Text.
3. **Category Grid:**
   - 2-column grid.
   - Cards with 20px radius.

### **Product Detail**
1. **Header Image (300px height):**
   - Full width, subtle shadow at the bottom.
2. **Bottom Action Bar:**
   - Price on left.
   - "Add to Cart" button (Primary) on right.

---

## 🖼️ SVG Branding Assets

### Logo (Quick Glow Grocer)
```xml
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="120" rx="32" fill="url(#paint0_linear)"/>
  <path d="M40 60L55 75L85 45" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <defs>
    <linearGradient id="paint0_linear" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
      <stop stop-color="#29A36B"/>
      <stop offset="1" stop-color="#36D399"/>
    </linearGradient>
  </defs>
</svg>
```

---

## 🛠️ How to Import into Figma
1. **Colors:** Copy the HEX codes into Figma's "Color Styles".
2. **Icons:** Use the **Lucide Icons** plugin (already used in React).
3. **Layout:** Use **Auto Layout (Shift+A)** for buttons and cards to match the padding specs above.
4. **HTML to Figma:** If you have the app running, use the **"html.to.design"** plugin to import the live frontend directly into Figma for an instant design file.
