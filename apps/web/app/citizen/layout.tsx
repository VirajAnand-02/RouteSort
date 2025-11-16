import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-2xl font-bold">
                RouteSort
              </Link>
              <span className="text-green-100">Citizen Portal</span>
            </div>
            <div className="flex items-center space-x-6">
              <SignedIn>
                <Link href="/citizen" className="hover:text-green-200">
                  Dashboard
                </Link>
                <Link href="/citizen/schedule" className="hover:text-green-200">
                  Schedule Pickup
                </Link>
                <Link href="/citizen/recycling" className="hover:text-green-200">
                  Recycling Guide
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-white text-green-600 px-4 py-2 rounded-md font-semibold hover:bg-green-50">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
