import { NotificationSettings } from "@/types/notificationSettings";
import { useState, useEffect, useCallback } from "react";
import useStore from "@/stores/useUserStore";

const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const userId = useStore((state) => state.user?.id) || "12345";

  // Fetch notification settings
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/notification-settings/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch settings. Please try again.");
      }

      const data = await response.json();
      setSettings(data.settings);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update notification settings
  const updateSettings = useCallback(
    async (updates: NotificationSettings) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/notification-settings/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          throw new Error("Failed to update settings. Please try again.");
        }

        const data = await response.json();
        setSettings(data.settings);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  // Initial fetch
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings,
  };
};

export default useNotificationSettings;
