import { createStorage, StorageEnum } from '../base/index.js';

type HighlightStyle = 'gradient-bottom' | 'gradient-top' | 'solid' | 'glow';

interface YtNavSettingsType {
  enableDoubleEsc: boolean;
  enableNumberKeys: boolean;
  enableScrollKeys: boolean;
  highlightColor: string;
  highlightStyle: HighlightStyle;
}

const storage = createStorage<YtNavSettingsType>(
  'yt-nav-settings',
  {
    enableDoubleEsc: true,
    enableNumberKeys: true,
    enableScrollKeys: true,
    highlightColor: '#d4a853', // Default golden color
    highlightStyle: 'gradient-bottom',
  },
  {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
  },
);

const ytNavStorage = {
  ...storage,
  setDoubleEsc: async (enabled: boolean) => {
    await storage.set(current => ({ ...current, enableDoubleEsc: enabled }));
  },
  setNumberKeys: async (enabled: boolean) => {
    await storage.set(current => ({ ...current, enableNumberKeys: enabled }));
  },
  setScrollKeys: async (enabled: boolean) => {
    await storage.set(current => ({ ...current, enableScrollKeys: enabled }));
  },
  setHighlightColor: async (color: string) => {
    await storage.set(current => ({ ...current, highlightColor: color }));
  },
  setHighlightStyle: async (style: HighlightStyle) => {
    await storage.set(current => ({ ...current, highlightStyle: style }));
  },
};

export { ytNavStorage, type HighlightStyle, type YtNavSettingsType };
