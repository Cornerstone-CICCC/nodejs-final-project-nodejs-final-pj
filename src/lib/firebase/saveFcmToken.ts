const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const saveFcmToken = async (token: string, userId: string) => {
  try {
    const url = `${BASE_URL}/api/notifications`;

    const response = await fetch(url, {
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
      return false;
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
