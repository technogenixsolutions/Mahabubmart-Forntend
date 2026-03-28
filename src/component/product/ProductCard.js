import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
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
// Replace with your actual logo path e.g. "/logo.png"
const LOGO_PLACEHOLDER ="https://res.cloudinary.com/dgwwhniph/image/upload/v1773462761/product/MahabubMart.png";

const ProductCard = ({ product, attributes }) => {
 
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [img1Loaded, setImg1Loaded] = useState(false);
const [isNavigating, setIsNavigating] = useState(false);
  const { items, addItem, updateItemQuantity, inCart } = useCart();
  const { handleIncreaseQuantity } = useAddToCart();
  const { globalSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
   const router = useRouter();

  const currency = globalSetting?.default_currency || "$";

  useEffect(() => {
    if (Cookies.get("userInfo")) {
      const user = JSON.parse(Cookies.get("userInfo"));
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, []);


  const images = typeof product?.image === "string" ? product.image.split(",").map(img => img.trim()) : product?.image || [];

const image1 = images[0] || null;
const image2 = images[1] || null;
const hasSecondImage = Boolean(image2);
  

const handleMoreInfo = (slug) => {
   if (isNavigating) return;   // 🔥 prevent multiple push
  setIsNavigating(true);
  router.push(`/product/${slug}`);
};


const handleAddItem = (p) => {
  if (p.stock < 1) return notifyError("Insufficient stock!");
  if (p?.variants?.length > 0) {
    setModalOpen(true);
    return;
  }
 
  const { slug, variants, categories, description, ...updatedProduct } = product;

    // ✅ image সঠিকভাবে নাও
  const productImages = typeof product?.image === "string"
    ? product.image.split(",").map(img => img.trim())
    : product?.image || []; 


  const newItem = {
    ...updatedProduct,
    title: showingTranslateValue(p?.title),
    id: p._id,
    variant: p.prices,
    price: p.prices.price,
    originalPrice: product.prices?.originalPrice,
    image: productImages[0] || "",
  };
 
  addItem(newItem);
 
  const eventId ="addtocart_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
 
  // 🔹 Browser Pixel
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(
      "track",
      "AddToCart",
      {
        value: newItem.price,
        currency: "BDT",
        content_ids: [newItem.id],
        content_type: "product",
        contents: [{ id: newItem.id, quantity: 1, item_price: newItem.price }],
        content_name: newItem.title,
      },
      { eventID: eventId }
    );
  }
 
  // 🔹 Server CAPI + GA4
  // ✅ items array পাঠাও — product object না
  trackEvent("AddToCart", {
    value: newItem.price,
    currency: "BDT",
    email: email || "",
    phone: phone || "",
    event_id: eventId,
    event_source_url: window.location.href,
    items: [
      {
        id: newItem.id,
        name: newItem.title,
        quantity: 1,
        item_price: newItem.price,
        price: newItem.price,
      },
    ],
    content_ids: [newItem.id],
    content_type: "product",
  });
};

  const cartItem = items.find((i) => i.id === product._id);
  const isInCart  = inCart(product._id);
  const outOfStock = product.stock < 1;

  const showPrice = product?.isCombination
    ? product?.variants?.[0]?.price
    : product?.prices?.price;

  const showOriginalPrice = product?.isCombination
    ? product?.variants?.[0]?.originalPrice
    : product?.prices?.originalPrice;

  return (
    <>
     

      {/* Card wrapper */}
      <div  onClick={() => handleMoreInfo(product.slug)} className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">

        {/* ── Image area ── */}
        <div
          className="relative w-full aspect-square bg-gray-50 overflow-hidden cursor-pointer"
          
        >
          {/* Badges */}
          <div >
            <Stock product={product} stock={product.stock} card />
            <Discount product={product} />
          </div>

          
 {/* Placeholder (FULL COVER) */}
  <div
    className={`absolute inset-0 z-[1] transition-opacity duration-300 ${
      img1Loaded ? "opacity-0 pointer-events-none" : "opacity-100"
    }`}
  >
    <img
      src={LOGO_PLACEHOLDER}
      alt="loading"
      className="w-full h-full object-contain opacity-40"
    />
  </div>

  {/* Primary Image */}
  {image1 && (
    <img
      src={image1}
      alt={showingTranslateValue(product?.title)}
      onLoad={() => setImg1Loaded(true)}
      onError={() => setImg1Loaded(true)}
      className={`absolute inset-0 w-full h-full object-contain z-[2]
        transition-all duration-500
        ${img1Loaded ? "opacity-100" : "opacity-0"}
        ${
          hasSecondImage
            ? "group-hover:opacity-0 group-hover:scale-105"
            : "group-hover:scale-105"
        }`}
    />
  )}

  {/* Secondary Image */}
  {hasSecondImage && img1Loaded && (
    <img
      src={image2}
      alt="view 2"
      className=" inset-0 w-full h-full object-contain z-[3]
        opacity-0 scale-105
        group-hover:opacity-100 group-hover:scale-100
        transition-all duration-500"
    />
  )}

        </div>

        {/* ── Body ── */}
        <div className="flex flex-col px-3 pt-2 pb-3 flex-1">

          {/* Unit */}
          {product.unit && (
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">
              {product.unit}
            </span>
          )}

          {/* Title */}
 {/* Title */}
<h2
  className="
    text-sm font-bold text-slate-700 leading-snug mb-1
    line-clamp-2
    hover:line-clamp-none
    transition-all duration-300
    overflow-hidden
    text-ellipsis
  "
>
  {showingTranslateValue(product?.title)}
</h2>

          {/* Price */}
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

          {/* ── Cart control — always full width ── */}
          {isInCart && cartItem ? (
            /* Stepper */
            <div className="flex items-center justify-between w-full bg-gradient-to-r from-[#1F6BBF] to-[#00a4db] rounded-xl px-4 py-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateItemQuantity(cartItem.id, cartItem.quantity - 1);
                }}
                className="text-white text-xl leading-none font-bold"
                aria-label="Decrease"
              >
                −
              </button>
              <span className="text-white text-sm font-bold">{cartItem.quantity}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cartItem?.variants?.length > 0
                    ? handleAddItem(cartItem)
                    : handleIncreaseQuantity(cartItem);
                }}
                className="text-white text-xl leading-none font-bold"
                aria-label="Increase"
              >
                +
              </button>
            </div>
          ) : (
            /* Order Now */
            <button
              disabled={outOfStock}
              onClick={(e) => {
                e.stopPropagation();
                handleAddItem(product);
              }}
              className={`w-full py-2 rounded-xl text-sm font-bold text-white tracking-wide
                transition-all duration-200 active:scale-95
                ${outOfStock
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#1F6BBF] to-[#00a4db] shadow-md hover:shadow-lg hover:opacity-90"
                }`}
            >
              {outOfStock ? "Out of Stock" : "Order Now"}
            </button>
          )}

        </div>
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(ProductCard), { ssr: false });