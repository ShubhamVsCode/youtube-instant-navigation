# Chrome Web Store Listing Guide

This guide will help you prepare and submit your YouTube Instant Navigation extension to the Chrome Web Store.

## Prerequisites

1. **Chrome Web Store Developer Account**
   - Go to https://chrome.google.com/webstore/devconsole
   - Pay the one-time $5 registration fee
   - Complete your developer account setup

2. **Prepare Your Extension**
   - Build the extension: `pnpm build`
   - Create a ZIP file: `pnpm zip`
   - The ZIP will be in `dist-zip/` folder

## Required Assets

### 1. Extension Icons

✅ **Already created**: `icon.svg` in `chrome-extension/public/`

**Generate PNG icons:**
```bash
# Install sharp if not already installed
pnpm add -D sharp

# Generate icons
node scripts/generate-icons.mjs
```

**Or manually:**
- Open `chrome-extension/public/icon.svg` in a design tool
- Export as PNG at these sizes:
  - 16x16 → `icon-16.png`
  - 48x48 → `icon-48.png`
  - 128x128 → `icon-128.png`
- Save in `chrome-extension/public/`

### 2. Store Listing Images

Create these images (use the provided templates or design your own):

#### Small Promotional Tile (440x280)
- **Purpose**: Featured in Chrome Web Store
- **Format**: PNG or JPG
- **Content**: Extension icon + "YouTube Instant Navigation" text
- **Save as**: `store-assets/small-promo-tile.png`

#### Large Promotional Tile (920x680)
- **Purpose**: Featured promotions
- **Format**: PNG or JPG
- **Content**: Extension icon + tagline + key features
- **Save as**: `store-assets/large-promo-tile.png`

#### Screenshots (1280x800 or 640x400)
Create 1-5 screenshots showing:
1. Extension popup with settings
2. Video selection with highlight (on YouTube)
3. Keyboard shortcuts in action
4. Settings panel

**Save as**: `store-assets/screenshot-1.png`, `screenshot-2.png`, etc.

### 3. Store Listing Details

#### Short Description (132 characters max)
```
Navigate YouTube faster with keyboard shortcuts: double-ESC for home, number keys to select videos, J/K to scroll.
```

#### Detailed Description (16,000 characters max)
```
YouTube Instant Navigation

Transform your YouTube browsing experience with powerful keyboard shortcuts designed for speed and efficiency.

🎯 KEY FEATURES

• Double ESC → Home
  Press ESC twice quickly to instantly navigate to YouTube homepage

• Number Keys (1-9) → Select Videos
  First press highlights the video, second press opens it
  Automatically detects videos in your viewport

• J/K → Scroll
  J scrolls down, K scrolls up - just like Reddit!

• Customizable Highlights
  Choose from 4 highlight styles (Gradient, Solid, Glow)
  Pick your favorite color from presets or use custom colors

• Smart Settings
  Toggle features on/off
  All settings sync across your browser
  Disabled automatically when typing in search/input fields

⚡ HOW IT WORKS

The extension intelligently detects videos currently visible in your viewport and maps number keys (1-9) to them, sorted top-to-bottom and left-to-right. No more clicking - just press a number twice to open any video!

🎨 CUSTOMIZATION

Click the extension icon to open the settings panel where you can:
- Enable/disable individual features
- Choose highlight color (6 presets + custom)
- Select highlight style (Gradient ↓, Gradient ↑, Solid, Glow)

🔒 PRIVACY

This extension only runs on YouTube pages and doesn't collect any personal data. All settings are stored locally in your browser.

📱 COMPATIBILITY

Works on all YouTube pages:
- Homepage
- Search results
- Channel pages
- Video recommendations
- Sidebar suggestions

🚀 GET STARTED

1. Install the extension
2. Visit any YouTube page
3. Press ESC twice to go home
4. Press 1-9 to select videos
5. Press J/K to scroll
6. Customize in the extension popup!

Built with React, TypeScript, and Chrome Extension Manifest V3 for modern, secure browsing.

Open source: https://github.com/ShubhamVsCode/youtube-instant-navigation
```

#### Category
- **Primary**: Productivity
- **Secondary**: Utilities

#### Language
- English (United States)

## Submission Steps

1. **Prepare ZIP File**
   ```bash
   pnpm build
   pnpm zip
   ```
   The ZIP file will be in `dist-zip/` folder

2. **Go to Chrome Web Store Developer Dashboard**
   - Visit: https://chrome.google.com/webstore/devconsole
   - Click "New Item"

3. **Upload Your Extension**
   - Upload the ZIP file from `dist-zip/`
   - Fill in all required fields

4. **Complete Store Listing**
   - Upload promotional images
   - Add screenshots
   - Fill in description
   - Set category and language

5. **Privacy & Permissions**
   - Explain why you need each permission
   - Add privacy policy URL (if collecting data)

6. **Submit for Review**
   - Review can take 1-7 days
   - You'll receive email notifications

## Privacy Policy

If your extension collects any data, create a privacy policy. For this extension, you can use:

```
Privacy Policy for YouTube Instant Navigation

Last updated: [Date]

YouTube Instant Navigation ("we", "our", or "us") respects your privacy.

DATA COLLECTION
We do not collect, store, or transmit any personal information or browsing data. All extension settings are stored locally in your browser using Chrome's local storage API.

PERMISSIONS
- storage: Used to save your extension settings locally
- scripting: Required to inject content scripts on YouTube pages
- tabs: Used to detect when you're on YouTube pages

CONTACT
For questions about this privacy policy, please open an issue on GitHub:
https://github.com/ShubhamVsCode/youtube-instant-navigation/issues
```

Host this on GitHub Pages or your website and add the URL in the store listing.

## Tips for Approval

1. **Clear Permissions Explanation**: Explain why each permission is needed
2. **Good Screenshots**: Show the extension in action
3. **Accurate Description**: Match what the extension actually does
4. **No Copyright Issues**: Use original icons/images
5. **Test Thoroughly**: Make sure everything works before submitting

## After Approval

1. **Monitor Reviews**: Respond to user feedback
2. **Update Regularly**: Fix bugs and add features
3. **Version Updates**: Use semantic versioning (1.0.0, 1.0.1, etc.)
4. **Promote**: Share on social media, Reddit, etc.

Good luck with your submission! 🚀

