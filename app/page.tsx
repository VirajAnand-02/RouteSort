import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center text-base font-bold">
              RS
            </div>
            <div className="leading-tight">
              <div className="font-semibold">RouteSort</div>
              <div className="text-xs text-muted-foreground">Smart waste pickup and rewards</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Low-cost, software-first</Badge>
              <Badge variant="outline">CVRP routing</Badge>
              <Badge variant="outline">AI guidance</Badge>
              <Badge variant="outline">Rewards + gamification</Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Route Sort: smart waste pickup and rewards
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-prose">
              RouteSort is a waste management ecosystem that improves routing efficiency, boosts source segregation,
              and increases citizen participation—without relying on expensive IoT hardware.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/signup">Get started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/signin">I already have an account</Link>
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Built for suburban communities and college campuses. Team: BEARly Asleep.
            </p>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>What RouteSort fixes</CardTitle>
              <CardDescription>Three bottlenecks that make municipal collection inefficient.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <div className="font-medium">Inefficient routing</div>
                <div className="text-muted-foreground">Fuel and labor wasted on suboptimal routes.</div>
              </div>
              <Separator />
              <div>
                <div className="font-medium">Poor segregation at the source</div>
                <div className="text-muted-foreground">Contamination reduces recycling yield.</div>
              </div>
              <Separator />
              <div>
                <div className="font-medium">Low participation</div>
                <div className="text-muted-foreground">Without incentives, behavior change doesn’t stick.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-2xl font-semibold">A 3-part platform</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Citizen experience, driver operations, and coordinator visibility—working together.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/signin?callbackUrl=/app">Open the apps</Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Citizen app</CardTitle>
              <CardDescription>Schedule pickups, learn segregation, earn points.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>AI-powered camera guidance for recyclables</li>
                <li>Rewards and leaderboards for engagement</li>
                <li>Simple, mobile-first flow</li>
              </ul>
              <Button asChild className="w-full">
                <Link href="/app">Open citizen app</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Driver dashboard</CardTitle>
              <CardDescription>Optimized routes for real-world capacity limits.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>CVRP heuristic routing with capacity awareness</li>
                <li>Live job queue and route visualization</li>
                <li>Operational focus: fewer miles, faster pickups</li>
              </ul>
              <Button asChild className="w-full" variant="secondary">
                <Link href="/driver">Open driver dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Coordinator dashboard</CardTitle>
              <CardDescription>Real-time oversight and KPI reporting.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Request visibility and assignment</li>
                <li>Fleet capacity monitoring</li>
                <li>Analytics for recycling and emissions impact</li>
              </ul>
              <Button asChild className="w-full" variant="outline">
                <Link href="/coordinator">Open coordinator dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Projected impact</CardTitle>
              <CardDescription>What we aim to improve by optimizing routing and behavior.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-border p-4">
                <div className="text-2xl font-semibold">15–20%</div>
                <div className="text-xs text-muted-foreground">Projected landfill reduction</div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="text-2xl font-semibold">↓ fuel</div>
                <div className="text-xs text-muted-foreground">Fewer miles from better routing</div>
              </div>
              <div className="rounded-lg border border-border p-4">
                <div className="text-2xl font-semibold">↑ participation</div>
                <div className="text-xs text-muted-foreground">Rewards drive repeat behavior</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Tech stack</CardTitle>
              <CardDescription>Pragmatic tools to ship fast and scale.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="outline">Next.js</Badge>
              <Badge variant="outline">Supabase Postgres</Badge>
              <Badge variant="outline">Prisma</Badge>
              <Badge variant="outline">NextAuth</Badge>
              <Badge variant="outline">CVRP heuristic</Badge>
              <Badge variant="outline">External LLM API (classification)</Badge>
              <Badge variant="outline">AWS hosting</Badge>
              <Badge variant="outline">Capacitor (mobile)</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RouteSort · Built by BEARly Asleep
          </div>
          <div className="flex gap-4 text-sm">
            <Link className="underline underline-offset-4 text-muted-foreground hover:text-foreground" href="/app">
              Citizen
            </Link>
            <Link className="underline underline-offset-4 text-muted-foreground hover:text-foreground" href="/driver">
              Driver
            </Link>
            <Link
              className="underline underline-offset-4 text-muted-foreground hover:text-foreground"
              href="/coordinator"
            >
              Coordinator
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
