// utils/trackEvent.js

export const trackEvent = async (event, data) => {
  try {
    // ✅ event_source_url সবসময় full URL পাঠাও
    const enrichedData = {
      ...data,
      event_source_url:
        data.event_source_url ||
        (typeof window !== "undefined" ? window.location.href : "https://www.mahabubmart.com"),
    };

    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, data: enrichedData }),
    });
  } catch (err) {
    console.error("Tracking error:", err);
  }
};