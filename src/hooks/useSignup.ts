import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/stores/useUserStore";

type SignupValue = {
  email: string;
  password: string;
}

export const useSignup = () => {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const signup = async (data: SignupValue) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Failed to create account");
      }

      // Save user to zustand store
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
    signup,
    loading,
    error,
    setError
  };
}