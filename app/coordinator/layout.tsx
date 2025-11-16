import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-purple-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-2xl font-bold">
                RouteSort
              </Link>
              <span className="text-purple-100">Coordinator Dashboard</span>
            </div>
            <div className="flex items-center space-x-6">
              <SignedIn>
                <Link href="/coordinator" className="hover:text-purple-200">
                  Dashboard
                </Link>
                <Link href="/coordinator/requests" className="hover:text-purple-200">
                  Requests
                </Link>
                <Link href="/coordinator/routes" className="hover:text-purple-200">
                  Routes
                </Link>
                <Link href="/coordinator/fleet" className="hover:text-purple-200">
                  Fleet
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-white text-purple-600 px-4 py-2 rounded-md font-semibold hover:bg-purple-50">
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
