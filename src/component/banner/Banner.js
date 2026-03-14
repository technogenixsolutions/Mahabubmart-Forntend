import Link from "next/link";
import React from "react";

//internal import
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Banner = () => {
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-xl">
            <span className="text-[#1F6BBF] font-bold">
              {showingTranslateValue(
                storeCustomizationSetting?.home?.promotion_title
              )}
            </span>{" "}
          </h1>

          <p className="text-gray-500">
            {showingTranslateValue(
              storeCustomizationSetting?.home?.promotion_description
            )}
          </p>
        </div>
        <Link
          href={`${storeCustomizationSetting?.home?.promotion_button_link}`|| '/'}
        >
          <a className="text-sm font-serif font-medium px-6 py-2 bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] text-center rounded-full text-white hover:bg-emerald-700">
            {showingTranslateValue(
              storeCustomizationSetting?.home?.promotion_button_name
            )}
          </a>
        </Link>
      </div>
    </>
  );
};

export default Banner;
