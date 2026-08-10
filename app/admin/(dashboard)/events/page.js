import { listEvents } from "@/lib/db/events";
import CrudManager from "@/components/admin/CrudManager";
import { createEventAction, updateEventAction, deleteEventAction } from "@/lib/actions/adminCrud";

export const metadata = { title: "Events" };

const CATEGORIES = ["Challenge", "Competition", "Workshop", "Community"];

const FIELDS = [
  { name: "name", label: "Event Name", required: true, span: "full" },
  { name: "category", label: "Category", type: "select", options: CATEGORIES, required: true },
  { name: "date", label: "Date", type: "date", required: true },
  { name: "time", label: "Time", placeholder: "07:00 AM" },
  { name: "location", label: "Location" },
  { name: "seatsTotal", label: "Total Seats", type: "number" },
  { name: "seatsBooked", label: "Seats Booked", type: "number" },
  { name: "description", label: "Description", type: "textarea", span: "full" },
];

const COLUMNS = [
  { key: "name", label: "Event" },
  { key: "category", label: "Category" },
  { key: "date", label: "Date", format: "date" },
  { key: "seatsBooked", label: "Seats", format: "fraction", denominatorKey: "seatsTotal" },
];

export default async function AdminEventsPage() {
  const events = await listEvents();

  return (
    <CrudManager
      title="Events"
      description="Manage upcoming challenges, workshops and community events."
      items={events}
      columns={COLUMNS}
      fields={FIELDS}
      searchKeys={["name", "category", "location"]}
      itemLabel="Event"
      emptyIcon="PartyPopper"
      actions={{ create: createEventAction, update: updateEventAction, remove: deleteEventAction }}
    />
  );
}
