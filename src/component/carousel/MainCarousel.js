import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

//internal import

import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";

const MainCarousel = () => {
  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue, showingUrl, showingImage } =
    useUtilsFunction();

  // const sliderData = [
  //   {
  //     id: 1,

  //     title: showingTranslateValue(
  //       storeCustomizationSetting?.slider?.first_title
  //     ),
  //     info: showingTranslateValue(
  //       storeCustomizationSetting?.slider?.first_description
  //     ),
  //     buttonName: showingTranslateValue(
  //       storeCustomizationSetting?.slider?.first_button
  //     ),
  //     url: showingUrl(storeCustomizationSetting?.slider?.first_link),
  //     image:
  //       showingImage(storeCustomizationSetting?.slider?.first_img) 
  //   },
  //   {
  //     id: 2,
  //     title: showingTranslateValue(
  //       storeCustomizationSetting?.slider?.second_title
  //     ),
  //     info: showingTranslateValue(
  //       storeCustomizationSetting?.slider?.second_description
  //     ),
  //     buttonName: showingTranslateValue(
  //       storeCustomizationSetting?.slider?.second_button
  //     ),
  //     url: showingUrl(storeCustomizationSetting?.slider?.second_link),
  //     image:
  //       showingImage(storeCustomizationSetting?.slider?.second_img) 
  //   },
  //   {
  //     id: 3,
  //     title: showingTranslateValue(
  //       storeCustomizationSetting?.slider?.third_title
  //     ),
  //     info: showingTranslateValue(
  //       storeCustomizationSetting?.slider?.third_description
  //     ),
  //     buttonName: showingTranslateValue(
  //       storeCustomizationSetting?.slider?.third_button
  //     ),
  //     url: showingUrl(storeCustomizationSetting?.slider?.third_link),
  //     image:
  //       showingImage(storeCustomizationSetting?.slider?.third_img) 
  //   },
  //   {
  //     id: 4,
  //     title: showingTranslateValue(
  //       storeCustomizationSetting?.slider?.four_title
  //     ),
  //     info: showingTranslateValue(
  //       storeCustomizationSetting?.slider?.four_description
  //     ),
  //     buttonName: showingTranslateValue(
  //       storeCustomizationSetting?.slider?.four_button
  //     ),
  //     url: showingUrl(storeCustomizationSetting?.slider?.four_link),
  //     image:
  //       showingImage(storeCustomizationSetting?.slider?.four_img)
  //   },
  //   {
  //     id: 5,
  //     title: showingTranslateValue(
  //       storeCustomizationSetting?.slider?.five_title
  //     ),
  //     info: showingTranslateValue(
  //       storeCustomizationSetting?.slider?.five_description
  //     ),
  //     buttonName: showingTranslateValue(
  //       storeCustomizationSetting?.slider?.five_button
  //     ),
  //     url: showingUrl(storeCustomizationSetting?.slider?.five_link),
  //     image:
  //       showingImage(storeCustomizationSetting?.slider?.five_img) 
  //   },
  // ];


   // 🔥 raw slider data (same as before)
  const sliderData = [
    {
      id: 1,
      title: showingTranslateValue(storeCustomizationSetting?.slider?.first_title),
      info: showingTranslateValue(storeCustomizationSetting?.slider?.first_description),
      buttonName: showingTranslateValue(storeCustomizationSetting?.slider?.first_button),
      url: showingUrl(storeCustomizationSetting?.slider?.first_link),
      image: showingImage(storeCustomizationSetting?.slider?.first_img),
    },
    {
      id: 2,
      title: showingTranslateValue(storeCustomizationSetting?.slider?.second_title),
      info: showingTranslateValue(storeCustomizationSetting?.slider?.second_description),
      buttonName: showingTranslateValue(storeCustomizationSetting?.slider?.second_button),
      url: showingUrl(storeCustomizationSetting?.slider?.second_link),
      image: showingImage(storeCustomizationSetting?.slider?.second_img),
    },
    {
      id: 3,
      title: showingTranslateValue(storeCustomizationSetting?.slider?.third_title),
      info: showingTranslateValue(storeCustomizationSetting?.slider?.third_description),
      buttonName: showingTranslateValue(storeCustomizationSetting?.slider?.third_button),
      url: showingUrl(storeCustomizationSetting?.slider?.third_link),
      image: showingImage(storeCustomizationSetting?.slider?.third_img),
    },
    {
      id: 4,
      title: showingTranslateValue(storeCustomizationSetting?.slider?.four_title),
      info: showingTranslateValue(storeCustomizationSetting?.slider?.four_description),
      buttonName: showingTranslateValue(storeCustomizationSetting?.slider?.four_button),
      url: showingUrl(storeCustomizationSetting?.slider?.four_link),
      image: showingImage(storeCustomizationSetting?.slider?.four_img),
    },
    {
      id: 5,
      title: showingTranslateValue(storeCustomizationSetting?.slider?.five_title),
      info: showingTranslateValue(storeCustomizationSetting?.slider?.five_description),
      buttonName: showingTranslateValue(storeCustomizationSetting?.slider?.five_button),
      url: showingUrl(storeCustomizationSetting?.slider?.five_link),
      image: showingImage(storeCustomizationSetting?.slider?.five_img),
    },
  ];

  // ✅ only valid data filter
  const filteredSliderData = sliderData.filter(
    (item) => item?.image && item?.title
  );

  // ❌ no data হলে কিছুই show হবে না
  if (filteredSliderData.length === 0) return null;
  return (
    <>
      {/* <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        loop={true}
        pagination={
          (storeCustomizationSetting?.slider?.bottom_dots ||
            storeCustomizationSetting?.slider?.both_slider) && {
            clickable: true,
          }
        }
        navigation={
          (storeCustomizationSetting?.slider?.left_right_arrow ||
            storeCustomizationSetting?.slider?.both_slider) && {
            clickable: true,
          }
        }
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {sliderData?.map((item, i) => (
          <SwiperSlide
            className="h-full relative rounded-lg overflow-hidden"
            key={i + 1}
          >
            <div className="text-sm text-gray-600 hover:text-emerald-dark">
              <Image
                layout="responsive"
                width={950}
                height={400}
                src={item.image}
                alt={item.title}
                className="object-cover"
              />
            </div>
            <div className="absolute top-0 left-0 z-10 p-r-16 flex-col flex w-full h-full place-items-start justify-center">
              <div className="pl-4 pr-12 sm:pl-10 sm:pr-16 w-10/12 lg:w-8/12 xl:w-7/12">
                <h1 className="mb-2 font-DejaVu text-xl sm:text-lg md:text-2xl line-clamp-1 md:line-clamp-none  lg:line-clamp-none  lg:text-3xl font-bold text-gray-800">
                  {item?.title}
                </h1>
                <p className="text-base leading-6 text-gray-600 font-sans line-clamp-1  md:line-clamp-none lg:line-clamp-none">
                  {item?.info}
                </p>
                <Link href={item.url || "/" }>
                  <a className="hidden sm:inline-block lg:inline-block text-sm leading-6 font-serif font-medium mt-6 px-6 py-2 bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] text-center rounded-md text-white hover:from-[#155a9e] hover:via-[#1e88c8] hover:to-[#0090c2]  transition-all duration-300">
                    {item.buttonName}
                  </a>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper> */}


      <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
      loop={filteredSliderData.length > 1} // 🔥 only loop if >1 slide
      pagination={
        (storeCustomizationSetting?.slider?.bottom_dots ||
          storeCustomizationSetting?.slider?.both_slider) && {
          clickable: true,
        }
      }
      navigation={
        (storeCustomizationSetting?.slider?.left_right_arrow ||
          storeCustomizationSetting?.slider?.both_slider) && {
          clickable: true,
        }
      }
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper"
    >
      {filteredSliderData.map((item, i) => (
        <SwiperSlide
          className="h-full relative rounded-lg overflow-hidden"
          key={item.id}
        >
          {/* image */}
          <Image
            layout="responsive"
            width={950}
            height={400}
            src={item.image}
            alt={item.title || "slider"}
            className="object-cover"
          />

          {/* content */}
          <div className="absolute top-0 left-0 z-10 flex flex-col w-full h-full justify-center">
            <div className="pl-4 pr-12 sm:pl-10 sm:pr-16 w-10/12 lg:w-8/12 xl:w-7/12">
              
              {item?.title && (
                <h1 className="mb-2 font-DejaVu text-xl sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-800">
                  {item?.title}
                </h1>
              )}

              {item?.info && (
                <p className="text-base leading-6 text-gray-600 font-sans">
                  {item.info}
                </p>
              )}

              {item.buttonName && (
                <Link href={item?.url || "/"}>
                  <a className="inline-block mt-6 px-6 py-2 bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] rounded-md text-white hover:opacity-90 transition">
                    {item?.buttonName}
                  </a>
                </Link>
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
    </>
  );
};

export default React.memo(MainCarousel);
