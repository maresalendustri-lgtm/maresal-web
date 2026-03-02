import { getServices } from "@/lib/actions/services";
import ServiceList from "@/components/admin/ServiceList";

export default async function AdminServicesPage() {
  const services = await getServices();

  return <ServiceList initialServices={services} />;
}
