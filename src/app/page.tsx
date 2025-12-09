
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth-context";

/**
 * Reindirizza la root dell'app verso schedule o login in base allo stato di autenticazione.
 */
export default function RootRedirectPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    router.replace(isAuthenticated ? "/schedule" : "/login");
  }, [isAuthenticated, router]);

  return null;
}
