import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import { CopyToClipboard } from "react-copy-to-clipboard";

// internal import
import useAsync from "@hooks/useAsync";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import OfferTimer from "@component/coupon/OfferTimer";
import BannerServices from "@services/BannerServices";
import CouponServices from "@services/CouponServices";

const OfferCard = () => {
  const [copiedCode, setCopiedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const { storeCustomizationSetting, globalSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  const { data: couponData } = useAsync(CouponServices.getShowingCoupons);
  const { data: bannerData } = useAsync(BannerServices.getShowingBanners);

  const currency = globalSetting?.default_currency || "৳";

  const coupons = Array.isArray(couponData) ? couponData : [];
  const couponCount = coupons.length;
  const showBanner = couponCount < 2;


  const handleCopied = (code) => {
    setCopiedCode(code);
    setCopied(true);
  };

  // ── Banner mode ───────────────────────────────────────────

if (showBanner) {
  return (
    <div className="w-full">
      {bannerData?.image ? (
        <Link href={bannerData.link || "#"}>
          <img
            src={bannerData.image}
            alt={bannerData.name || "Offer Banner"}
            className="w-full h-full object-cover rounded-md cursor-pointer"
            style={{ display: "block" }}
          />
        </Link>
      ) : null}
    </div>
  );
}

  // ── Coupon mode (2টা বা বেশি coupon) ─────────────────────
  return (
    <div className="w-full group">
      <div className="bg-gray-50 h-full border-2 border-orange-500 transition duration-150 ease-linear transform group-hover:border-[#1F6BBF] rounded shadow">
        <div className="bg-orange-100 text-gray-900 px-6 py-2 rounded-t border-b flex items-center justify-center">
          <h3 className="text-base font-serif font-medium">
            {showingTranslateValue(
              storeCustomizationSetting?.home?.discount_title
            )}
          </h3>
        </div>

        <div className="overflow-hidden">
          {coupons.slice(0, 2).map((coupon) => (
            <div
              key={coupon._id}
              className="coupon coupon-home mx-4 my-5 block md:flex lg:flex md:justify-between lg:justify-between items-center bg-white rounded-md shadow"
            >
              <div className="tengah py-2 px-3 flex items-center justify-items-start">
                <figure>
                  {coupon?.logo ? (
                    <img
                      src={coupon.logo}
                      width={100}
                      height={100}
                      className="rounded-lg"
                    
                      alt={showingTranslateValue(coupon?.title)}
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] rounded-lg bg-gray-100" />
                  )}
                </figure>
                <div className="ml-3">
                  <div className="flex items-center font-serif">
                    <h6 className="pl-1 text-base font-medium text-gray-600">
                      <span className="text-lg md:text-xl lg:text-xl text-red-500 font-bold">
                        {coupon?.discountType?.type === "fixed" ? (
                          <span>{currency}{coupon?.discountType?.value}</span>
                        ) : (
                          <span>{coupon?.discountType?.value}%</span>
                        )}
                      </span>{" "}
                      Off
                    </h6>
                    <div className="ml-2">
                      {dayjs().isAfter(dayjs(coupon.endTime)) ? (
                        <span className="text-red-600 inline-block px-4 py-1 rounded-full font-medium text-xs bg-red-100">
                          Inactive
                        </span>
                      ) : (
                        <span className="text-[#1F6BBF] inline-block px-4 py-1 rounded-full font-medium text-xs bg-emerald-100">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                  <h2 className="pl-1 font-serif text-base text-gray-700 leading-6 font-semibold mb-2">
                    {showingTranslateValue(coupon?.title)}
                  </h2>
                  {dayjs().isAfter(dayjs(coupon.endTime)) ? (
                    <span className="inline-block mb-2">
                      <div className="flex items-center font-semibold">
                        {["00", "00", "00", "00"].map((v, i) => (
                          <React.Fragment key={i}>
                            {i > 0 && ":"}
                            <span className="flex items-center justify-center bg-red-500 text-white text-sm font-serif font-semibold mx-1 px-2 py-1 rounded">
                              {v}
                            </span>
                          </React.Fragment>
                        ))}
                      </div>
                    </span>
                  ) : (
                    <span className="inline-block mb-2">
                      <div className="flex items-center font-semibold">
                        <OfferTimer
                          expiryTimestamp={new Date(coupon.endTime)}
                          darkGreen
                        />
                      </div>
                    </span>
                  )}
                </div>
              </div>

              <div className="md:border-l-2 lg:border-l-2 border-dashed lg:w-1/3 md:w-1/3 relative px-4">
                <div className="info flex items-center">
                  <div className="w-full">
                    <div className="block">
                      <div className="font-serif border border-dashed bg-emerald-50 py-1 border-emerald-300 rounded-lg text-center block">
                        <CopyToClipboard
                          text={coupon.couponCode}
                          onCopy={() => handleCopied(coupon.couponCode)}
                        >
                          <button className="block w-full">
                            {copied && coupon.couponCode === copiedCode ? (
                              <span className="text-[#1F6BBF] text-sm leading-7 font-semibold">
                                Copied!
                              </span>
                            ) : (
                              <span className="uppercase font-serif font-semibold text-sm leading-7 text-[#1F6BBF]">
                                {coupon.couponCode}
                              </span>
                            )}
                          </button>
                        </CopyToClipboard>
                      </div>
                    </div>
                    <p className="text-xs leading-4 text-gray-500 mt-2">
                      * This coupon apply when shopping more then{" "}
                      <span className="font-bold">
                        {currency}
                        {coupon.minimumAmount}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;