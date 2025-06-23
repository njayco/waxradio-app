# Public Directory

This directory contains static assets that are served directly by the web server without processing.

## 📁 Structure

```
public/
├── favicon.ico          # Website favicon
├── images/              # Static images
├── audio/               # Sample audio files (if any)
└── icons/               # App icons and logos
```

## 🎯 Usage

### Static Assets
- **Images**: Place images here that don't need optimization
- **Icons**: App icons, logos, and favicons
- **Audio**: Sample audio files for testing
- **Documents**: Static PDFs or other documents

### Accessing Files
Files in this directory are accessible at the root URL:
- `public/favicon.ico` → `https://yoursite.com/favicon.ico`
- `public/images/logo.png` → `https://yoursite.com/images/logo.png`

### Next.js Optimization
- Images in this directory are **not** optimized by Next.js
- Use `next/image` for optimized images in components
- This directory is best for favicons, robots.txt, and other static files

## 📝 Guidelines

### File Organization
- Keep files organized in subdirectories
- Use descriptive file names
- Avoid deep nesting

### File Types
- **Images**: PNG, JPG, SVG, WebP
- **Audio**: MP3, WAV, OGG
- **Documents**: PDF, TXT
- **Icons**: ICO, SVG, PNG

### Performance
- Optimize images before adding to public
- Use appropriate file formats
- Consider file sizes for mobile users

## 🔧 Development

### Adding New Assets
1. Place files in appropriate subdirectory
2. Use descriptive naming convention
3. Optimize files for web use
4. Update this README if needed

### Best Practices
- Don't put large files here
- Use CDN for production assets
- Keep favicon and essential icons here
- Use relative paths in code 