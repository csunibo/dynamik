import { persisted } from 'svelte-local-storage-store';
import { derived } from 'svelte/store';

const BANNER_KEY = 'newSettingsBannerVersion';
const ACTUAL_BANNER_VERSION = 1;

const dismissedLastVersion = persisted<number>(BANNER_KEY, 0);

export const setBannerClosed = () => {
    dismissedLastVersion.set(ACTUAL_BANNER_VERSION);
}

export const shouldShowBanner = derived(dismissedLastVersion, (store) => store < ACTUAL_BANNER_VERSION);
