"use client"
import { useAuth } from "@/hooks/auth-context";
import { LoginForm } from "./components/login-form";
import LoginWrapper from "./components/login-form-wrapper";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const {isAuthenticated} = useAuth();  
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);
  return (

    <LoginWrapper>
      <LoginForm />
    </LoginWrapper>
  )
}