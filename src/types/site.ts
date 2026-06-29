export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: 'facebook' | 'twitter' | 'instagram';
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  logo?: string;
  currency: { code: 'USD' | 'EUR'; symbol: string };
  navLinks: NavLink[];
  footerColumns: FooterColumn[];
  footerAbout?: string;
  footerStayConnectedTitle?: string;
  socialLinks?: SocialLink[];
  legalLinks?: NavLink[];
  announcementBar?: { text: string; href?: string };
  seo: {
    titleTemplate: string;
    defaultDescription: string;
    ogImage: string;
  };
  copyright: string;
}
