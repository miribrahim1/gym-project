export const metadata = {
  title: { default: "Admin", template: "%s | IronVault Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }) {
  return children;
}
