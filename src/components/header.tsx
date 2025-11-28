"use client";

import { Printer, User } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-md">
            <Printer className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            PrintPro Calculator
          </h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Tài khoản">
                <User className="h-5 w-5" />
            </Button>
        </div>
      </div>
    </header>
  );
}
