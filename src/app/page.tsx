import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-xl">ProjectManager</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/register">
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-slate-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Manage projects with ease
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  The complete project management solution for teams. Plan, track, and collaborate in one place.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg">Sign In</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-3">
              <div className="space-y-4">
                <CheckCircle2 className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Role-Based Access</h3>
                <p className="text-gray-500">Secure your workspace with Admin and Member roles.</p>
              </div>
              <div className="space-y-4">
                <CheckCircle2 className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Task Management</h3>
                <p className="text-gray-500">Track tasks, set priorities, and monitor deadlines.</p>
              </div>
              <div className="space-y-4">
                <CheckCircle2 className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Analytics</h3>
                <p className="text-gray-500">Get insights into project progress and team velocity.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2026 ProjectManager. All rights reserved.</p>
      </footer>
    </div>
  );
}
