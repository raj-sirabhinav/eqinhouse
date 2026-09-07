export type NavRoute = '/' | '/services' | '/stack' | '/intake';

export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period?: string;
  timeline: string;
  featured?: boolean;
  badge?: string;
  deliverables: string[];
  antiScope: string;
  ctaText: string;
}

export interface IngestPayload {
  email: string;
  arrRange: string;
  acvRange: string;
  crm: string;
  enrichmentTools: string[];
  secretShopperConsent: boolean;
  selectedTier?: string;
}
