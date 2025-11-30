import '@src/Popup.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { ytNavStorage } from '@extension/storage';
import { ErrorDisplay, LoadingSpinner } from '@extension/ui';
import type { HighlightStyle } from '@extension/storage';

const PRESET_COLORS = [
  { name: 'YouTube Red', value: '#FF0000' },
  { name: 'Coral', value: '#FF6B6B' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Amber', value: '#F59E0B' },
];

const HIGHLIGHT_STYLES: { value: HighlightStyle; label: string }[] = [
  { value: 'gradient-bottom', label: 'Fade Up' },
  { value: 'gradient-top', label: 'Fade Down' },
  { value: 'solid', label: 'Solid' },
  { value: 'glow', label: 'Glow' },
];

const FeatureToggle = ({
  enabled,
  onChange,
  title,
  description,
  shortcut,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  title: string;
  description: string;
  shortcut?: string;
}) => (
  <div
    role="switch"
    aria-checked={enabled}
    tabIndex={0}
    className={`group cursor-pointer rounded-xl p-3 transition-all duration-200 ${enabled ? 'bg-white/[0.08]' : 'bg-transparent hover:bg-white/[0.04]'}`}
    onClick={() => onChange(!enabled)}
    onKeyDown={e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onChange(!enabled);
      }
    }}>
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-white/90">{title}</span>
          {shortcut && (
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/50">{shortcut}</kbd>
          )}
        </div>
        <p className="mt-0.5 text-[11px] leading-relaxed text-white/40">{description}</p>
      </div>
      <button
        className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors duration-200 ${enabled ? 'bg-[#FF0000]' : 'bg-white/20'}`}>
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-200 ${enabled ? 'left-[18px]' : 'left-0.5'}`}
        />
      </button>
    </div>
  </div>
);

const Popup = () => {
  const settings = useStorage(ytNavStorage);

  return (
    <div className="w-[300px] bg-[#0d0d0d] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06] px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF0000]">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-[15px] font-semibold tracking-tight text-white">YT Navigation</h1>
            <p className="text-[11px] text-white/40">Navigate YouTube with your keyboard</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-1 px-2 py-3">
        <FeatureToggle
          enabled={settings.enableDoubleEsc}
          onChange={ytNavStorage.setDoubleEsc}
          title="Quick Home"
          description="Double-tap ESC to instantly go back to homepage"
          shortcut="ESC×2"
        />
        <FeatureToggle
          enabled={settings.enableNumberKeys}
          onChange={ytNavStorage.setNumberKeys}
          title="Video Selection"
          description="Press 1-9 to highlight videos, press again to open"
          shortcut="1-9"
        />
        <FeatureToggle
          enabled={settings.enableScrollKeys}
          onChange={ytNavStorage.setScrollKeys}
          title="Vim-style Scroll"
          description="Use J/K keys to scroll down and up the page"
          shortcut="J/K"
        />
        <FeatureToggle
          enabled={settings.showBadges}
          onChange={ytNavStorage.setShowBadges}
          title="Number Badges"
          description="Show small number indicators on video thumbnails"
        />
      </div>

      {/* Appearance Section */}
      <div className="border-t border-white/[0.06] px-4 py-3">
        <h2 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-white/30">Appearance</h2>

        {/* Color Selection */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] text-white/60">Highlight Color</span>
            <span className="font-mono text-[10px] text-white/30">{settings.highlightColor}</span>
          </div>
          <div className="flex items-center gap-2">
            {PRESET_COLORS.map(color => (
              <button
                key={color.value}
                onClick={() => ytNavStorage.setHighlightColor(color.value)}
                className={`h-7 w-7 rounded-full transition-all duration-150 hover:scale-110 ${settings.highlightColor === color.value ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0d0d0d]' : ''}`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
            <label
              className="relative cursor-pointer"
              htmlFor="highlight-color-picker"
              aria-label="Select highlight color">
              <input
                id="highlight-color-picker"
                type="color"
                value={settings.highlightColor}
                onChange={e => ytNavStorage.setHighlightColor(e.target.value)}
                className="absolute inset-0 h-7 w-7 cursor-pointer opacity-0"
              />
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-white/20 text-white/40 transition-colors hover:border-white/40 hover:text-white/60">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
            </label>
          </div>
        </div>

        {/* Style Selection */}
        <div>
          <span className="mb-2 block text-[12px] text-white/60">Highlight Style</span>
          <div className="grid grid-cols-4 gap-1.5">
            {HIGHLIGHT_STYLES.map(style => (
              <button
                key={style.value}
                onClick={() => ytNavStorage.setHighlightStyle(style.value)}
                className={`rounded-lg px-2 py-2 text-[11px] transition-all duration-150 ${settings.highlightStyle === style.value ? 'bg-white/15 text-white' : 'bg-white/[0.05] text-white/50 hover:bg-white/10 hover:text-white/70'}`}>
                {style.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-4 py-2.5">
        <p className="text-center text-[10px] text-white/25">Active on youtube.com • Disabled in input fields</p>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <LoadingSpinner />), ErrorDisplay);
