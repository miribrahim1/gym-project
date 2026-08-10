import { listOrders } from "@/lib/db/supplements";
import OrdersManager from "@/components/admin/OrdersManager";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const orders = await listOrders();
  return <OrdersManager orders={orders} />;
}
