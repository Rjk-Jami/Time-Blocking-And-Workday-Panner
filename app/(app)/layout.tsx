import AppFooter from "@/components/shell/AppFooter";
import AppNav from "@/components/shell/AppNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppNav />
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}
