import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "react-use-cart";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

// internal
import useAsync from "@hooks/useAsync";
import { UserContext } from "@context/UserContext";
import OrderServices from "@services/OrderServices";
import CouponServices from "@services/CouponServices";
import SettingServices from "@services/SettingServices";
import { notifyError, notifySuccess } from "@utils/toast";

const useCheckoutSubmit = () => {
  const {
    state: { userInfo, shippingAddress },
    dispatch,
  } = useContext(UserContext);

  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const couponRef = useRef("");
  const { items, cartTotal, emptyCart, isEmpty } = useCart();

  const [shippingCost, setShippingCost] = useState(0);
  const [couponInfo, setCouponInfo] = useState({});
  const [minimumAmount, setMinimumAmount] = useState(0);
  const [discountType, setDiscountType] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  const [error, setError] = useState("");
  const [showCard, setShowCard] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const { data: coupons } = useAsync(CouponServices.getAllCoupons);
  const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);
  const currency = globalSetting?.default_currency || "৳";

  /* ---------------- Restore Coupon from Cookie ---------------- */
  useEffect(() => {
    const stored = Cookies.get("couponInfo");
    if (stored) {
      const coupon = JSON.parse(stored);
      setCouponInfo(coupon);
      setMinimumAmount(coupon.minimumAmount);
      setDiscountType(coupon.discountType);
    }
  }, []);

  /* ---------------- Auto Coupon Validation ---------------- */
  useEffect(() => {
    if (!couponInfo?.couponCode) return;

    const baseTotal = cartTotal + shippingCost;

    if (baseTotal < minimumAmount) {
      removeCoupon(true);
      notifyError(
        `Minimum ${minimumAmount} টাকা না হওয়ায় কুপনটি স্বয়ংক্রিয়ভাবে বাতিল হয়েছে`
      );
    }
  }, [shippingCost, cartTotal]);

  /* ---------------- Calculate Total ---------------- */
  useEffect(() => {
    const baseTotal = cartTotal + shippingCost;

    let discount = 0;

    if (discountType?.type === "fixed") {
      discount = discountType.value;
    } else if (discountType?.type === "percentage") {
      discount = cartTotal * (discountType.value / 100);
    }

    if (baseTotal < minimumAmount) {
      discount = 0;
    }

    setDiscountAmount(discount);
    setTotal(baseTotal - discount);
  }, [cartTotal, shippingCost, discountType]);

  /* ---------------- Coupon Apply ---------------- */
  const handleCouponCode = (e) => {
    e.preventDefault();

    const code = couponRef.current.value;
    if (!code) return notifyError("কুপন কোড লিখুন");

    const coupon = coupons?.find((c) => c.couponCode === code);
    if (!coupon) return notifyError("ভুল কুপন কোড");

    if (dayjs().isAfter(dayjs(coupon.endTime))) {
      return notifyError("এই কুপনের মেয়াদ শেষ");
    }

    const baseTotal = cartTotal + shippingCost;

    if (baseTotal < coupon.minimumAmount) {
      return notifyError(
        `এই কুপনের জন্য কমপক্ষে ${coupon.minimumAmount} টাকা প্রয়োজন`
      );
    }

    setCouponInfo(coupon);
    setMinimumAmount(coupon.minimumAmount);
    setDiscountType(coupon.discountType);

    Cookies.set("couponInfo", JSON.stringify(coupon));
    dispatch({ type: "SAVE_COUPON", payload: coupon });

    notifySuccess(`Coupon ${coupon.couponCode} Applied`);
  };

  /* ---------------- Remove Coupon ---------------- */
  const removeCoupon = (silent = false) => {
    setCouponInfo({});
    setDiscountType(null);
    setDiscountAmount(0);
    setMinimumAmount(0);

    Cookies.remove("couponInfo");
    dispatch({ type: "SAVE_COUPON", payload: {} });

    if (couponRef.current) couponRef.current.value = "";

    if (!silent) notifySuccess("Coupon Removed");
  };

  /* ---------------- Submit Order ---------------- */
  const submitHandler = async (data) => {
    const baseTotal = cartTotal + shippingCost;

    if (couponInfo?.couponCode && baseTotal < minimumAmount) {
      notifyError("Coupon invalid. Order blocked!");
      return;
    }

    setIsCheckoutSubmit(true);
  const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
    const orderInfo = {
      user_info: { ...data, name: fullName },
      cart: items,
      subTotal: cartTotal,
      shippingCost,
      discount: discountAmount,
      total,
      paymentMethod: data.paymentMethod,
      status: "Pending",
    };

    if (data.paymentMethod === "Cash") {
      OrderServices.addOrder(orderInfo)
        .then((res) => {
          notifySuccess("Order Confirmed!");
          emptyCart();
          Cookies.remove("couponInfo");
          router.push(`/order/${res._id}`);
        })
        .catch((err) => notifyError(err.message))
        .finally(() => setIsCheckoutSubmit(false));
    }
  };

  return {
    handleSubmit,
    submitHandler,
    handleShippingCost: setShippingCost,
    register,
    setValue,
    errors,
    showCard,
    setShowCard,
    error,
    couponInfo,
    couponRef,
    handleCouponCode,
    removeCoupon,
    discountAmount,
    shippingCost,
    total,
    isEmpty,
    items,
    cartTotal,
    currency,
    isCheckoutSubmit,
  };
};

export default useCheckoutSubmit;
