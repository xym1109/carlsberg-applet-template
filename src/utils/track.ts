// @ts-ignore
import { carlsberg } from '@/utils/carlsbergTrack/cct-wxa.js';

export { carlsberg };

export const Track = function (category: string, action: string, label: string, value?: string) {
  carlsberg('track', 'event', category, action, label, value);
};
