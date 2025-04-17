// import useUserStore from "@/stores/useUserStore";
import { useState } from "react";

interface SaveTokenResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

const useSavePushToken = () => {
  // const { user } = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);

  const saveToken = async (token: string): Promise<SaveTokenResponse> => {
    setLoading(true);

    try {
      // if (!user) {
      //   setLoading(false);
      //   return { success: false };
      // }

      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "registerToken", userId: "test", token, device: "web" }),
      });

      if (!response.ok) {
        console.log("Response from server:", response);
        const errorMessage = `Error: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      console.error("Error saving token:", err);
      setLoading(false);
      return { success: false };
    }
  };

  return { saveToken, loading };
};

export default useSavePushToken;
