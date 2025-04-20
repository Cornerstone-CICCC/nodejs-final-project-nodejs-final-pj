import useStore from "@/stores/useUserStore";
import { useState, useCallback } from "react";

const useSavePushToken = () => {
  const [tokenLoading, setTokenLoading] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const userId = useStore((state) => state.user?.id);

  const saveToken = useCallback(
    async (token: string) => {
      setTokenLoading(true);
      setTokenError(null);

      try {
        const response = await fetch("/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "registerToken",
            userId: userId || "12345",
            token,
            device: "web",
          }),
        });

        if (!response.ok) {
          setTokenError("Failed to save token. Please try again.");
          return;
        }

        const data = await response.json();
        return data;
      } catch (err) {
        console.error(err);
        setTokenError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setTokenLoading(false);
      }
    },
    [userId]
  );

  return { saveToken, tokenLoading, tokenError };
};

export default useSavePushToken;
