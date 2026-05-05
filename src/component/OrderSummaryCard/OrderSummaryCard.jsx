import React from "react";
import { useCart } from "react-use-cart";

const OrderSummaryCard = ({
  currency = "৳",
  shippingCost = 0,
  discountAmount = 0,
  total,
}) => {
  const { items, updateItemQuantity, removeItem, cartTotal } = useCart();

  // localStorage sync helper
  const syncToStorage = (updatedItems) => {
    localStorage.setItem("codProducts", JSON.stringify(updatedItems));
  };

  const handleInc = (item) => {
    const newQty = item.quantity + 1;
    updateItemQuantity(item.id, newQty); // ✅ react-use-cart update

    const stored = JSON.parse(localStorage.getItem("codProducts")) || [];
    const updated = stored.map(p =>
      p.id === item.id ? { ...p, quantity: newQty } : p
    );
    syncToStorage(updated);
  };

  const handleDec = (item) => {
    if (item.quantity <= 1) return;
    const newQty = item.quantity - 1;
    updateItemQuantity(item.id, newQty); // ✅ react-use-cart update

    const stored = JSON.parse(localStorage.getItem("codProducts")) || [];
    const updated = stored.map(p =>
      p.id === item.id ? { ...p, quantity: newQty } : p
    );
    syncToStorage(updated);
  };

  const handleRemove = (item) => {
    removeItem(item.id); // ✅ react-use-cart remove

    const stored = JSON.parse(localStorage.getItem("codProducts")) || [];
    const updated = stored.filter(p => p.id !== item.id);
    syncToStorage(updated);
  };

  const finalTotal = total ?? (cartTotal + shippingCost - discountAmount);

  return (
    <div className="bg-white p-4 rounded-lg shadow h-fit sticky top-4">
      <h2 className="font-bold text-lg mb-4">🧾 Order Summary</h2>

      {/* Items — সরাসরি react-use-cart থেকে */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {items.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">কোনো পণ্য নেই</p>
        )}
        {items.map((item, i) => (
          <div key={item.id} className="flex gap-3 border rounded-lg p-2 hover:shadow-sm transition">
            <img src={item.image} className="w-14 h-14 object-cover rounded" alt={item.title} />
            <div className="flex-1">
              <h4 className="text-sm font-semibold line-clamp-2">{item.title}</h4>
              <p className="text-xs text-gray-500">{currency}{item.price}</p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => handleDec(item)}
                  className="px-2 border rounded text-gray-600 hover:bg-gray-100"
                >-</button>
                <span className="text-sm">{item.quantity}</span>
                <button
                  onClick={() => handleInc(item)}
                  className="px-2 border rounded text-gray-600 hover:bg-gray-100"
                >+</button>
              </div>
            </div>
            <button
              onClick={() => handleRemove(item)}
              className="text-red-400 hover:text-red-600 text-sm self-start"
            >✕</button>
          </div>
        ))}
      </div>

      {/* Price breakdown — cod.js থেকে আসা real data */}
      <div className="border-t mt-4 pt-3 space-y-1 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>সাব টোটাল</span>
          <span>{currency}{cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>ডেলিভারি চার্জ</span>
          <span>{currency}{shippingCost.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-orange-500">
            <span>ডিসকাউন্ট</span>
            <span>- {currency}{discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base border-t pt-2 mt-1">
          <span>সর্বমোট</span>
          <span>{currency}{parseFloat(finalTotal).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryCard;