import React, { useContext, useState } from "react";
import { IoClose } from "react-icons/io5";
import InputArea from "@component/form/InputArea";
import Error from "@component/form/Error";
import InputShipping from "@component/form/InputShipping";


import useOrderNowSubmit from "@hooks/useOrderNowSubmit";
import { lead } from "@utils/fbCheckout";


import dynamic from "next/dynamic";


//internal import
import Layout from "@layout/Layout";
import OrderSuccessModal from "@component/cart/OrderSuccessModal";


const cod = () => {

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

    // ✅ শুধু form data থেকে নাও — userInfo লাগবে না
   await lead(orderData, {
    email: data.email || "",
    phone: data.contact || "",
    firstName: data.firstName || "", // ✅ নতুন
    address: data.address || "",     // ✅ নতুন
  });

    if (data.paymentMethod === "Cash") {
      setSuccessModalData(orderData);
    }
  };



  return (
    <>
      <Layout title="Checkout" description="this is checkout page">
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 mt-8 my-10 py-5">
            

          <div className="flex justify-between items-center px-4 py-2 border-b sticky top-0 bg-white z-10">
            <h3 className="font-semibold text-sm">
              ক্যাশ অন ডেলিভারিতে অর্ডার করতে আপনার তথ্য দিন
            </h3>
           
          </div>

          <form onSubmit={handleSubmit(handleSubmitOrder)} className="p-2 space-y-2 text-sm overflow-y-auto">

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
  registerOptions={{
    pattern: {
      value: /^01[3-9]\d{8}$/,
      message: "সঠিক বাংলাদেশি নাম্বার দিন (01XXXXXXXXX)",
    },
    minLength: {
      value: 11,
      message: "নাম্বার অবশ্যই ১১ ডিজিট হতে হবে",
    },
    maxLength: {
      value: 11,
      message: "নাম্বার অবশ্যই ১১ ডিজিট হতে হবে",
    },
  }}
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
              className="w-full lg:w-60 md:w-60 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-semibold"
            >
              {isSubmitting ? "Processing..." : "আপনার অর্ডার কনফার্ম করুন"}
            </button>
          </form>
        </div>
  

      {successModalData && (
        <OrderSuccessModal
          orderData={successModalData}
          close={() => setSuccessModalData(null)}
        />
      )}
        
      </Layout>
    </>
  );
};

export default dynamic(() => Promise.resolve(cod), { ssr: false });
