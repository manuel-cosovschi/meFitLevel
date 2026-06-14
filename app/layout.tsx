import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import HydrationGate from "@/components/HydrationGate";

export const metadata: Metadata = {
  title: "Hunter Gym System",
  description:
    "Sistema de cazador para registrar, planificar y progresar tu entrenamiento. Sobrecarga progresiva + RPG estilo Solo Leveling.",
  applicationName: "Hunter Gym System",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hunter System",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#070a12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <ServiceWorkerRegister />
        <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col">
          <main className="safe-top flex-1 px-4 pb-28 pt-4">
            <HydrationGate>{children}</HydrationGate>
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
