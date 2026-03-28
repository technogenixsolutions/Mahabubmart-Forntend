import Cookies from "js-cookie";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useCart } from "react-use-cart";

// internal
import { UserContext } from "@context/UserContext";
import OrderServices from "@services/OrderServices";
import CouponServices from "@services/CouponServices";
import SettingServices from "@services/SettingServices";
import useAsync from "@hooks/useAsync";
import { notifyError, notifySuccess } from "@utils/toast";


const useOrderNowSubmit = () => {
  const {
    state: { userInfo },
  } = useContext(UserContext);

  const router = useRouter();
  const { items, cartTotal, isEmpty, emptyCart } = useCart();

  const [shippingCost, setShippingCost] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [minimumAmount, setMinimumAmount] = useState(0);
  const [couponInfo, setCouponInfo] = useState({});
  const [total, setTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const couponRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentMethod: "Cash",
    },
  });

  const { data: coupons } = useAsync(CouponServices.getAllCoupons);
  const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);
  const currency = globalSetting?.default_currency || "৳";

  /* ================= TOTAL CALC ================= */
  useEffect(() => {
    const discountProductTotal = items.reduce(
      (sum, item) => sum + item.itemTotal,
      0
    );

    const discount =
      discountPercentage?.type === "fixed"
        ? discountPercentage?.value
        : discountProductTotal * (discountPercentage?.value / 100);

    const finalDiscount = discount || 0;

    const subTotal = cartTotal + shippingCost;

    setDiscountAmount(finalDiscount);
    setTotal(subTotal - finalDiscount);
  }, [cartTotal, shippingCost, discountPercentage, items]);

  /* ================= LOAD COUPON FROM COOKIE ================= */
  useEffect(() => {
    if (Cookies.get("couponInfo")) {
      const c = JSON.parse(Cookies.get("couponInfo"));
      setCouponInfo(c);
      setDiscountPercentage(c.discountType);
      setMinimumAmount(c.minimumAmount);
    }
  }, []);

  /* ================= AUTO REMOVE COUPON (MAIN FIX) ================= */
  useEffect(() => {
    if (
      couponInfo?.couponCode &&
      minimumAmount > 0 &&
      total < minimumAmount
    ) {
      notifyError(
        `অর্ডার ${minimumAmount} টাকার নিচে নেমে গেছে, কুপন বাতিল করা হয়েছে`
      );
      removeCoupon();
    }
  }, [total, couponInfo, minimumAmount]);

  /* ================= SUBMIT ORDER ================= */
  // const submitHandler = async (data) => {
  //   try {
  //     setIsSubmitting(true);

  //     // 🔒 FINAL SAFETY CHECK
  //     if (couponInfo?.couponCode && total < minimumAmount) {
  //       notifyError(
  //         `Minimum ${minimumAmount} টাকা না হলে কুপনসহ অর্ডার করা যাবে না`
  //       );
  //       setIsSubmitting(false);
  //       return null;
  //     }

  //     const orderUserInfo = {
  //       name: data.firstName,
  //       contact: data.contact,
  //       address: data.address,
  //     };

  //     const orderInfo = {
  //       user: userInfo?._id || null,
  //       user_info: orderUserInfo,
  //       shippingOption: data.shippingOption,
  //       paymentMethod: "Cash",
  //       status: "Pending",
  //       cart: items,
  //       subTotal: cartTotal,
  //       shippingCost,
  //       discount: discountAmount,
  //       total,
  //     };

  //     const res = await OrderServices.addOrder(orderInfo);

      

  //     notifySuccess("আপনার অর্ডার সফল হয়েছে 🎉");

  //     Cookies.remove("couponInfo");
  //     sessionStorage.removeItem("products");
  //     emptyCart();

  //     setIsSubmitting(false);
  //     return res;

  //   } catch (err) {
  //     notifyError(err?.message || "Order failed!");
  //     setIsSubmitting(false);
  //     return null;
  //   }
  // };


  const submitHandler = async (data) => {
  try {
    setIsSubmitting(true);

    // 🔒 FINAL SAFETY CHECK
    if (couponInfo?.couponCode && total < minimumAmount) {
      notifyError(
        `Minimum ${minimumAmount} টাকা না হলে কুপনসহ অর্ডার করা যাবে না`
      );
      setIsSubmitting(false);
      return null;
    }

    const orderUserInfo = {
      name: data.firstName,
      contact: data.contact,
      address: data.address,
    };

    const orderInfo = {
      user: userInfo?._id || null,
      user_info: orderUserInfo,
      shippingOption: data.shippingOption,
      paymentMethod: "Cash",
      status: "Pending",
      cart: items,
      subTotal: cartTotal,
      shippingCost,
      discount: discountAmount,
      total,
    };

    // 🔹 Add order
    const res = await OrderServices.addOrder(orderInfo);



    notifySuccess("আপনার অর্ডার সফল হয়েছে 🎉");

    Cookies.remove("couponInfo");
    sessionStorage.removeItem("products");
    emptyCart();

    setIsSubmitting(false);
    return res;

  } catch (err) {
    notifyError(err?.message || "Order failed!");
    setIsSubmitting(false);
    return null;
  }
};
  /* ================= APPLY COUPON ================= */
  const handleCouponCode = (e) => {
    e.preventDefault();

    const code = couponRef.current?.value;

    if (!code) {
      notifyError("কুপন কোড লিখুন");
      return;
    }

    const match = coupons?.find((c) => c.couponCode === code);

    if (!match) {
      notifyError("ভুল কুপন কোড");
      return;
    }

    if (dayjs().isAfter(dayjs(match.endTime))) {
      notifyError("এই কুপনটির মেয়াদ শেষ");
      return;
    }

    if (total < match.minimumAmount) {
      notifyError(`Minimum ${match.minimumAmount} টাকা লাগবে`);
      return;
    }

    setCouponInfo(match);
    setDiscountPercentage(match.discountType);
    setMinimumAmount(match.minimumAmount);

    Cookies.set("couponInfo", JSON.stringify(match));
    notifySuccess("Coupon applied successfully");
  };

  /* ================= REMOVE COUPON ================= */
  const removeCoupon = () => {
    setCouponInfo({});
    setDiscountPercentage(0);
    setDiscountAmount(0);
    setMinimumAmount(0);

    if (couponRef?.current) {
      couponRef.current.value = "";
    }

    Cookies.remove("couponInfo");
  };

  return {
    handleSubmit,
    submitHandler,
    register,
    errors,
    isEmpty,
    couponRef,
    handleCouponCode,
    removeCoupon,
    couponInfo,
    shippingCost,
    setShippingCost,
    discountAmount,
    cartTotal,
    total,
    currency,
    isSubmitting,
  };
};

export default useOrderNowSubmit;
