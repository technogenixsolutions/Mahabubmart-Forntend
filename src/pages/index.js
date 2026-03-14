import { SidebarContext } from "@context/SidebarContext";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

//internal import
import Layout from "@layout/Layout";
import Banner from "@component/banner/Banner";
import useGetSetting from "@hooks/useGetSetting";
import CardTwo from "@component/cta-card/CardTwo";
import OfferCard from "@component/offer/OfferCard";
import StickyCart from "@component/cart/StickyCart";
import Loading from "@component/preloader/Loading";
import ProductServices from "@services/ProductServices";
import ProductCard from "@component/product/ProductCard";
import MainCarousel from "@component/carousel/MainCarousel";
import FeatureCategory from "@component/category/FeatureCategory";
import AttributeServices from "@services/AttributeServices";
import CMSkeleton from "@component/preloader/CMSkeleton";
import FAQ from "@component/faq/FAQ";
import Link from "next/link";

const Home = ({ popularProducts, discountProducts, attributes }) => {

  const router = useRouter();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { loading, error, storeCustomizationSetting } = useGetSetting();

 

  useEffect(() => {
    if (router.asPath === "/") {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [router]);

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout>
          <div className="min-h-screen">
            <StickyCart />
            <div className="bg-white">
              <div className="mx-auto py-5 max-w-screen-2xl px-3 sm:px-10">
                <div className="flex w-full">
                  <div className="flex-shrink-0 xl:pr-6 lg:block w-full lg:w-3/5">
                    <MainCarousel />
                  </div>
                  <div className="w-full hidden lg:flex">
                    <OfferCard />
                  </div>
                </div>
                {storeCustomizationSetting?.home?.promotion_banner_status && (
                  <div className="bg-orange-100 px-10 py-6 rounded-lg mt-6">
                    <Banner />
                  </div>
                )}
              </div>
            </div>

            {/* feature category's */}
            {storeCustomizationSetting?.home?.featured_status && (
              <div className="bg-gray-100 lg:py-16 py-10">
                <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
                  <div className="mb-10 flex justify-center">
                    <div className="text-center w-full lg:w-2/5">
                      <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                        <CMSkeleton
                          count={1}
                          height={30}
                          // error={error}
                          loading={loading}
                          data={storeCustomizationSetting?.home?.feature_title}
                        />
                      </h2>
                      <p className="text-base font-sans text-gray-600 leading-6">
                        <CMSkeleton
                          count={4}
                          height={10}
                          error={error}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home?.feature_description
                          }
                        />
                      </p>
                    </div>
                  </div>

                  <FeatureCategory />
                </div>
              </div>
            )}

            {/* popular products */}
            {storeCustomizationSetting?.home?.popular_products_status && (
              <div className="bg-gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10">
                <div className="mb-10 flex justify-center">
                  <div className="text-center w-full lg:w-2/5">
                    <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                      <CMSkeleton
                        count={1}
                        height={30}
                        // error={error}
                        loading={loading}
                        data={storeCustomizationSetting?.home?.popular_title}
                      />
                    </h2>
                    <p className="text-base font-sans text-gray-600 leading-6">
                      <CMSkeleton
                        count={5}
                        height={10}
                        error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.home?.popular_description
                        }
                      />
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-full">
                    {loading ? (
                      <CMSkeleton
                        count={20}
                        height={20}
                        error={error}
                        loading={loading}
                      />
                    ) : (
                      <><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                            {popularProducts
                              ?.slice(
                                0,
                                storeCustomizationSetting?.home
                                  ?.popular_product_limit
                              )
                              ?.map((product) => (
                                <ProductCard
                                  key={product._id}
                                  product={product}
                                  attributes={attributes} />
                              ))}
                          </div><div className="text-center mt-8">
                              <Link href="/products">
                                <button className="px-6 py-2 bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] hover:from-[#155a9e] hover:via-[#1e88c8] hover:to-[#0090c2]  transition-all duration-300 text-white rounded-md">
                                  View All Trending Products
                                </button>
                              </Link>
                            </div></>
                    )}
                  </div>
                </div>
              </div>
            )}


               {/* discounted products */}
            {storeCustomizationSetting?.home?.discount_product_status && (
              <div
                id="discount"
                className="bg-gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10"
              >
                <div className="mb-10 flex justify-center">
                  <div className="text-center w-full lg:w-2/5">
                    <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                      <CMSkeleton
                        count={1}
                        height={30}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.home?.latest_discount_title
                        }
                      />
                    </h2>
                    <p className="text-base font-sans text-gray-600 leading-6">
                      <CMSkeleton
                        count={5}
                        height={20}
                        // error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.home
                            ?.latest_discount_description
                        }
                      />
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-full">
                    {loading ? (
                      <CMSkeleton
                        count={20}
                        height={20}
                        error={error}
                        loading={loading}
                      />
                    ) : (
                      <><div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                            {discountProducts
                              ?.slice(
                                0,
                                storeCustomizationSetting?.home
                                  ?.latest_discount_product_limit
                              )
                              .map((product) => (
                                <ProductCard
                                  key={product._id}
                                  product={product}
                                  attributes={attributes} />
                              ))}
                          </div><div className="text-center mt-8">
                              <Link href="/discount-products">
                                <button className="px-6 py-2 bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] hover:from-[#155a9e] hover:via-[#1e88c8] hover:to-[#0090c2]  transition-all duration-300 text-white rounded-md">
                                  View All Discount Products
                                </button>
                              </Link>
                            </div></>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* promotional banner card */}
            {storeCustomizationSetting?.home?.delivery_status && (
              <div className="block mx-auto max-w-screen-2xl">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
                  <div className="lg:p-16 p-6 bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] shadow-sm border rounded-lg">
                    <CardTwo />
                  </div>
                </div>
              </div>
            )}

            {/* FAQ*/}
         <div className="block mx-auto max-w-screen-2xl">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 my-14">
                  <h2 className="text-center font-bold text-lg my-3">FAQ</h2>
                  <div className="lg:p-16 p-6  shadow-sm border rounded-lg ">
                    <FAQ />
                  </div>
                </div>
              </div>
          </div>
        </Layout>
      )}
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { cookies } = context.req;
  const { query, _id } = context.query;

  const [data, attributes] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      category: _id ? _id : "",
      title: query ? query : "",
    }),

    AttributeServices.getShowingAttributes(),
  ]);

  const popularProducts = data?.products.filter((p) => p.prices.discount < 1);
 

  const discountProducts = data?.products.filter(
    (p) => p?.prices?.discount >= 1
  );

  return {
    props: {
      popularProducts: popularProducts.slice(0, 50),
      discountProducts: discountProducts,
      cookies: cookies,
      attributes,
    },
  };
};

export default Home;
