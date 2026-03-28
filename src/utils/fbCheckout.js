// utils/fbCheckout.js
import { trackEvent } from "@utils/trackEvent";

// ✅ Cart items থেকে FB + GA4 compatible payload বানাও
const mapCartToPayload = (cart = [], total = 0) => {
  const items = cart.map((i) => ({
    id: i?._id || i?.id || "unknown",
    name: i?.title || i?.name || "Product",
    quantity: i?.quantity || 1,
    item_price: i?.price || i?.item_price || 0,
    price: i?.price || i?.item_price || 0, // GA4 এর জন্য
  }));

  return {
    value: total,
    currency: "BDT",
    content_ids: items.map((i) => i.id),
    content_type: "product",
    items,
    contents: items.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      item_price: i.item_price,
    })),
  };
};

// ✅ InitiateCheckout
export const initiateCheckout = async (cartData, user) => {
  const payload = mapCartToPayload(cartData?.cart, cartData?.total);
  const eventId = "initcheckout_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

  // 🔹 Browser Pixel
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(
      "track",
      "InitiateCheckout",
      {
        value: payload.value,
        currency: payload.currency,
        content_ids: payload.content_ids,
        content_type: payload.content_type,
        contents: payload.contents,
        num_items: payload.items.length,
      },
      { eventID: eventId }
    );
  }

  // 🔹 Server CAPI + GA4
  await trackEvent("InitiateCheckout", {
    ...payload,
    email: user?.email || "",
    phone: user?.phone || "",
    event_id: eventId,
    event_source_url: typeof window !== "undefined" ? window.location.href : "",
  });
};

// ✅ Purchase — order response থেকে cart নাও
export const purchase = async (orderResponse, user) => {
  // orderResponse এ cart array আছে (OrderServices.addOrder এর response)
  const cart = orderResponse?.cart || [];
  const total = orderResponse?.total || orderResponse?.subTotal || 0;

  const payload = mapCartToPayload(cart, total);
  const eventId = "purchase_" + (orderResponse?._id || Date.now()) + "_" + Math.floor(Math.random() * 1000);

  // 🔹 Browser Pixel
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(
      "track",
      "Purchase",
      {
        value: payload.value,
        currency: payload.currency,
        content_ids: payload.content_ids,
        content_type: payload.content_type,
        contents: payload.contents,
      },
      { eventID: eventId }
    );
  }

  // 🔹 Server CAPI + GA4
  await trackEvent("Purchase", {
    ...payload,
    email: user?.email || "",
    phone: user?.phone || "",
    event_id: eventId,
    order_id: orderResponse?._id || "",
    event_source_url: typeof window !== "undefined" ? window.location.href : "",
  });
};