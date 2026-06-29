import {
  Facebook02Icon,
  InstagramIcon,
  NewTwitterIcon,
  type IconSvgObject,
} from '@hugeicons/core-free-icons';

export type HugeIconNode = readonly [tag: string, attrs: Record<string, string>];
export type HugeIconData = IconSvgObject;

export const socialIcons = {
  facebook: Facebook02Icon,
  twitter: NewTwitterIcon,
  instagram: InstagramIcon,
} as const;

export type SocialIconName = keyof typeof socialIcons;
