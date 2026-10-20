import { getStore } from "./store";
import { clone } from "./helpers";

const MONTHS = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export async function getDashboardStats() {
  const store = getStore();

  const activeMembers = store.members.filter((m) => m.status === "active").length;
  const todaysBookings = store.bookings.length + store.ptBookings.length;
  const pendingEnquiries = store.enquiries.filter((e) => e.status === "new").length;
  const supplementOrders = store.orders.length;

  const totalCapacity = store.classSchedule.reduce((sum, s) => sum + s.capacity, 0);
  const totalBooked = store.classSchedule.reduce((sum, s) => sum + s.booked, 0);
  const classOccupancy = totalCapacity ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  const planPrice = { basic: 1499, pro: 2499, elite: 4999 };
  const monthlyRevenue = store.members
    .filter((m) => m.status === "active")
    .reduce((sum, m) => sum + (planPrice[m.planSlug] || 0), 0);

  const membershipGrowth = MONTHS.map((month, i) => ({
    month,
    members: Math.round(1800 + i * 130 + (i % 2 === 0 ? 40 : -20)),
  }));
  membershipGrowth.push({ month: "Aug", members: 2500 + activeMembers });

  const revenueTrend = MONTHS.map((month, i) => ({
    month,
    revenue: Math.round(2800000 + i * 180000 + (i % 3 === 0 ? 90000 : -40000)),
  }));
  revenueTrend.push({ month: "Aug", revenue: monthlyRevenue + 3600000 });

  const bookingsTrend = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
    const count = store.classSchedule.filter((s) => s.day === day).reduce((sum, s) => sum + s.booked, 0);
    return { day, bookings: count };
  });

  const popularPrograms = store.programs
    .map((p) => ({ name: p.name, interest: 40 + (p.name.length * 7) % 55 }))
    .sort((a, b) => b.interest - a.interest)
    .slice(0, 6);

  const popularClasses = store.classDefinitions
    .map((c) => {
      const total = store.classSchedule.filter((s) => s.classSlug === c.slug).reduce((sum, s) => sum + s.booked, 0);
      return { name: c.name, bookings: total };
    })
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 6);

  return clone({
    totalMembers: store.members.length,
    activeMemberships: activeMembers,
    todaysBookings,
    monthlyRevenue,
    pendingEnquiries,
    supplementOrders,
    classOccupancy,
    membershipGrowth,
    revenueTrend,
    bookingsTrend,
    popularPrograms,
    popularClasses,
  });
}
