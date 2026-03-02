import { getAboutContent } from "@/lib/actions/about";
import AboutEditor from "@/components/admin/AboutEditor";

export default async function AdminAboutPage() {
  const content = await getAboutContent();
  return <AboutEditor initialContent={content} />;
}
