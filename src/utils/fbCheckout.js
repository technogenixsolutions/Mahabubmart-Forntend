// utils/fbCheckout.js
import { trackEvent } from "@utils/trackEvent";

// 🔹 Extract content_ids and items from cart
const mapCartToPayload = (cart, total = 0) => {
  const items = cart?.map((i) => ({
    id: i?._id || i._id,
    name: i?.name || i?.title || "Product",
    quantity: i?.quantity || 1,
    item_price: i.price || 0,
  }));

  return {
    value: total,
    currency: "BDT",
    content_ids: items?.map((i) => i.id),
    items,
    contents: items?.map((i) => ({
      id: i.id,
      quantity: i.quantity,
      item_price: i.item_price,
    })),
    content_type: "product",
  };
};

export const initiateCheckout = async (cartData, user) => {
  const payload = mapCartToPayload(cartData.cart, cartData.total);
  const eventId = "initcheckout_" + Date.now();

  await trackEvent("InitiateCheckout", {
    ...payload,
    email: user?.email || "",
    phone: user?.phone || "",
    event_id: eventId,
    event_source_url: window.location.href,
  });
};

export const purchase = async (orderData, user) => {
  const payload = mapCartToPayload(orderData.cart, orderData.total);
  const eventId = "purchase_" + Date.now();

  await trackEvent("Purchase", {
    ...payload,
    email: user?.email || "",
    phone: user?.phone || "",
    event_id: eventId,
    event_source_url: window.location.href,
  });
};