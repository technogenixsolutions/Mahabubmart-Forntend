import dynamic from "next/dynamic";
import { useEffect, useState, useCallback } from "react";
import { useCart } from "react-use-cart";
import Cookies from "js-cookie";

// internal import
import Stock from "@component/common/Stock";
import { notifyError } from "@utils/toast";
import useAddToCart from "@hooks/useAddToCart";
import Discount from "@component/common/Discount";
import useUtilsFunction from "@hooks/useUtilsFunction";
import useGetSetting from "@hooks/useGetSetting";
import { trackEvent } from "@utils/trackEvent";
import { useRouter } from "next/router";

const LOGO_PLACEHOLDER =
  "https://res.cloudinary.com/dgwwhniph/image/upload/v1773462761/product/MahabubMart.png";

// ─── Variant Modal ────────────────────────────────────────────────────────────
const VariantModal = ({
  product,
  attributes,
  currency,
  showingTranslateValue,
  getNumber,
  onClose,
  onConfirm,
  cartItems,
}) => {
  const [qty, setQty] = useState(1);
  const [selectVariant, setSelectVariant] = useState({});

  // ── variant এ কোন keys আছে (attribute id গুলো) ──
  const allVariantKeys =
    product?.variants?.length > 0
      ? Object.keys(Object.assign({}, ...product.variants))
      : [];

  const skipKeys = new Set([
    "originalPrice", "price", "discount", "quantity",
    "inUse", "inUseOrder", "barcode", "sku", "productId", "image", "_id",
  ]);

  const attrKeyIds = allVariantKeys.filter((k) => !skipKeys.has(k));
  const relevantAttrs = attributes?.filter((a) => attrKeyIds.includes(a._id)) || [];

  // ── Variant type detect ──────────────────────────────────────────────────
  // Combined: একটা variant এ একাধিক attrKey (যেমন {color:"red", size:"M"})
  // Separate: প্রতিটা variant এ শুধু একটাই attrKey (যেমন {color:"red"} বা {size:"M"})
  const isCombined =
    attrKeyIds.length > 0 &&
    product.variants.some((v) => attrKeyIds.filter((k) => v[k]).length > 1);

  // ── Available values per attribute ──────────────────────────────────────
  const getAvailableValues = useCallback(
    (targetAttrId) => {
      let matching;
      if (isCombined) {
        const otherSelected = Object.entries(selectVariant).filter(([k]) => k !== targetAttrId);
        matching = product.variants.filter((v) =>
          otherSelected.every(([k, val]) => v[k] === val)
        );
      } else {
        // Separate: শুধু এই attribute এর variants দেখো — অন্য attr এর সাথে সম্পর্ক নেই
        matching = product.variants.filter((v) => v[targetAttrId] != null);
      }
      const availableIds = new Set(
        matching.filter((v) => Number(v.quantity) > 0).map((v) => v[targetAttrId]).filter(Boolean)
      );
      const allIds = new Set(matching.map((v) => v[targetAttrId]).filter(Boolean));
      return { availableIds, allIds };
    },
    [selectVariant, product.variants, isCombined]
  );

  // ── Match variants based on type ─────────────────────────────────────────
  const combinedMatch = isCombined
    ? product.variants.find((v) =>
        attrKeyIds.every((k) => selectVariant[k] && v[k] === selectVariant[k])
      )
    : null;

  // Separate: প্রতিটা selected attr এর জন্য আলাদা করে variant খোঁজো
  const separateMatches = !isCombined
    ? attrKeyIds
        .filter((k) => selectVariant[k])
        .map((k) => product.variants.find((v) => v[k] === selectVariant[k]))
        .filter(Boolean)
    : [];

  const allSelected = attrKeyIds.every((k) => selectVariant[k]);

  // ── Price — যেকোনো একটা ref variant থেকে নাও ──
  const refVariant = isCombined
    ? (combinedMatch || product.variants[0])
    : (separateMatches[0] || product.variants[0]);

  const price = getNumber(refVariant?.price) || getNumber(product?.prices?.price) || 0;
  const originalPrice = getNumber(refVariant?.originalPrice) || price;

  // ── Stock ────────────────────────────────────────────────────────────────
  // Combined: matched variant এর quantity
  // Separate: সব selected variant এর minimum quantity (সবচেয়ে কম যেটায় সেটাই limiting)
  let stock = null;
  if (allSelected) {
    if (isCombined) {
      stock = combinedMatch ? Number(combinedMatch.quantity) : 0;
    } else {
      // সব selected attr এর variant match হলে minimum stock নাও
      const fullyMatched = separateMatches.length === attrKeyIds.length;
      stock = fullyMatched
        ? Math.min(...separateMatches.map((v) => Number(v.quantity) || 0))
        : 0;
    }
  }

  // ── Cart tracking ────────────────────────────────────────────────────────
  const effectiveVariant = isCombined ? combinedMatch : separateMatches[0];
  const matchedItemId = effectiveVariant?.productId || null;
  const existingCartItem = matchedItemId ? cartItems?.find((i) => i.id === matchedItemId) : null;
  const cartQty = existingCartItem?.quantity || 0;

  // ── Display image ────────────────────────────────────────────────────────
  const displayImg =
    effectiveVariant?.image ||
    (Array.isArray(product?.image) ? product.image[0] : product?.image) ||
    LOGO_PLACEHOLDER;

  const handleSelect = (attrId, valueId) => {
    setSelectVariant((prev) => ({ ...prev, [attrId]: valueId }));
    setQty(1);
  };

  const handleConfirm = () => {
    if (!allSelected) return notifyError("সব option select করুন!");
    if (stock !== null && stock < 1) return notifyError("Insufficient stock!");

    const { variants, categories, description, ...updatedProduct } = product;

    // ── Item ID তৈরি ──
    // Combined: matched variant এর productId
    // Separate: product._id + sorted selected value ids (unique combination)
    let itemId;
    if (isCombined && combinedMatch) {
      itemId = combinedMatch.productId || product._id;
    } else {
      const sortedIds = attrKeyIds
        .map((k) => selectVariant[k])
        .filter(Boolean)
        .sort()
        .join("_");
      itemId = `${product._id}_${sortedIds}`;
    }

    const variantLabel = relevantAttrs
      .map((att) => {
        const valId = selectVariant[att._id];
        const val = att.variants?.find((v) => v._id === valId);
        return showingTranslateValue(val?.name) || valId;
      })
      .filter(Boolean)
      .join(" / ");

    const newItem = {
      ...updatedProduct,
      id: itemId,
      title:
        showingTranslateValue(product?.title) +
        (variantLabel ? ` (${variantLabel})` : ""),
      image: displayImg,
      variant: effectiveVariant,
      price,
      originalPrice,
    };

    onConfirm(newItem, qty);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-[998] backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className="
          fixed z-[999] bg-white shadow-2xl overflow-y-auto
          bottom-0 left-0 right-0 rounded-t-3xl max-h-[92vh]
          sm:bottom-auto sm:top-1/2 sm:left-1/2
          sm:-translate-x-1/2 sm:-translate-y-1/2
          sm:rounded-2xl sm:w-[480px] sm:max-h-[85vh]
        "
        style={{ animation: "vcModalIn .28s ease-out" }}
      >
        <style>{`
          @keyframes vcModalIn {
            from { transform: translateY(60px); opacity: 0; }
            to   { transform: translateY(0); opacity: 1; }
          }
          @media (min-width: 640px) {
            @keyframes vcModalIn {
              from { transform: translate(-50%, calc(-50% + 24px)); opacity: 0; }
              to   { transform: translate(-50%, -50%); opacity: 1; }
            }
          }
        `}</style>

        {/* Handle bar — mobile only */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Close — desktop */}
        <button
          onClick={onClose}
          className="hidden sm:flex absolute top-3 right-4 w-8 h-8 items-center justify-center
            rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xl font-bold transition"
        >
          ×
        </button>

        <div className="px-4 sm:px-6 pb-8 pt-2 sm:pt-6">

          {/* Product summary */}
          <div className="flex gap-3 mb-5 items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
              <img src={displayImg} alt="product" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug mb-1">
                {showingTranslateValue(product?.title)}
              </h3>
              <div className="flex items-baseline gap-2 flex-wrap">
                {originalPrice > price && (
                  <span className="text-xs text-slate-400 line-through">{currency}{originalPrice}</span>
                )}
                <span className="text-xl font-extrabold text-[#1F6BBF]">{currency}{price}</span>
              </div>
              {allSelected && (
                <p className="text-xs mt-0.5">
                  <span className="text-slate-400">Stock: </span>
                  <span className={stock > 0 ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                    {stock > 0 ? `${stock} available` : "Out of stock"}
                  </span>
                  {cartQty > 0 && (
                    <span className="ml-2 text-blue-500 font-semibold">({cartQty} in cart)</span>
                  )}
                </p>
              )}
            </div>
          </div>

          {/* ── Variant options ── */}
          {relevantAttrs.map((att) => {
            const { availableIds, allIds } = getAvailableValues(att._id);
            const usedValueIds = new Set(
              product.variants.map((v) => v[att._id]).filter(Boolean)
            );
            const displayValues = att.variants?.filter((v) => usedValueIds.has(v._id)) || [];

            return (
              <div key={att._id} className="mb-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">
                  {showingTranslateValue(att?.name)}
                  {selectVariant[att._id] && (
                    <span className="ml-2 text-[#1F6BBF] font-normal text-xs">
                      — {showingTranslateValue(
                        att.variants?.find((v) => v._id === selectVariant[att._id])?.name
                      )}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {displayValues.map((v) => {
                    const isAvail = availableIds.has(v._id);
                    const exists = allIds.has(v._id);
                    const isSelectedVal = selectVariant[att._id] === v._id;

                    return (
                      <button
                        key={v._id}
                        disabled={!isAvail}
                        onClick={() => isAvail && handleSelect(att._id, v._id)}
                        className={`
                          px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all relative
                          ${isSelectedVal
                            ? "border-[#1F6BBF] bg-[#1F6BBF] text-white shadow"
                            : isAvail
                            ? "border-gray-200 text-slate-700 hover:border-[#1F6BBF] hover:text-[#1F6BBF] bg-white"
                            : "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                          }
                        `}
                      >
                        {showingTranslateValue(v?.name)}
                        {!isAvail && exists && (
                          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="w-full border-t border-gray-300 absolute" style={{ top: "50%" }} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ── Quantity ── */}
          <div className="flex items-center gap-4 mb-5">
            <p className="text-sm font-semibold text-slate-700">Quantity</p>
            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-slate-600 text-xl font-bold
                  hover:bg-gray-100 transition border-r border-gray-300"
              >−</button>
              <span className="w-12 text-center text-sm font-bold text-slate-800">{qty}</span>
              <button
                onClick={() =>
                  setQty((q) => (stock ? Math.min(Math.max(0, stock - cartQty), q + 1) : q + 1))
                }
                className="w-10 h-10 flex items-center justify-center text-slate-600 text-xl font-bold
                  hover:bg-gray-100 transition border-l border-gray-300"
              >+</button>
            </div>
            {allSelected && stock > 0 && (
              <span className="text-xs text-slate-400">max {Math.max(0, stock - cartQty)} more</span>
            )}
          </div>

          {/* ── Confirm button ── */}
          <button
            onClick={handleConfirm}
            disabled={!allSelected || stock < 1}
            className={`
              w-full py-3.5 rounded-2xl text-base font-bold text-white tracking-wide transition-all active:scale-95
              ${!allSelected
                ? "bg-gray-300 cursor-not-allowed"
                : stock < 1
                ? "bg-red-300 cursor-not-allowed"
                : "bg-gradient-to-r from-[#1F6BBF] to-[#00a4db] shadow-lg hover:shadow-xl"
              }
            `}
          >
            {!allSelected
              ? "Select all options to continue"
              : stock < 1
              ? "Out of Stock"
              : cartQty > 0
              ? `Add ${qty} More — ${currency}${price * qty}`
              : `Add to Cart — ${currency}${price * qty}`}
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Main ProductCard ─────────────────────────────────────────────────────────
const ProductCard = ({ product, attributes }) => {
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [imgError, setImgError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);

  const { items, addItem, updateItemQuantity, inCart } = useCart();
  const { handleIncreaseQuantity } = useAddToCart();
  const { globalSetting } = useGetSetting();
  const { showingTranslateValue, getNumber } = useUtilsFunction();
  const router = useRouter();

  const currency = globalSetting?.default_currency || "$";

  useEffect(() => {
    if (Cookies.get("userInfo")) {
      try {
        const user = JSON.parse(Cookies.get("userInfo"));
        setEmail(user.email);
        setPhone(user.phone);
      } catch (e) {}
    }
  }, []);

  const images =
    typeof product?.image === "string"
      ? product.image.split(",").map((img) => img.trim()).filter(Boolean)
      : Array.isArray(product?.image)
      ? product.image.filter(Boolean)
      : [];

  const image1 = images[0] || null;
  const image2 = images[1] || null;
  const hasSecondImage = Boolean(image2);
  const hasVariants = product?.isCombination && product?.variants?.length > 0;

  // ── Variant cart items — productId match অথবা product._id prefix দিয়ে ──
  const variantCartItems = hasVariants
    ? items.filter(
        (i) =>
          i.id?.startsWith(product._id) ||
          product.variants.some((v) => v.productId && v.productId === i.id)
      )
    : [];

  const totalVariantQtyInCart = variantCartItems.reduce(
    (sum, i) => sum + (i.quantity || 0),
    0
  );

  const cartItem = !hasVariants ? items.find((i) => i.id === product._id) : null;
  const isInCart = hasVariants ? totalVariantQtyInCart > 0 : inCart(product._id);
  const outOfStock = !product.stock || product.stock < 1;

  const handleNavigate = () => {
    router.push(`/product/${product.slug}`);
  };

  const fireTracking = (newItem, qty = 1) => {
    const eventId = "addtocart_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq(
        "track",
        "AddToCart",
        {
          value: newItem.price, currency: "BDT",
          content_ids: [newItem.id], content_type: "product",
          contents: [{ id: newItem.id, quantity: qty, item_price: newItem.price }],
          content_name: newItem.title,
        },
        { eventID: eventId }
      );
    }
    trackEvent("AddToCart", {
      value: newItem.price, currency: "BDT",
      email: email || "", phone: phone || "",
      event_id: eventId,
      event_source_url: typeof window !== "undefined" ? window.location.href : "",
      items: [{ id: newItem.id, name: newItem.title, quantity: qty, item_price: newItem.price, price: newItem.price }],
      content_ids: [newItem.id], content_type: "product",
    });
  };

  // ── No variant: direct add ──
  const handleDirectAdd = () => {
    const prices = product.prices || {};
    const itemPrice = Number(prices?.price) || 0;
    if (!itemPrice) return notifyError("Product price not found!");
    if ((product.stock ?? 0) < 1) return notifyError("Insufficient stock!");
    const { slug, variants, categories, description, ...updatedProduct } = product;
    const newItem = {
      ...updatedProduct,
      title: showingTranslateValue(product?.title),
      id: product._id,
      variant: prices,
      price: itemPrice,
      originalPrice: Number(prices?.originalPrice) || itemPrice,
      image: images[0] || "",
    };
    addItem(newItem);
    fireTracking(newItem, 1);
  };

  // ── Modal confirm ──
  const handleModalConfirm = (newItem, qty) => {
    const alreadyInCart = items.find((i) => i.id === newItem.id);
    if (alreadyInCart) {
      updateItemQuantity(newItem.id, alreadyInCart.quantity + qty);
    } else {
      addItem(newItem, qty);
    }
    fireTracking(newItem, qty);
  };

  const showPrice = product?.isCombination
    ? Number(product?.variants?.[0]?.price)
    : product?.prices?.price;

  const showOriginalPrice = product?.isCombination
    ? Number(product?.variants?.[0]?.originalPrice)
    : product?.prices?.originalPrice;

  const displayImage =
    imgError || !image1
      ? LOGO_PLACEHOLDER
      : isHovered && hasSecondImage
      ? image2
      : image1;

  return (
    <>
      <div
        className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image */}
        <div
          onClick={handleNavigate}
          className="relative w-full aspect-square bg-gray-100 overflow-hidden cursor-pointer flex items-center justify-center"
        >
          <div className="absolute top-0 left-0 z-10 w-full">
            <Stock product={product} stock={product.stock} card />
            <Discount product={product} />
          </div>
       
          <img
            src={displayImage}
            alt={showingTranslateValue(product?.title) || "product"}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Body */}
        <div className="flex flex-col px-3 pt-2 pb-3 flex-1">
          {product.unit && (
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
              {product.unit}
            </span>
          )}
          <h2
            onClick={handleNavigate}
            className="text-sm font-bold text-slate-700 leading-snug mb-1
              line-clamp-2 cursor-pointer hover:text-[#1F6BBF] transition-colors duration-200 overflow-hidden"
          >
            {showingTranslateValue(product?.title)}
          </h2>
          <div className="flex items-baseline gap-1.5 mb-2">
            {showOriginalPrice && showOriginalPrice > showPrice && (
              <span className="text-[11px] font-semibold text-slate-400 line-through">
                {currency}{showOriginalPrice}
              </span>
            )}
            <span className="text-lg font-extrabold text-[#1F6BBF] tracking-tight">
              {currency}{showPrice}
            </span>
          </div>

          {isInCart ? (
            hasVariants ? (
              <div className="flex items-center justify-between w-full bg-gradient-to-r from-[#1F6BBF] to-[#00a4db] rounded-xl px-4 py-2">
                <button
                  onClick={() => {
                    const lastItem = variantCartItems[variantCartItems.length - 1];
                    if (lastItem) updateItemQuantity(lastItem.id, lastItem.quantity - 1);
                  }}
                  className="text-white text-xl leading-none font-bold"
                >−</button>
                <span
                  className="text-white text-sm font-bold cursor-pointer"
                  onClick={() => setShowVariantModal(true)}
                >
                  {totalVariantQtyInCart} in cart
                </span>
                <button
                  onClick={() => setShowVariantModal(true)}
                  className="text-white text-xl leading-none font-bold"
                >+</button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full bg-gradient-to-r from-[#1F6BBF] to-[#00a4db] rounded-xl px-4 py-2">
                <button
                  onClick={() => updateItemQuantity(cartItem.id, cartItem.quantity - 1)}
                  className="text-white text-xl leading-none font-bold"
                >−</button>
                <span className="text-white text-sm font-bold">{cartItem.quantity}</span>
                <button
                  onClick={() => handleIncreaseQuantity(cartItem)}
                  className="text-white text-xl leading-none font-bold"
                >+</button>
              </div>
            )
          ) : (
            <button
              disabled={outOfStock}
              onClick={() => {
                if (outOfStock) return;
                hasVariants ? setShowVariantModal(true) : handleDirectAdd();
              }}
              className={`w-full py-2 rounded-xl text-sm font-bold text-white tracking-wide
                transition-all duration-200 active:scale-95
                ${outOfStock
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#1F6BBF] to-[#00a4db] shadow-md hover:shadow-lg hover:opacity-90"
                }`}
            >
              {outOfStock ? "Out of Stock" : hasVariants ? "Select Options" : "Order Now"}
            </button>
          )}
        </div>
      </div>

      {showVariantModal && (
        <VariantModal
          product={product}
          attributes={attributes}
          currency={currency}
          showingTranslateValue={showingTranslateValue}
          getNumber={getNumber}
          onClose={() => setShowVariantModal(false)}
          onConfirm={handleModalConfirm}
          cartItems={items}
        />
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(ProductCard), { ssr: false });