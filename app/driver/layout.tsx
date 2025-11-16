import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-2xl font-bold">
                RouteSort
              </Link>
              <span className="text-blue-100">Driver Portal</span>
            </div>
            <div className="flex items-center space-x-6">
              <SignedIn>
                <Link href="/driver" className="hover:text-blue-200">
                  Dashboard
                </Link>
                <Link href="/driver/routes" className="hover:text-blue-200">
                  My Routes
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-blue-50">
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
