import { getMessages } from "@/lib/actions/messages";
import AdminMessagesClient from "@/components/admin/AdminMessagesClient";

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return <AdminMessagesClient initialMessages={messages} />;
}
