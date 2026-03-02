import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServiceBySlug } from "@/lib/actions/services";
import ServicePresentation from "@/components/ServicePresentation";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Hizmet Bulunamadı" };

  return {
    title: `${service.title} — Sunum | Maresal`,
    description: `${service.title} hizmet sunumu. ${service.description}`,
    robots: { index: false, follow: false },
  };
}

export default async function PresentationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  return <ServicePresentation service={service} />;
}
