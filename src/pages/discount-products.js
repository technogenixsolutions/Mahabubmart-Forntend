// src/pages/products.js
import { SidebarContext } from "@context/SidebarContext";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

//internal import
import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";

import Loading from "@component/preloader/Loading";
import ProductServices from "@services/ProductServices";
import ProductCard from "@component/product/ProductCard";

import AttributeServices from "@services/AttributeServices";
import CMSkeleton from "@component/preloader/CMSkeleton";

const DiscountProductsPage = ({ initialProducts, attributes,  }) => {
  const router = useRouter();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { loading, error, storeCustomizationSetting } = useGetSetting();

  const [products, setProducts] = useState(initialProducts || []);
  const [page, setPage] = useState(1);
  const [limit] = useState(15); // 15 products per page
  const [loadingMore, setLoadingMore] = useState(false);
  const [priceSort, setPriceSort] = useState(""); // low / high

  useEffect(() => {
    setIsLoading(false);
  }, [router, setIsLoading]);

  // Load more products
  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await ProductServices.getDiscountedProducts({
        page: nextPage,
        limit,
        price: priceSort,
      });
      setProducts([...products, ...data.products]);
      setPage(nextPage);
    } catch (err) {
      console.error("Failed to load more products:", err);
    }
    setLoadingMore(false);
  };

  // Handle sorting change
  const handleSortChange = async (e) => {
    const sortValue = e.target.value;
    setPriceSort(sortValue);
    setPage(1);
    setLoadingMore(true);
    try {
      const data = await ProductServices.getDiscountedProducts({
        page: 1,
        limit,
        price: sortValue,
      });
      setProducts(data.products);
    } catch (err) {
      console.error("Failed to sort products:", err);
    }
    setLoadingMore(false);
  };

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout>
          <div className="min-h-screen">
            {/* Header */}
            <div className="bg-gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10">
              <div className="mb-10 flex justify-center">
                <div className="text-center w-full lg:w-2/5">
                  <h2 className="text-xl lg:text-2xl mb-2 font-serif font-semibold">
                    <CMSkeleton
                      count={1}
                      height={30}
                      loading={loading}
                      data={
                     storeCustomizationSetting?.home?.latest_discount_title ||
                        "All Discounted Products"
                      }
                    />
                  </h2>
                  <p className="text-base font-sans text-gray-600 leading-6">
                    "Explore our latest discounted products and grab the best deals before they're gone!"
                  </p>
                </div>
              </div>

              {/* Sorting */}
              <div className="flex justify-end mb-4">
                <select
                  className="border px-3 py-2 rounded"
                  value={priceSort}
                  onChange={handleSortChange}
                >
                  <option value="">Sort by</option>
                  <option value="low">Low to High</option>
                  <option value="high">High to Low</option>
                </select>
              </div>

              {/* Products Grid */}
              <div className="flex">
                <div className="w-full">
                  {loading ? (
                    <CMSkeleton count={20} height={20} loading={loading} error={error} />
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                      {products.map((product) => (
                        <ProductCard
                          key={product._id}
                          product={product}
                          attributes={attributes}
                        />
                      ))}
                    </div>
                  )}

                  {/* Load More Button */}
                  {products.length >= limit && (
                    <div className="flex justify-center mt-6">
                      <button
                        className={`px-6 py-2 bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] hover:from-[#155a9e] hover:via-[#1e88c8] hover:to-[#0090c2] transition-all focus:outline-none text-white rounded font-semibold ${
                          loadingMore ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                      >
                        {loadingMore ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Layout>
      )}
    </>
  );
};

// Server Side Props
export const getServerSideProps = async (context) => {
  const [data, attributes] = await Promise.all([
    ProductServices.getDiscountedProducts({ page: 1, limit: 15 }),
    AttributeServices.getShowingAttributes(),
  ]);

  return {
    props: {
      initialProducts: data?.products || [],
      attributes,
    },
  };
};

export default DiscountProductsPage;
