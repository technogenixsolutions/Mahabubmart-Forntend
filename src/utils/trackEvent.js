export const trackEvent = async (event, data) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data }),
    });
  } catch (err) {
    console.error("Tracking error:", err);
  }
};