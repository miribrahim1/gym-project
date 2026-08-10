import { getSettings } from "@/lib/db/settings";
import PageHeader from "@/components/admin/PageHeader";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <PageHeader title="Settings" description="Changes here update the live public website immediately." />
      <SettingsForm settings={settings} />
    </div>
  );
}
