import '@src/Popup.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { ytNavStorage } from '@extension/storage';
import { ErrorDisplay, LoadingSpinner } from '@extension/ui';
import type { HighlightStyle } from '@extension/storage';

const PRESET_COLORS = [
  { name: 'Gold', value: '#d4a853' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Cyan', value: '#06b6d4' },
];

const HIGHLIGHT_STYLES: { value: HighlightStyle; label: string; icon: string }[] = [
  { value: 'gradient-bottom', label: 'Gradient ↓', icon: '▼' },
  { value: 'gradient-top', label: 'Gradient ↑', icon: '▲' },
  { value: 'solid', label: 'Solid', icon: '■' },
  { value: 'glow', label: 'Glow', icon: '✦' },
];

const Toggle = ({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}) => (
  <label className="flex cursor-pointer items-center justify-between">
    <span className="text-sm text-gray-300">{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={`relative h-6 w-11 rounded-full transition-colors ${enabled ? 'bg-[#d4a853]' : 'bg-[#4f4f4f]'}`}>
      <span
        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  </label>
);

const Popup = () => {
  const settings = useStorage(ytNavStorage);

  return (
    <div className="min-w-[320px] bg-[#0f0f0f] p-4 text-white">
      <header className="mb-4">
        <h1 className="flex items-center gap-2 text-xl font-bold text-[#d4a853]">
          <span className="text-2xl">▶</span>
          YT Navigation
        </h1>
        <p className="mt-1 text-sm text-gray-400">Keyboard shortcuts for faster browsing</p>
      </header>

      {/* Settings */}
      <div className="space-y-3">
        <div className="rounded-lg bg-[#272727] p-3">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Features</h2>
          <div className="space-y-3">
            <Toggle enabled={settings.enableDoubleEsc} onChange={ytNavStorage.setDoubleEsc} label="Double ESC → Home" />
            <Toggle
              enabled={settings.enableNumberKeys}
              onChange={ytNavStorage.setNumberKeys}
              label="Number keys (1-9) select videos"
            />
            <Toggle enabled={settings.enableScrollKeys} onChange={ytNavStorage.setScrollKeys} label="J/K scroll page" />
          </div>
        </div>

        {/* Color Picker */}
        <div className="rounded-lg bg-[#272727] p-3">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Highlight Color</h2>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map(color => (
              <button
                key={color.value}
                onClick={() => ytNavStorage.setHighlightColor(color.value)}
                className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${settings.highlightColor === color.value ? 'border-white' : 'border-transparent'}`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
            <label className="relative">
              <input
                type="color"
                value={settings.highlightColor}
                onChange={e => ytNavStorage.setHighlightColor(e.target.value)}
                className="absolute inset-0 h-8 w-8 cursor-pointer opacity-0"
              />
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-gray-500 text-xs text-gray-400"
                title="Custom color">
                +
              </div>
            </label>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div
              className="h-4 w-4 rounded"
              style={{ backgroundColor: settings.highlightColor, boxShadow: `0 0 8px ${settings.highlightColor}` }}
            />
            <span className="font-mono text-xs text-gray-400">{settings.highlightColor}</span>
          </div>
        </div>

        {/* Highlight Style */}
        <div className="rounded-lg bg-[#272727] p-3">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Highlight Style</h2>
          <div className="grid grid-cols-4 gap-2">
            {HIGHLIGHT_STYLES.map(style => (
              <button
                key={style.value}
                onClick={() => ytNavStorage.setHighlightStyle(style.value)}
                className={`flex flex-col items-center gap-1 rounded-lg p-2 transition-all ${settings.highlightStyle === style.value ? 'bg-[#3f3f3f] ring-1 ring-[#d4a853]' : 'bg-[#1f1f1f] hover:bg-[#3f3f3f]'}`}>
                <span className="text-lg" style={{ color: settings.highlightColor }}>
                  {style.icon}
                </span>
                <span className="text-[10px] text-gray-400">{style.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Shortcuts Reference */}
        <div className="rounded-lg bg-[#272727] p-3">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Shortcuts</h2>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Go Home</span>
              <kbd className="rounded bg-[#3f3f3f] px-1.5 py-0.5 font-mono text-gray-300">ESC ESC</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Select Video</span>
              <kbd className="rounded bg-[#3f3f3f] px-1.5 py-0.5 font-mono text-gray-300">1-9</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Open Selected</span>
              <kbd className="rounded bg-[#3f3f3f] px-1.5 py-0.5 font-mono text-gray-300">1-9</kbd>
              <span className="text-gray-500">(again)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Scroll Down/Up</span>
              <span>
                <kbd className="rounded bg-[#3f3f3f] px-1.5 py-0.5 font-mono text-gray-300">J</kbd>
                {' / '}
                <kbd className="rounded bg-[#3f3f3f] px-1.5 py-0.5 font-mono text-gray-300">K</kbd>
              </span>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-3 border-t border-[#3f3f3f] pt-2">
        <p className="text-center text-xs text-gray-500">Works on youtube.com</p>
      </footer>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <LoadingSpinner />), ErrorDisplay);
