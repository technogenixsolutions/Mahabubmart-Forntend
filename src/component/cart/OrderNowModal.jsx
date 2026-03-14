// src/components/order/OrderNowModal.js
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import InputArea from "@component/form/InputArea";
import Error from "@component/form/Error";
import InputShipping from "@component/form/InputShipping";

import OrderSuccessModal from "./OrderSuccessModal";
import useOrderNowSubmit from "@hooks/useOrderNowSubmit";

const OrderNowModal = ({ close }) => {
  const {
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
  } = useOrderNowSubmit();

  const [successModalData, setSuccessModalData] = useState(null);

  const handleSubmitOrder = async (data) => {
    const orderData = await submitHandler(data);
    if (!orderData) return;

    if (data.paymentMethod === "Cash") {
      setSuccessModalData(orderData);
    }
  };

  const handleClose = () => {
    removeCoupon();
    close();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white w-full max-w-md rounded-lg overflow-hidden">

          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h3 className="font-semibold text-sm">
              ক্যাশ অন ডেলিভারিতে অর্ডার করতে আপনার তথ্য দিন
            </h3>
            <button onClick={handleClose}>
              <IoClose className="text-xl text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleSubmitOrder)} className="p-4 space-y-4 text-sm">

            <InputArea
              register={register}
              name="firstName"
              label="আপনার নাম"
              placeholder="আপনার নাম"
            />
            <Error errorName={errors.firstName} />

            <InputArea
              register={register}
              name="contact"
              label="ফোন নাম্বার"
              placeholder="01XXXXXXXXX"
              type="tel"
            />
            <Error errorName={errors.contact} />

            <InputArea
              register={register}
              name="address"
              label="এড্রেস"
              placeholder="আপনার সম্পূর্ণ ঠিকানা"
            />
            <Error errorName={errors.address} />

            <div className="border rounded p-3 space-y-2">
              <p className="font-medium">শিপিং মেথড</p>

              <InputShipping
                register={register}
                handleShippingCost={setShippingCost}
                value="ঢাকা সিটির ভিতরে"
                time="1-2 Days"
                cost={70}
                currency={currency}
              />

              <InputShipping
                register={register}
                handleShippingCost={setShippingCost}
                value="ঢাকা এবং চট্টগ্রাম সিটির বাহিরে"
                time="3-5 Days"
                cost={130}
                currency={currency}
              />

              <Error errorName={errors.shippingOption} />
            </div>

            <div className="w-full">
              {couponInfo?.couponCode ? (
                <div className="bg-emerald-50 px-4 py-3 w-full rounded-md flex justify-between items-center">
                  <p className="text-[#1F6BBF] font-medium">Coupon Applied</p>
                  <div className="flex items-center gap-3">
                    <span className="text-red-500 font-semibold">
                      {couponInfo.couponCode}
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-gray-400 hover:text-red-500 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    ref={couponRef}
                    type="text"
                    placeholder="কুপন কোড"
                    className="flex-grow border rounded px-3 py-2 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCouponCode}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded"
                  >
                    এপ্লাই
                  </button>
                </div>
              )}
            </div>

            <div className="border-t pt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>সাব টোটাল</span>
                <span>{currency}{cartTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ</span>
                <span>{currency}{shippingCost.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-orange-500">
                <span>ডিসকাউন্ট</span>
                <span>{currency}{discountAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-bold text-base">
                <span>সর্বমোট</span>
                <span>{currency}{parseFloat(total).toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isEmpty || isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-semibold"
            >
              {isSubmitting ? "Processing..." : "আপনার অর্ডার কনফার্ম করুন"}
            </button>
          </form>
        </div>
      </div>

      {successModalData && (
        <OrderSuccessModal
          orderData={successModalData}
          close={() => setSuccessModalData(null)}
        />
      )}
    </>
  );
};

export default OrderNowModal;
