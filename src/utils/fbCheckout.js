// utils/fbCheckout.js
import { trackEvent } from "@utils/trackEvent";

const mapCartToPayload = (cart = [], total = 0) => {
  const items = cart.map((i) => ({
    id: i?._id || i?.id || "unknown",
    name: i?.title || i?.name || "Product",
    quantity: i?.quantity || 1,
    item_price: i?.price || i?.item_price || 0,
    price: i?.price || i?.item_price || 0,
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

export const initiateCheckout = async (cartData, user) => {
  const payload = mapCartToPayload(cartData?.cart, cartData?.total);
  const eventId = "initcheckout_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      value: payload.value,
      currency: payload.currency,
      content_ids: payload.content_ids,
      content_type: payload.content_type,
      contents: payload.contents,
      num_items: payload.items.length,
    }, { eventID: eventId });
  }

  await trackEvent("InitiateCheckout", {
    ...payload,
    email: user?.email || "",
    phone: user?.phone || "",
    event_id: eventId,
    event_source_url: typeof window !== "undefined" ? window.location.href : "",
  });
};

// ✅ COD order place হলে Lead fire — browser pixel এ Lead track
export const lead = async (orderResponse, user) => {
  const cart = orderResponse?.cart || [];
  const total = orderResponse?.total || 0;
  const payload = mapCartToPayload(cart, total);
  const eventId = "lead_" + (orderResponse?._id || Date.now());

  // Browser pixel এ Lead
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead", {
      value: payload.value,
      currency: payload.currency,
      content_ids: payload.content_ids,
      content_type: payload.content_type,
      contents: payload.contents,
    }, { eventID: eventId });
  }

  // Server CAPI তে Lead (GA4 + FB)
  await trackEvent("Lead", {
    ...payload,
    email: user?.email || "",
    phone: user?.phone || user?.contact || "",
    firstName: user?.firstName || user?.name || "",
    lastName: user?.lastName || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    country: user?.country || "",
    address: user?.address || "",
    event_id: eventId,
    order_id: orderResponse?._id || "",
   event_source_url: user?.event_source_url || (typeof window !== "undefined" ? window.location.href : "https://www.mahabubmart.com"),
  });
};

// ✅ Card/Online payment এ Purchase fire — COD এ কখনো call করবে না
export const purchase = async (orderResponse, user) => {
  const cart = orderResponse?.cart || [];
  const total = orderResponse?.total || 0;
  const payload = mapCartToPayload(cart, total);
  const eventId = "purchase_" + (orderResponse?._id || Date.now()) + "_" + Math.floor(Math.random() * 1000);

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", {
      value: payload.value,
      currency: payload.currency,
      content_ids: payload.content_ids,
      content_type: payload.content_type,
      contents: payload.contents,
    }, { eventID: eventId });
  }

  await trackEvent("Purchase", {
    ...payload,
    email: user?.email || "",
    phone: user?.phone || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    country: user?.country || "",
    address: user?.address || "",
    event_id: eventId,
    order_id: orderResponse?._id || "",
    event_source_url: typeof window !== "undefined" ? window.location.href : "",
  });
};