import { getSettings } from "@/lib/db/settings";
import SiteHeader from "@/components/layout/SiteHeader";
import Footer from "@/components/layout/Footer";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import { CartProvider } from "@/components/supplements/CartProvider";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }) {
  const settings = await getSettings();

  return (
    <CartProvider>
      <SiteHeader settings={settings} />
      <main className="flex-1 pb-16 xl:pb-0">{children}</main>
      <Footer settings={settings} />
      <MobileBottomBar settings={settings} />
    </CartProvider>
  );
}
