import { listEnquiries } from "@/lib/db/messages";
import MessagesManager from "@/components/admin/MessagesManager";

export const metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const enquiries = await listEnquiries();
  return <MessagesManager enquiries={enquiries} />;
}
