# PWA Icon Placeholder Instructions

Since the image generation service is currently unavailable, you'll need to create the PWA icons manually.

## Required Icons

Create the following icon files in the `public/` directory:

### 1. icon-192x192.png (192x192px)
- Modern, professional design
- Graduation cap or education symbol
- Blue theme (#1e40af)
- Used for Android home screen

### 2. icon-512x512.png (512x512px)  
- Same design as 192x192
- Higher resolution for splash screens
- Used for Android app list and splash

### 3. apple-touch-icon.png (180x180px)
- Same design optimized for iOS
- No rounded corners (iOS adds them)
- Used for iOS home screen

## Quick Creation Options

### Option 1: Use Online Tool
Visit websites like:
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/
- Upload a logo or design, generate all sizes

### Option 2: Use Design Software
- Figma, Photoshop, or GIMP
- Create a 512x512 base design
- Resize to other required dimensions

### Option 3: Temporary Placeholder
For testing purposes, you can use the vite.svg file:
```bash
cd public
copy vite.svg icon-192x192.png
copy vite.svg icon-512x512.png
copy vite.svg apple-touch-icon.png
```

## Icon Design Tips

**Theme**: Education/Scholarship
**Colors**: Blue (#1e40af), White accents
**Symbols**: Graduation cap, book, diploma
**Style**: Modern, minimalist, professional
**Format**: PNG with transparency

Once created, place all icon files in:
`frontend/public/`

The PWA will automatically use these icons for installation and app display.
