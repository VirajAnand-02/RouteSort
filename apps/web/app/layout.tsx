import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "RouteSort - Smart Waste Pickup System",
  description: "Optimize waste pickup routes and schedule pickups efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if Clerk is properly configured (not mock keys)
  const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
  const hasValidClerkKey = clerkKey && 
                          clerkKey.startsWith('pk_') && 
                          !clerkKey.includes('mock') &&
                          clerkKey.length > 10;
  
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="antialiased">
        {hasValidClerkKey ? (
          <ClerkProvider>
            {children}
          </ClerkProvider>
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  );
}
