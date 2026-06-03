"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SearchBar({
  defaultValue = "",
  size = "lg",
  className,
  autoFocus,
  onSearch,
  placeholder = "Rechercher un mémoire, une thèse, un auteur, un mot-clé…",
}: {
  defaultValue?: string;
  size?: "lg" | "md";
  className?: string;
  autoFocus?: boolean;
  onSearch?: (value: string) => void;
  placeholder?: string;
}) {
  const router = useRouter();
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    } else {
      router.push(`/explorer${value ? `?q=${encodeURIComponent(value)}` : ""}`);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center gap-2 rounded-xl border border-border bg-card shadow-sm transition-colors focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20",
        size === "lg" ? "p-2" : "p-1.5",
        className
      )}
      role="search"
    >
      <Search
        className={cn(
          "ml-2 shrink-0 text-muted-foreground",
          size === "lg" ? "size-5" : "size-4"
        )}
      />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Rechercher dans le répertoire"
        className={cn(
          "flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground",
          size === "lg" ? "h-9 text-[15px]" : "h-8 text-sm"
        )}
      />
      <Button type="submit" size={size === "lg" ? "lg" : "default"}>
        Rechercher
      </Button>
    </form>
  );
}
