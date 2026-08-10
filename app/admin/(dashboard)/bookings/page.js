import { listBookings } from "@/lib/db/classes";
import { listPersonalTrainingBookings } from "@/lib/db/personalTraining";
import BookingsManager from "@/components/admin/BookingsManager";

export const metadata = { title: "Bookings" };

export default async function AdminBookingsPage() {
  const [classBookings, ptBookings] = await Promise.all([listBookings(), listPersonalTrainingBookings()]);
  return <BookingsManager classBookings={classBookings} ptBookings={ptBookings} />;
}
