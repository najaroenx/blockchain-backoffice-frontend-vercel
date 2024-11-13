import { NavbarPortal } from "@/components/layout/NavbarPortal";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavbarPortal />
      <main className="flex items-center justify-center min-h-screen">
        {children}
      </main>
    </>
  );
}
