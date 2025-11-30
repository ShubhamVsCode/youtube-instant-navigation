# YouTube Instant Navigation

A Chrome extension that adds powerful keyboard shortcuts to YouTube for faster navigation and video selection.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=flat-square&logo=google-chrome&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)

## Features

### 🎯 Keyboard Shortcuts

- **Double ESC** → Navigate to YouTube homepage
- **Number keys (1-9)** → Select and open videos in viewport
  - First press: Highlights the video
  - Second press: Opens the video
- **J/K** → Scroll page down/up

### 🎨 Customizable Highlight

- **4 Highlight Styles**: Gradient (top/bottom), Solid, Glow
- **Custom Colors**: Choose from presets or pick your own color
- **Real-time Updates**: Changes apply instantly

### ⚙️ Settings Panel

- Toggle features on/off
- Customize highlight color and style
- All settings persist across sessions

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/youtube-instant-navigation.git
   cd youtube-instant-navigation
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the extension:
   ```bash
   pnpm build
   ```

4. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Development

Run the dev server with hot reload:

```bash
pnpm dev
```

The extension will automatically rebuild on file changes. Just reload the extension in Chrome to see updates.

## Usage

1. Navigate to any YouTube page
2. Use keyboard shortcuts:
   - Press **ESC** twice quickly to go home
   - Press **1-9** to select visible videos (press again to open)
   - Press **J** to scroll down, **K** to scroll up
3. Open the extension popup to customize settings

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `ESC` `ESC` | Go to YouTube homepage |
| `1-9` | Select video (first press highlights, second press opens) |
| `J` | Scroll down |
| `K` | Scroll up |

**Note**: Shortcuts are disabled when typing in search/input fields.

## Configuration

Click the extension icon to open the settings panel where you can:

- ✅ Enable/disable individual features
- 🎨 Choose highlight color (6 presets + custom)
- ✨ Select highlight style (Gradient ↓, Gradient ↑, Solid, Glow)

## How It Works

The extension uses a content script that:

1. Detects videos currently visible in the viewport
2. Maps number keys (1-9) to videos sorted top-to-bottom, left-to-right
3. Provides visual feedback with customizable highlights
4. Respects user settings for enabled/disabled features

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Chrome Extension Manifest V3** - Modern extension API

## Development

This project is built on top of the excellent [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite) by [Jonghakseo](https://github.com/Jonghakseo).

### Project Structure

```
├── pages/
│   ├── content/          # Content scripts
│   │   └── src/matches/youtube/  # YouTube-specific logic
│   └── popup/            # Extension popup UI
├── packages/
│   └── storage/          # Settings storage
└── chrome-extension/     # Manifest and config
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Built with [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)
