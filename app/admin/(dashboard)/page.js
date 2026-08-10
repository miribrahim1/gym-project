import { Users, CreditCard, ClipboardCheck, IndianRupee, MessageSquare, ShoppingBag, Gauge } from "lucide-react";
import { getDashboardStats } from "@/lib/db/stats";
import StatCard from "@/components/admin/StatCard";
import PageHeader from "@/components/admin/PageHeader";
import TrendChart from "@/components/admin/charts/TrendChart";
import RankedBarChart from "@/components/admin/charts/RankedBarChart";
import { formatCurrency } from "@/lib/utils/format";

export const metadata = { title: "Dashboard" };

export default async function AdminOverviewPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <PageHeader title="Dashboard" description="A live snapshot of IronVault Fitness operations." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Members" value={stats.totalMembers} tone="gold" />
        <StatCard icon={CreditCard} label="Active Memberships" value={stats.activeMemberships} tone="emerald" />
        <StatCard icon={ClipboardCheck} label="Today's Bookings" value={stats.todaysBookings} tone="sky" />
        <StatCard icon={IndianRupee} label="Monthly Revenue" value={formatCurrency(stats.monthlyRevenue)} tone="gold" />
        <StatCard icon={MessageSquare} label="Pending Enquiries" value={stats.pendingEnquiries} tone="rose" />
        <StatCard icon={ShoppingBag} label="Supplement Orders" value={stats.supplementOrders} tone="emerald" />
        <StatCard icon={Gauge} label="Class Occupancy" value={`${stats.classOccupancy}%`} tone="sky" hint="Across all scheduled sessions" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Membership Growth" description="Total active members over the last 6 months">
          <TrendChart data={stats.membershipGrowth} dataKey="members" xKey="month" color="#c6a04a" />
        </ChartCard>
        <ChartCard title="Revenue Trend" description="Monthly recurring revenue">
          <TrendChart data={stats.revenueTrend} dataKey="revenue" xKey="month" color="#34d399" format="lakh" />
        </ChartCard>
        <ChartCard title="Weekly Bookings" description="Class bookings by day of week">
          <TrendChart data={stats.bookingsTrend} dataKey="bookings" xKey="day" color="#38bdf8" />
        </ChartCard>
        <ChartCard title="Popular Programs" description="Relative member interest by program">
          <RankedBarChart data={stats.popularPrograms} dataKey="interest" nameKey="name" />
        </ChartCard>
        <ChartCard title="Popular Classes" description="Total bookings by class type" className="lg:col-span-2">
          <RankedBarChart data={stats.popularClasses} dataKey="bookings" nameKey="name" />
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, description, children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-ink-700 bg-ink-900/60 p-6 ${className}`}>
      <h3 className="font-display text-xl tracking-wide text-bone-50">{title}</h3>
      <p className="mt-1 text-xs text-bone-500">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
