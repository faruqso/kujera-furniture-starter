export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverse';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonData {
  label: string;
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export interface HeroSection {
  type: 'hero';
  variant?: 'default' | 'compact' | 'furniture';
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  image?: string;
  searchPlaceholder?: string;
  buttons?: ButtonData[];
}

export interface WhyChoosingUsItem {
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
}

export interface WhyChoosingUsSection {
  type: 'whyChoosingUs';
  titleLine1?: string;
  titleLine2?: string;
  items: WhyChoosingUsItem[];
}

export interface BestSellingCategory {
  id: string;
  label: string;
}

export interface BestSellingProductItem {
  slug: string;
  category: string;
  label: string;
  name: string;
  price: number;
  rating: number;
  image: string;
}

export interface ExperiencesSection {
  type: 'experiences';
  eyebrow?: string;
  headline: string;
  description: string;
  href?: string;
  linkLabel?: string;
}

export interface MaterialsSection {
  type: 'materials';
  eyebrow?: string;
  headline: string;
  description: string;
  href?: string;
  linkLabel?: string;
}

export interface BestSellingProductsSection {
  type: 'bestSellingProducts';
  headline?: string;
  categories?: BestSellingCategory[];
  defaultCategory?: string;
  products: BestSellingProductItem[];
  viewAllHref?: string;
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  image?: string;
  avatar?: string;
  rating?: number;
}

export interface TestimonialsSection {
  type: 'testimonials';
  variant?: 'furniture';
  eyebrow?: string;
  headline?: string;
  items: TestimonialItem[];
}

export interface CtaSection {
  type: 'cta';
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  image?: string;
  buttons?: ButtonData[];
}

export interface RichTextSection {
  type: 'richText';
  content: string;
}

export interface AboutHeroSection {
  type: 'aboutHero';
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  image: string;
}

export interface ParallaxSection {
  type: 'parallaxSection';
  image: string;
  eyebrow?: string;
  headline: string;
  description: string;
  tone?: 'light' | 'dark';
}

export interface AboutSplitSection {
  type: 'aboutSplit';
  layout?: 'image-left' | 'image-right';
  image: string;
  eyebrow?: string;
  headline: string;
  description: string;
  cta?: ButtonData;
}

export interface AboutGalleryImage {
  src: string;
  alt?: string;
}

export interface AboutGallerySection {
  type: 'aboutGallery';
  eyebrow?: string;
  headline: string;
  description?: string;
  images: AboutGalleryImage[];
}

export interface ContactSection {
  type: 'contact';
  eyebrow?: string;
  headline: string;
  subheadline?: string;
  email?: string;
  phone?: string;
  address?: string;
  hours?: string;
}

export type PageSection =
  | HeroSection
  | WhyChoosingUsSection
  | BestSellingProductsSection
  | ExperiencesSection
  | MaterialsSection
  | TestimonialsSection
  | CtaSection
  | ContactSection
  | RichTextSection
  | AboutHeroSection
  | ParallaxSection
  | AboutSplitSection
  | AboutGallerySection;
