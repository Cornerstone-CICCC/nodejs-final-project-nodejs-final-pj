// src/hooks/useLogin.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/stores/useUserStore";

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export function useLogin() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (data: LoginCredentials) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Failed to log in");
      }

      // Set the user in zustand store
      setUser(responseData.user);

      router.push("/chat/list");
      return true;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
    setError,
  };
}