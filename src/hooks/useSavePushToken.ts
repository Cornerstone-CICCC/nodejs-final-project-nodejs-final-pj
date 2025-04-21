import { useState, useCallback } from "react";

const useSavePushToken = () => {
  const [tokenLoading, setTokenLoading] = useState<boolean>(false);

  const saveToken = useCallback(
    async (token: string, userId: string) => {
      setTokenLoading(true);

      try {
        const response = await fetch("/api/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "registerToken",
            userId: userId,
            token,
            device: "web",
          }),
        });

        if (!response.ok) {
          return { success: false };
        }

        const data = await response.json();
        return data;
      } catch (err) {
        console.error(err);
        return { success: false };
      } finally {
        setTokenLoading(false);
      }
    },
    []
  );

  return { saveToken, tokenLoading };
};

export default useSavePushToken;
