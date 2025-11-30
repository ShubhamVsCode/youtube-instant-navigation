/**
 * YouTube Instant Navigation Content Script
 *
 * Features:
 * 1. Double-ESC to go to YouTube homepage
 * 2. Number keys (1-9) to select/open videos in viewport (two-press pattern)
 * 3. J/K for scrolling
 */

// Settings interface
type HighlightStyle = 'gradient-bottom' | 'gradient-top' | 'solid' | 'glow';

interface YtNavSettings {
  enableDoubleEsc: boolean;
  enableNumberKeys: boolean;
  enableScrollKeys: boolean;
  highlightColor: string;
  highlightStyle: HighlightStyle;
}

// Default settings
const DEFAULT_SETTINGS: YtNavSettings = {
  enableDoubleEsc: true,
  enableNumberKeys: true,
  enableScrollKeys: true,
  highlightColor: '#FF0000',
  highlightStyle: 'gradient-bottom',
};

// Current settings (loaded from storage)
let settings: YtNavSettings = { ...DEFAULT_SETTINGS };

// State management
let lastEscTime = 0;
let selectedVideoIndex: number | null = null;
let lastKeyPressed: string | null = null;
let highlightedElement: HTMLElement | null = null;

const ESC_DOUBLE_PRESS_DELAY = 400; // ms
const HIGHLIGHT_CLASS = 'yt-nav-highlight';
const STYLE_ID = 'yt-instant-nav-styles';

// Convert hex to rgba
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Generate highlight styles based on style type
const getHighlightStyles = (color: string, styleType: HighlightStyle): string => {
  const baseStyles = `
    .${HIGHLIGHT_CLASS} {
      position: relative !important;
      border-radius: 12px !important;
    }`;

  const badgeStyles = `
    .yt-nav-number-badge {
      position: absolute;
      top: 8px;
      left: 8px;
      background: ${hexToRgba(color, 0.95)};
      color: #1a1a1a;
      font-size: 14px;
      font-weight: bold;
      padding: 4px 8px;
      border-radius: 4px;
      z-index: 9999;
      pointer-events: none;
      font-family: 'YouTube Sans', 'Roboto', sans-serif;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }`;

  let highlightEffect = '';

  switch (styleType) {
    case 'gradient-bottom':
      highlightEffect = `
    .${HIGHLIGHT_CLASS}::before {
      content: '' !important;
      position: absolute !important;
      inset: -6px !important;
      border-radius: 14px !important;
      padding: 2px !important;
      background: linear-gradient(to bottom, transparent 0%, ${color} 100%) !important;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) !important;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) !important;
      -webkit-mask-composite: xor !important;
      mask-composite: exclude !important;
      pointer-events: none !important;
      box-shadow: 0 8px 20px ${hexToRgba(color, 0.4)}, 0 12px 32px ${hexToRgba(color, 0.2)} !important;
      opacity: var(--highlight-opacity, 1) !important;
      transition: opacity 0.1s ease-out, box-shadow 0.1s ease-out !important;
      animation: yt-nav-border-fade-in 0.1s ease-out !important;
    }
    @keyframes yt-nav-border-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: var(--highlight-opacity, 1);
      }
    }`;
      break;

    case 'gradient-top':
      highlightEffect = `
    .${HIGHLIGHT_CLASS}::before {
      content: '' !important;
      position: absolute !important;
      inset: -6px !important;
      border-radius: 14px !important;
      padding: 2px !important;
      background: linear-gradient(to top, transparent 0%, ${color} 100%) !important;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) !important;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) !important;
      -webkit-mask-composite: xor !important;
      mask-composite: exclude !important;
      pointer-events: none !important;
      box-shadow: 0 -8px 20px ${hexToRgba(color, 0.4)}, 0 -12px 32px ${hexToRgba(color, 0.2)} !important;
      opacity: var(--highlight-opacity, 1) !important;
      transition: opacity 0.1s ease-out, box-shadow 0.1s ease-out !important;
      animation: yt-nav-border-fade-in 0.1s ease-out !important;
    }
    @keyframes yt-nav-border-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: var(--highlight-opacity, 1);
      }
    }`;
      break;

    case 'solid':
      highlightEffect = `
    .${HIGHLIGHT_CLASS}::before {
      content: '' !important;
      position: absolute !important;
      inset: -6px !important;
      border-radius: 14px !important;
      padding: 2px !important;
      background: ${color} !important;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) !important;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0) !important;
      -webkit-mask-composite: xor !important;
      mask-composite: exclude !important;
      pointer-events: none !important;
      opacity: var(--highlight-opacity, 1) !important;
      transition: opacity 0.1s ease-out !important;
      animation: yt-nav-border-fade-in 0.1s ease-out !important;
    }
    @keyframes yt-nav-border-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: var(--highlight-opacity, 1);
      }
    }`;
      break;

    case 'glow':
      highlightEffect = `
    .${HIGHLIGHT_CLASS}::before {
      content: '' !important;
      position: absolute !important;
      inset: -8px !important;
      border-radius: 16px !important;
      background: ${hexToRgba(color, 0.15)} !important;
      box-shadow: 0 0 20px ${hexToRgba(color, 0.6)}, 0 0 40px ${hexToRgba(color, 0.4)}, 0 0 60px ${hexToRgba(color, 0.2)}, inset 0 0 20px ${hexToRgba(color, 0.1)} !important;
      pointer-events: none !important;
      opacity: var(--highlight-opacity, 1) !important;
      transition: opacity 0.1s ease-out, box-shadow 0.1s ease-out !important;
      animation: yt-nav-border-fade-in 0.1s ease-out, yt-nav-glow-pulse 2s ease-in-out infinite 0.1s !important;
    }
    @keyframes yt-nav-border-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: var(--highlight-opacity, 1);
      }
    }
    @keyframes yt-nav-glow-pulse {
      0%, 100% { opacity: var(--highlight-opacity, 1); }
      50% { opacity: calc(var(--highlight-opacity, 1) * 0.7); }
    }`;
      break;
  }

  return baseStyles + highlightEffect + badgeStyles;
};

// Inject or update styles for highlighting
const updateStyles = () => {
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;

  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }

  style.textContent = getHighlightStyles(settings.highlightColor, settings.highlightStyle);
};

// Load settings from chrome.storage
const loadSettings = async (): Promise<void> => {
  try {
    const result = await chrome.storage.local.get('yt-nav-settings');
    if (result['yt-nav-settings']) {
      settings = { ...DEFAULT_SETTINGS, ...result['yt-nav-settings'] };
    }
    updateStyles();
  } catch (error) {
    console.error('[YT Nav] Failed to load settings:', error);
  }
};

// Listen for settings changes
const setupSettingsListener = (): void => {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes['yt-nav-settings']) {
      settings = { ...DEFAULT_SETTINGS, ...changes['yt-nav-settings'].newValue };
      updateStyles();
    }
  });
};

// Check if user is typing in an input field
const isTypingInInput = (): boolean => {
  const activeElement = document.activeElement;
  if (!activeElement) return false;

  const tagName = activeElement.tagName.toLowerCase();
  const isContentEditable = activeElement.getAttribute('contenteditable') === 'true';
  const isInput = tagName === 'input' || tagName === 'textarea' || isContentEditable;

  // Also check if it's YouTube's search box
  const isSearchBox = activeElement.id === 'search' || activeElement.closest('ytd-searchbox') !== null;

  return isInput || isSearchBox;
};

// Get videos currently visible in viewport
const getVisibleVideos = (): HTMLElement[] => {
  // YouTube homepage video selectors
  const selectors = [
    'ytd-rich-item-renderer', // Homepage grid
    'ytd-video-renderer', // Search results / sidebar
    'ytd-compact-video-renderer', // Sidebar recommendations
    'ytd-grid-video-renderer', // Channel page grid
  ];

  const allVideos: HTMLElement[] = [];

  for (const selector of selectors) {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    elements.forEach(el => allVideos.push(el));
  }

  // Filter to only visible videos in viewport
  const visibleVideos = allVideos.filter(video => {
    const rect = video.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Check if video is at least partially visible
    const isVerticallyVisible = rect.top < viewportHeight && rect.bottom > 0;
    const isHorizontallyVisible = rect.left < viewportWidth && rect.right > 0;

    // Require at least 30% of the video to be visible
    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
    const visibleRatio = visibleHeight / rect.height;

    return isVerticallyVisible && isHorizontallyVisible && visibleRatio > 0.3;
  });

  // Sort by position: top-to-bottom, then left-to-right
  visibleVideos.sort((a, b) => {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();

    // Group by rows (videos within 50px vertical distance are same row)
    const rowDiff = Math.abs(rectA.top - rectB.top);
    if (rowDiff < 50) {
      return rectA.left - rectB.left; // Same row, sort by x
    }
    return rectA.top - rectB.top; // Different rows, sort by y
  });

  // Return max 9 videos (for keys 1-9)
  return visibleVideos.slice(0, 9);
};

// Clear any existing highlight
const clearHighlight = (immediate = false) => {
  if (highlightedElement) {
    if (immediate) {
      highlightedElement.classList.remove(HIGHLIGHT_CLASS);
      highlightedElement = null;
    } else {
      // Add fade-out animation to the border only
      // Use opacity on the highlight class itself for smooth fade
      highlightedElement.style.setProperty('--highlight-opacity', '0');

      setTimeout(() => {
        if (highlightedElement) {
          highlightedElement.classList.remove(HIGHLIGHT_CLASS);
          highlightedElement.style.removeProperty('--highlight-opacity');
          highlightedElement = null;
        }
      }, 200);
    }
  }
  selectedVideoIndex = null;
  lastKeyPressed = null;

  // Remove all number badges
  document.querySelectorAll('.yt-nav-number-badge').forEach(el => el.remove());
};

// Highlight a video element
const highlightVideo = (video: HTMLElement, index: number) => {
  const hadPreviousHighlight = highlightedElement !== null;

  if (hadPreviousHighlight) {
    // Fade out previous highlight first
    clearHighlight(false);
    // Wait for fade-out to complete before adding new highlight
    setTimeout(() => {
      video.classList.add(HIGHLIGHT_CLASS);
      video.style.setProperty('--highlight-opacity', '1');
      highlightedElement = video;
      selectedVideoIndex = index;
    }, 200);
  } else {
    // No previous highlight, add with fade-in
    video.classList.add(HIGHLIGHT_CLASS);
    video.style.setProperty('--highlight-opacity', '1');
    highlightedElement = video;
    selectedVideoIndex = index;
  }

  // Don't scroll for top 3 videos (index 0, 1, 2 = videos 1, 2, 3)
  // Only scroll for videos 4-9 (index 3-8)
  if (index >= 3) {
    // Scroll into view if needed, but only if video is not already well-visible
    const rect = video.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Check if video is already well-visible (at least 50% visible)
    const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
    const visibleWidth = Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0);
    const visibleRatio = (visibleHeight * visibleWidth) / (rect.height * rect.width);

    // Only scroll if less than 50% visible
    if (visibleRatio < 0.5) {
      video.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};

// Open/click the video
const openVideo = (video: HTMLElement) => {
  // Find the clickable link within the video element
  const link = video.querySelector(
    'a#video-title-link, a#thumbnail, a.ytd-thumbnail, ytd-thumbnail a, a[href*="/watch"]',
  ) as HTMLAnchorElement | null;

  if (link) {
    link.click();
  } else {
    // Fallback: try clicking the video itself
    video.click();
  }

  clearHighlight(true); // Immediate clear when opening
};

// Navigate to YouTube homepage
const goToHomepage = () => {
  const homeButton = document.querySelector(
    'a#logo, ytd-topbar-logo-renderer a, a[href="/"]',
  ) as HTMLAnchorElement | null;

  if (homeButton) {
    homeButton.click();
  } else {
    // Fallback: navigate directly
    window.location.href = 'https://www.youtube.com/';
  }
};

// Handle ESC key
const handleEscKey = () => {
  // If we have a selected video, first ESC clears it
  if (selectedVideoIndex !== null) {
    clearHighlight(false); // Smooth fade-out
    return;
  }

  // Check if double-ESC feature is enabled
  if (!settings.enableDoubleEsc) return;

  const now = Date.now();

  // Check for double-press
  if (now - lastEscTime < ESC_DOUBLE_PRESS_DELAY) {
    goToHomepage();
    lastEscTime = 0;
  } else {
    lastEscTime = now;
  }
};

// Check if an element is still visible in viewport
const isElementInViewport = (element: HTMLElement): boolean => {
  if (!element || !document.body.contains(element)) {
    return false;
  }

  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  // Check if element is at least partially visible
  const isVerticallyVisible = rect.top < viewportHeight && rect.bottom > 0;
  const isHorizontallyVisible = rect.left < viewportWidth && rect.right > 0;

  if (!isVerticallyVisible || !isHorizontallyVisible) {
    return false;
  }

  // Require at least 30% of the element to be visible
  const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
  const visibleRatio = visibleHeight / rect.height;

  return visibleRatio > 0.3;
};

// Handle number key press
const handleNumberKey = (num: number) => {
  if (!settings.enableNumberKeys) return;

  const keyStr = String(num);
  const videoIndex = num - 1; // Convert 1-9 to 0-8

  // Two-press pattern
  if (lastKeyPressed === keyStr && highlightedElement !== null) {
    // Check if the highlighted element is still in viewport
    if (isElementInViewport(highlightedElement) && selectedVideoIndex === videoIndex) {
      // Second press - open the already highlighted video
      openVideo(highlightedElement);
      return;
    } else {
      // Highlighted element is no longer in viewport or index changed
      // Recalculate and select the current video at this position
      clearHighlight(true);
      lastKeyPressed = null;
    }
  }

  // First press or recalculation - get videos and highlight
  const videos = getVisibleVideos();

  if (videoIndex >= videos.length) {
    // No video at this position
    return;
  }

  const video = videos[videoIndex];

  // Highlight the video
  highlightVideo(video, videoIndex);
  lastKeyPressed = keyStr;
};

// Handle scroll keys
const handleScrollKey = (direction: 'up' | 'down') => {
  if (!settings.enableScrollKeys) return;

  // Clear selection immediately when scrolling
  clearHighlight(true);

  const scrollAmount = window.innerHeight * 0.7;
  window.scrollBy({
    top: direction === 'down' ? scrollAmount : -scrollAmount,
    behavior: 'smooth',
  });
};

// Main keydown handler
const handleKeyDown = (event: KeyboardEvent) => {
  // Ignore if typing in input
  if (isTypingInInput()) return;

  // Ignore if any modifier keys are pressed (except for our shortcuts)
  if (event.ctrlKey || event.altKey || event.metaKey) return;

  const key = event.key;

  switch (key) {
    case 'Escape':
      handleEscKey();
      event.preventDefault();
      break;

    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      handleNumberKey(parseInt(key, 10));
      event.preventDefault();
      break;

    case 'j':
    case 'J':
      handleScrollKey('down');
      event.preventDefault();
      break;

    case 'k':
    case 'K':
      handleScrollKey('up');
      event.preventDefault();
      break;
  }
};

// Initialize
const init = async () => {
  console.log('[YouTube Instant Navigation] Content script loaded');

  // Load settings first
  await loadSettings();

  // Setup listener for settings changes
  setupSettingsListener();

  // Add event listeners
  document.addEventListener('keydown', handleKeyDown);

  // Clear highlight when scrolling (debounced)
  let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
  const handleScroll = () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
      // Clear selection after scroll settles
      if (highlightedElement) {
        clearHighlight(true);
      }
    }, 100);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Clear highlight when clicking elsewhere
  document.addEventListener('click', e => {
    if (highlightedElement && !highlightedElement.contains(e.target as Node)) {
      clearHighlight(false); // Smooth fade-out
    }
  });
};

// Run initialization
init();
