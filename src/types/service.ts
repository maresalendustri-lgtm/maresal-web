export interface ServiceSpec {
  label: string;
  value: string;
}

export interface ServiceGalleryItem {
  url: string;
  alt: string;
}

export interface ServiceProcessStep {
  title: string;
  desc: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  detail_description: string | null;
  tag: string;
  hero_image: string | null;
  image: string | null;
  features: string[];
  specs: ServiceSpec[];
  gallery: ServiceGalleryItem[];
  process: ServiceProcessStep[];
  is_active: boolean;
  sort_order: number;
  is_main_service?: boolean;
  created_at: string;
  updated_at: string;
}

export type ServiceInsert = Omit<Service, "id" | "created_at" | "updated_at">;
export type ServiceUpdate = Partial<ServiceInsert>;
