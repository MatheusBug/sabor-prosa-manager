"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Menu,
  CircleUser,
  Sun,
  Moon,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { NAV_ITEMS_MAIN, NAV_ITEMS_USER, APP_NAME } from "@/lib/constants";
import type { NavItem } from "@/lib/types";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/icons";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    setIsDarkTheme(root.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    root.classList.toggle('dark');
    setIsDarkTheme(!isDarkTheme);
    // You might want to persist this preference in localStorage
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
          prefetch={false}
        >
          <Logo />
          <span className="sr-only">{APP_NAME}</span>
        </Link>
        {NAV_ITEMS_MAIN.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={`transition-colors hover:text-foreground ${
              pathname === item.href
                ? "text-foreground font-semibold"
                : "text-muted-foreground"
            }`}
            prefetch={false}
          >
            {item.title}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu de navegação</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="bg-sidebar text-sidebar-foreground">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold mb-4"
              prefetch={false}
            >
              <Logo />
              <span className="sr-only">{APP_NAME}</span>
            </Link>
            {NAV_ITEMS_MAIN.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-sidebar-accent-foreground hover:bg-sidebar-accent ${
                  pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                }`}
                prefetch={false}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
            <DropdownMenuSeparator className="bg-sidebar-border my-2" />
             {NAV_ITEMS_USER.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                 className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-sidebar-accent-foreground hover:bg-sidebar-accent ${
                  pathname === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground"
                }`}
                prefetch={false}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar produtos..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
          {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span className="sr-only">Alternar tema</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Abrir menu do usuário</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem>Suporte</DropdownMenuItem>
            <DropdownMenuSeparator />
             {NAV_ITEMS_USER.find(item => item.title === "Sair") && (
                <Link href={NAV_ITEMS_USER.find(item => item.title === "Sair")!.href} passHref>
                    <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </DropdownMenuItem>
                </Link>
             )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
