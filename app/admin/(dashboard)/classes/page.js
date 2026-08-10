import { listClassDefinitions, listSchedule } from "@/lib/db/classes";
import { listTrainers } from "@/lib/db/trainers";
import ClassesManager from "@/components/admin/ClassesManager";

export const metadata = { title: "Classes" };

export default async function AdminClassesPage() {
  const [classDefinitions, sessions, trainers] = await Promise.all([listClassDefinitions(), listSchedule(), listTrainers()]);
  return <ClassesManager classDefinitions={classDefinitions} sessions={sessions} trainers={trainers} />;
}
