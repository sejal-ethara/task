"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { User } from "@/types";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/api/auth/me");
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user in navbar");
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex items-center p-4 border-b h-16 bg-white">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" />
            }
          >
            <Menu />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-r-0 bg-slate-900 w-72">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex w-full justify-end">
        {user ? (
          <div className="flex items-center gap-x-2 text-sm font-medium">
            <span>{user.name}</span>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {user.role}
            </span>
          </div>
        ) : (
          <div className="h-8 w-24 bg-muted rounded animate-pulse" />
        )}
      </div>
    </div>
  );
}
