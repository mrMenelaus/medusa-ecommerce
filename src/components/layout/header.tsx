import Link from "next/link";
import { Search, ShoppingCart, User, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Cart } from "../cart/cart";

const nav = [
  { label: "Shop", href: "/" },
  { label: "New Arrivals", href: "/new" },
  { label: "Sale", href: "/sale" },
  { label: "Collections", href: "/collections" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-primary hover:opacity-80 transition-opacity"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            VIPERR
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {nav.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:flex h-10 w-10 text-foreground hover:text-primary"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Cart />

            <Button
              size="icon"
              variant="ghost"
              className="hidden sm:flex h-10 w-10 text-foreground hover:text-primary"
            >
              <User className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="md:hidden h-10 w-10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t border-border/40 bg-white/95">
        <nav className="container mx-auto px-4 py-3 flex items-center justify-center gap-4 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative",
        "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary",
        "after:transition-all after:duration-300 hover:after:w-full"
      )}
    >
      {label}
    </Link>
  );
}
