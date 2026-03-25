import React, {useContext} from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import {
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,

  WhatsappIcon,
} from "react-share";

import { FaSquareInstagram } from "react-icons/fa6";
import { SiTiktok } from "react-icons/si";



//internal import
import {UserContext} from "@context/UserContext";
import useGetSetting from "@hooks/useGetSetting";
import CMSkeleton from "@component/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Footer = () => {
  const {t} = useTranslation();

  const {
    state: {userInfo},
  } = useContext(UserContext);
  const {showingTranslateValue} = useUtilsFunction();
  const {loading, storeCustomizationSetting} = useGetSetting();

  return (
    <div className="pb-16 lg:pb-0 xl:pb-0 bg-[#eeebeb] text-black">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
        <div className="grid grid-cols-2 md:grid-cols-7 xl:grid-cols-12 gap-5 sm:gap-9 lg:gap-11 xl:gap-7 py-10 lg:py-16 justify-between">
          {storeCustomizationSetting?.footer?.block1_status && (
            <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
              <h3 className="text-md lg:leading-7 font-medium mb-4 sm:mb-5 lg:mb-6 pb-0.5">
                <CMSkeleton
                  count={1}
                  height={20}
                  // error={error}
                  loading={loading}
                  data={storeCustomizationSetting?.footer?.block1_title}
                />
              </h3>
              <ul className="text-sm flex flex-col space-y-3">
                <li className="flex items-baseline">
                  <Link
                    href={
                      `${storeCustomizationSetting?.footer?.block1_sub_link1}` ||
                      "/"
                    }>
                    <a className="text-black inline-block w-full hover:text-[#1F6BBF]">
                      <CMSkeleton
                        count={1}
                        height={10}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.footer?.block1_sub_title1
                        }
                      />
                    </a>
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={
                      `${storeCustomizationSetting?.footer?.block1_sub_link2}` ||
                      "/"
                    }>
                    <a className="text-black inline-block w-full hover:text-[#1F6BBF]">
                      {/* {t('common:footer-contact-us')} */}

                      <CMSkeleton
                        count={1}
                        height={10}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.footer?.block1_sub_title2
                        }
                      />
                    </a>
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={
                      `${storeCustomizationSetting?.footer?.block1_sub_link3}` ||
                      "/"
                    }>
                    <a className="text-black inline-block w-full hover:text-[#1F6BBF]">
                      {/* {t('common:footer-careers')} */}
                      {showingTranslateValue(
                        storeCustomizationSetting?.footer_block_one_link_three_title
                      )}
                      <CMSkeleton
                        count={1}
                        height={10}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.footer?.block1_sub_title3
                        }
                      />
                    </a>
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={
                      `${storeCustomizationSetting?.footer?.block1_sub_link4}` ||
                      "/"
                    }>
                    <a className="text-black  inline-block w-full hover:text-[#1F6BBF]">
                      <CMSkeleton
                        count={1}
                        height={10}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.footer?.block1_sub_title4
                        }
                      />
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {storeCustomizationSetting?.footer?.block2_status && (
            <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
              <h3 className="text-md lg:leading-7 font-medium mb-4 sm:mb-5 lg:mb-6 pb-0.5">
                <CMSkeleton
                  count={1}
                  height={20}
                  // error={error}
                  loading={loading}
                  data={storeCustomizationSetting?.footer?.block2_title}
                />
              </h3>
              <ul className="text-sm lg:text-15px flex flex-col space-y-3">
                <li className="flex items-baseline">
                  <Link
                    href={
                      `${storeCustomizationSetting?.footer?.block2_sub_link1}` ||
                      "/"
                    }>
                    <a className="text-black  inline-block w-full hover:text-[#1F6BBF]">
                      <CMSkeleton
                        count={1}
                        height={10}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.footer?.block2_sub_title1
                        }
                      />
                    </a>
                  </Link>
                </li>

                <li className="flex items-baseline">
                  <Link
                    href={
                      `${storeCustomizationSetting?.footer?.block2_sub_link2}` ||
                      "/"
                    }>
                    <a className="text-black  inline-block w-full hover:text-[#1F6BBF]">
                      <CMSkeleton
                        count={1}
                        height={10}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.footer?.block2_sub_title2
                        }
                      />
                    </a>
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={
                      `${storeCustomizationSetting?.footer?.block2_sub_link3}` ||
                      "/"
                    }>
                    <a className="text-black  inline-block w-full hover:text-[#1F6BBF]">
                      <CMSkeleton
                        count={1}
                        height={10}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.footer?.block2_sub_title3
                        }
                      />
                    </a>
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={
                      `${storeCustomizationSetting?.footer?.block2_sub_link4}` ||
                      "/"
                    }>
                    <a className="text-black inline-block w-full hover:text-[#1F6BBF]">
                      <CMSkeleton
                        count={1}
                        height={10}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.footer?.block2_sub_title4
                        }
                      />
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {storeCustomizationSetting?.footer?.block3_status && (
            <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
              <h3 className="text-md lg:leading-7 font-medium mb-4 sm:mb-5 lg:mb-6 pb-0.5">
                <CMSkeleton
                  count={1}
                  height={20}
                  // error={error}
                  loading={loading}
                  data={storeCustomizationSetting?.footer?.block3_title}
                />
              </h3>
              <ul className="text-sm lg:text-15px flex flex-col space-y-3">
                <li className="flex items-baseline">
                  <Link
                    href={`${
                      userInfo?.email
                        ? storeCustomizationSetting?.footer?.block3_sub_link1
                        : "#"
                    }`}>
                    <a className="text-black  inline-block w-full hover:text-[#1F6BBF]">
                      <CMSkeleton
                        count={1}
                        height={10}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.footer?.block3_sub_title1
                        }
                      />
                    </a>
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${
                      userInfo?.email
                        ? storeCustomizationSetting?.footer?.block3_sub_link2
                        : "#"
                    }`}>
                    <a className="text-black  inline-block w-full hover:text-[#1F6BBF]">
                      <CMSkeleton
                        count={1}
                        height={10}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.footer?.block3_sub_title2
                        }
                      />
                    </a>
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${
                      userInfo?.email
                        ? storeCustomizationSetting?.footer?.block3_sub_link3
                        : "#"
                    }`}>
                    <a className="text-black inline-block w-full hover:text-[#1F6BBF]">
                      <CMSkeleton
                        count={1}
                        height={10}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.footer?.block3_sub_title3
                        }
                      />
                    </a>
                  </Link>
                </li>
                <li className="flex items-baseline">
                  <Link
                    href={`${
                      userInfo?.email
                        ? storeCustomizationSetting?.footer?.block3_sub_link4
                        : "#"
                    }`}>
                    <a className="text-black inline-block w-full hover:text-[#1F6BBF]">
                      <CMSkeleton
                        count={1}
                        height={10}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.footer?.block3_sub_title4
                        }
                      />
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          )}
          {storeCustomizationSetting?.footer?.block4_status && (
            <div className="pb-3.5 sm:pb-0 col-span-1 md:col-span-2 lg:col-span-3">
              <Link href="/">
                <a className="mr-3 lg:mr-12 xl:mr-12 flex items-center h-12" rel="noreferrer">
                  <Image
                    src="https://res.cloudinary.com/dgwwhniph/image/upload/v1773404263/Gemini_Generated_Image_kk11j3kk11j3kk11_1_je0nc7.png"
      alt="mahabubmart"
      width={180}
      height={60}
      className="object-contain h-12 w-auto brightness-0 "
      priority
                  />
                </a>
              </Link>
              <p className="leading-7 font-sans text-sm text-black mt-3">
                {showingTranslateValue(
                  storeCustomizationSetting?.footer?.block4_address
                )}
                <CMSkeleton
                  count={1}
                  height={10}
                  // error={error}
                  loading={loading}
                  data={""}
                />
                <br />
                <span>
                  {" "}
                  Tel : {storeCustomizationSetting?.footer?.block4_phone}
                </span>
                <br />
                <span>
                  {" "}
                  Email : {storeCustomizationSetting?.footer?.block4_email}
                </span>
              </p>
            </div>
          )}
        </div>

        <hr className="hr-line"></hr>

        <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 bg-gray-50 shadow-sm border border-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-9 lg:gap-11 xl:gap-7 py-8 items-center justify-between">
            <div className="col-span-1">
              {storeCustomizationSetting?.footer?.social_links_status && (
                <div>
                  {(storeCustomizationSetting?.footer?.social_facebook ||
                    storeCustomizationSetting?.footer?.social_twitter ||
                    storeCustomizationSetting?.footer?.social_pinterest ||
                    storeCustomizationSetting?.footer?.social_linkedin ||
                    storeCustomizationSetting?.footer?.social_whatsapp) && (
                    <span className="text-[#1F6BBF]  leading-7 font-medium block mb-2 pb-0.5">
                      {t("common:footer-follow-us")}
                    </span>
                  )}
                  <ul className="text-sm flex">
                    {storeCustomizationSetting?.footer?.social_facebook && (
                      <li className="flex items-center mr-3 transition ease-in-out duration-500">
                        <Link
                          href={
                            `${storeCustomizationSetting?.footer?.social_facebook}` ||
                            "/"
                          }>
                          <a
                            aria-label="Social Link"
                            rel="noreferrer"
                            target="_blank"
                            className="block text-center mx-auto text-white hover:text-white">
                            <FacebookIcon size={34} round />
                          </a>
                        </Link>
                      </li>
                    )}
                    {storeCustomizationSetting?.footer?.social_twitter && (
                      <li className="flex items-center  mr-3 transition ease-in-out duration-500">
                        <Link
                          href={
                            `${storeCustomizationSetting?.footer?.social_twitter}` ||
                            "/"
                          }>
                          <a
                            aria-label="Social Link"
                            rel="noreferrer"
                            target="_blank"
                            className="block text-center mx-auto text-white hover:text-white">
                            <FaSquareInstagram  size={34} round color={["#FD1D1D"] }/>
                          </a>
                        </Link>
                      </li>
                    )}
                    {storeCustomizationSetting?.footer?.social_pinterest && (
                      <li className="flex items-center mr-3 transition ease-in-out duration-500">
                        <Link
                          href={
                            `${storeCustomizationSetting?.footer?.social_pinterest}` ||
                            ""
                          }>
                          <a
                            aria-label="Social Link"
                            rel="noreferrer"
                            target="_blank"
                            className="block text-center mx-auto text-white hover:text-white">
                            <SiTiktok size={34} round color={["#000000"]} />
                          </a>
                        </Link>
                      </li>
                    )}
                    {storeCustomizationSetting?.footer?.social_linkedin && (
                      <li className="flex items-center  mr-3 transition ease-in-out duration-500">
                        <Link
                          href={
                            `${storeCustomizationSetting?.footer?.social_linkedin}` ||
                            "/"
                          }>
                          <a
                            aria-label="Social Link"
                            rel="noreferrer"
                            target="_blank"
                            className="block text-center mx-auto text-white hover:text-white">
                            <LinkedinIcon size={34} round />
                          </a>
                        </Link>
                      </li>
                    )}
                    {storeCustomizationSetting?.footer?.social_whatsapp && (
                      <li className="flex items-center  mr-3 transition ease-in-out duration-500">
                        <Link
                          href={
                            `${storeCustomizationSetting?.footer?.social_whatsapp}` ||
                            "/"
                          }>
                          <a
                            aria-label="Social Link"
                            rel="noreferrer"
                            target="_blank"
                            className="block text-center mx-auto text-white hover:text-white">
                            <WhatsappIcon size={34} round />
                          </a>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
            <div className="col-span-1 text-center hidden lg:block md:block">
              {storeCustomizationSetting?.footer?.bottom_contact_status && (
                <div>
                  <p className="text-[#161616] leading-7 font-medium block">
                    {t("common:footer-call-us")}
                  </p>
                  <h5 className="text-2xl font-bold text-[#1F6BBF] leading-7">
                    {/* +012345-67900 */}
                    {storeCustomizationSetting?.footer?.bottom_contact}
                  </h5>
                </div>
              )}
            </div>
            {storeCustomizationSetting?.footer?.payment_method_status && (
              <div className="col-span-1 hidden lg:block md:block">
                <ul className="lg:text-right">
                  <li className="px-1 mb-2 md:mb-0 transition hover:opacity-80 inline-flex">
                    <Image
                      width={274}
                      height={85}
                      className="w-full"
                      src={
                        storeCustomizationSetting?.footer?.payment_method_img ||
                        "/payment-method/payment-logo.png"
                      }
                      alt="payment method"
                    />
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

<div className="mx-auto max-w-screen-2xl px-3 sm:px-10 flex justify-center py-4">
  <p className="text-sm text-gray-500 leading-6 text-center">
    © {new Date().getFullYear()} @{" "}
    <Link href="https://mahabubmart.com">
      <a
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#1F6BBF]"
      >
        Mahabubmart
      </a>
    </Link>
    , All rights reserved. <br />
    Developed by{" "}
    <a
      href="https://www.technogenixsolutions.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#1F6BBF] font-medium"
    >
      TechnoGenix Solutions
    </a>
  </p>
</div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(Footer), {ssr: false});
