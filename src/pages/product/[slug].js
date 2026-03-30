import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { FiChevronRight, FiMinus, FiPlus } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
//internal import

import Price from "@component/common/Price";
import Stock from "@component/common/Stock";
import Tags from "@component/common/Tags";
import Layout from "@layout/Layout";
import { notifyError } from "@utils/toast";
import Card from "@component/slug-card/Card";
import useAddToCart from "@hooks/useAddToCart";
import Loading from "@component/preloader/Loading";
import ProductCard from "@component/product/ProductCard";
import VariantList from "@component/variants/VariantList";
import { SidebarContext } from "@context/SidebarContext";
import AttributeServices from "@services/AttributeServices";
import ProductServices from "@services/ProductServices";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Discount from "@component/common/Discount";
import ImageCarousel from "@component/carousel/ImageCarousel";
import useGetSetting from "@hooks/useGetSetting";
import Reviews from "./Reviews/Reviews";
import Cookies from "js-cookie";
import { trackEvent } from "@utils/trackEvent";

const ProductScreen = ({ product, attributes, relatedProduct }) => {
  const router = useRouter();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const { globalSetting } = useGetSetting();
  const { lang, showingTranslateValue, getNumber } = useUtilsFunction();

  const currency = globalSetting?.default_currency || "$";

  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { handleAddItem, item, setItem } = useAddToCart();

  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [value, setValue] = useState("");
  const [price, setPrice] = useState(0);
  const [img, setImg] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectVariant, setSelectVariant] = useState({});
  const [isReadMore, setIsReadMore] = useState(true);
  const [selectVa, setSelectVa] = useState({});
  const [variantTitle, setVariantTitle] = useState([]);
  const [variants, setVariants] = useState([]);

  // ─── WhatsApp number (তোমার নম্বর দাও) ──────────────────────────────────
  const WHATSAPP_NUMBER = "+8801921619808"; // ← এখানে তোমার WhatsApp নম্বর দাও (country code সহ, + ছাড়া)

  useEffect(() => {
    if (Cookies.get("userInfo")) {
      const user = JSON.parse(Cookies.get("userInfo"));
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, []);

  useEffect(() => {
    if (!product?._id) return;

    const eventId =
      "viewcontent_" + product._id + "_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

    if (typeof window !== "undefined" && window.fbq) {
      window.fbq(
        "track",
        "ViewContent",
        {
          content_ids: [product._id],
          content_name: product.title,
          content_type: "product",
          value: product.price,
          currency: "BDT",
        },
        { eventID: eventId }
      );
    }

    trackEvent("ViewContent", {
      event_id: eventId,
      email: email || "",
      phone: phone || "",
      event_source_url: window.location.href,
      value: product.price,
      currency: "BDT",
      items: [
        {
          id: product._id,
          name: product.title || "",
          quantity: 1,
          item_price: product.price,
          price: product.price,
        },
      ],
      content_ids: [product._id],
      content_type: "product",
    });
  }, [product?._id]);

  useEffect(() => {
    if (value) {
      const result = product?.variants?.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      );
      const res = result?.map(
        ({
          originalPrice,
          discount,
          quantity,
          inUse,
          inUseOrder,
          barcode,
          sku,
          productId,
          image,
          ...rest
        }) => ({ ...rest })
      );

      const filterKey = Object.keys(Object.assign({}, ...res));
      const selectVar = filterKey?.reduce(
        (obj, key) => ({ ...obj, [key]: selectVariant[key] }),
        {}
      );
      const newObj = Object.entries(selectVar).reduce(
        (a, [k, v]) => (v ? ((a[k] = v), a) : a),
        {}
      );

      const result2 = result?.find((v) =>
        Object.keys(newObj).every((k) => newObj[k] === v[k])
      );

      if (result.length <= 0 || result2 === undefined) return setStock(0);

      setVariants(result);
      setSelectVariant(result2);
      setSelectVa(result2);
      setImg(result2?.image);
      setStock(result2?.quantity);
      const price = getNumber(result2?.price);
      const originalPrice = getNumber(result2?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPrice - price) / originalPrice) * 100
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(price);
      setOriginalPrice(originalPrice);
    } else if (product?.variants?.length > 0) {
      const result = product?.variants?.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      );

      setVariants(result);
      setStock(product.variants[0]?.quantity);
      setSelectVariant(product.variants[0]);
      setSelectVa(product.variants[0]);
      setImg(product.variants[0]?.image);
      const price = getNumber(product.variants[0]?.price);
      const originalPrice = getNumber(product.variants[0]?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPrice - price) / originalPrice) * 100
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(price);
      setOriginalPrice(originalPrice);
    } else {
      setStock(product?.stock);
      setImg(product?.image[0]);
      const price = getNumber(product?.prices?.price);
      const originalPrice = getNumber(product?.prices?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPrice - price) / originalPrice) * 100
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(price);
      setOriginalPrice(originalPrice);
    }
  }, [
    product?.prices?.discount,
    product?.prices?.originalPrice,
    product?.prices?.price,
    product?.stock,
    product.variants,
    selectVa,
    selectVariant,
    value,
  ]);

  useEffect(() => {
    const res = Object.keys(Object.assign({}, ...product?.variants));
    const varTitle = attributes?.filter((att) => res.includes(att?._id));
    setVariantTitle(varTitle?.sort());
  }, [variants, attributes]);

  useEffect(() => {
    setIsLoading(false);
  }, [product]);

  const handleAddToCart = (p) => {
    if (p.variants.length === 1 && p.variants[0].quantity < 1)
      return notifyError("Insufficient stock");
    if (stock <= 0) return notifyError("Insufficient stock");

    if (
      product?.variants.map(
        (variant) =>
          Object.entries(variant).sort().toString() ===
          Object.entries(selectVariant).sort().toString()
      )
    ) {
      const { variants, categories, description, ...updatedProduct } = product;
      const newItem = {
        ...updatedProduct,
        id: `${
          p.variants.length <= 1
            ? p._id
            : p._id +
              variantTitle
                ?.map((att) => selectVariant[att._id])
                .join("-")
        }`,
        title: `${
          p.variants.length <= 1
            ? showingTranslateValue(product?.title)
            : showingTranslateValue(product?.title) +
              "-" +
              variantTitle
                ?.map(
                  (att) =>
                    att.variants?.find((v) => v._id === selectVariant[att._id])
                )
                .map((el) => showingTranslateValue(el?.name))
        }`,
        image: img,
        variant: selectVariant,
        price: price,
        originalPrice: originalPrice,
      };
      handleAddItem(newItem);

      const eventId =
        "addtocart_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

      if (typeof window !== "undefined" && window.fbq) {
        window.fbq(
          "track",
          "AddToCart",
          {
            value: newItem.price,
            currency: "BDT",
            content_ids: [newItem.id],
            content_type: "product",
            contents: [{ id: newItem.id, quantity: 1, item_price: newItem.price }],
            content_name: newItem.title,
          },
          { eventID: eventId }
        );
      }

      trackEvent("AddToCart", {
        value: newItem.price,
        currency: "BDT",
        email: email || "",
        phone: phone || "",
        event_id: eventId,
        event_source_url: window.location.href,
        items: [
          {
            id: newItem.id,
            name: newItem.title,
            quantity: 1,
            item_price: newItem.price,
            price: newItem.price,
          },
        ],
        content_ids: [newItem.id],
        content_type: "product",
      });
    } else {
      return notifyError("Please select all variant first!");
    }
  };

  // ─── WhatsApp Order Handler ───────────────────────────────────────────────
  const handleWhatsAppOrder = () => {
    const productTitle = showingTranslateValue(product?.title);
    const productUrl = `https://www.mahabubmart.com/product/${router.query.slug}`;
    const message = `🛒 *Order Request*\n\n*Product:* ${productTitle}\n*Price:* ${currency}${price}\n*Link:* ${productUrl}\n\nআমি এই পণ্যটি অর্ডার করতে চাই।`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleChangeImage = (img) => {
    setImg(img);
  };

  const { t } = useTranslation();

  const category_name = showingTranslateValue(product?.category?.name)
    .toLowerCase()
    .replace(/[^A-Z0-9]+/gi, "-");

  // ─── Description: HTML string বের করা ────────────────────────────────────
  const descriptionHtml =
    typeof product?.description === "object"
      ? product?.description[lang] || product?.description?.en || ""
      : product?.description || "";

  const isHtmlDescription = /<[a-z][\s\S]*>/i.test(descriptionHtml);

  // HTML description এর preview (first ~300 chars of text content)
  const HTML_PREVIEW_CHARS = 300;
  const getHtmlPreview = (html) => {
    // strip tags to count visible characters
    const text = html.replace(/<[^>]*>/g, "");
    if (text.length <= HTML_PREVIEW_CHARS) return { preview: html, needsToggle: false };
    // find a safe cut point in the original html
    let visibleCount = 0;
    let cutIndex = 0;
    let inTag = false;
    for (let i = 0; i < html.length; i++) {
      if (html[i] === "<") { inTag = true; }
      if (!inTag) visibleCount++;
      if (html[i] === ">") { inTag = false; }
      if (visibleCount >= HTML_PREVIEW_CHARS) { cutIndex = i + 1; break; }
    }
    return { preview: html.slice(0, cutIndex) + "...", needsToggle: true };
  };
  const { preview: htmlPreview, needsToggle: htmlNeedsToggle } = getHtmlPreview(descriptionHtml);

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout
          title={showingTranslateValue(product?.title)}
          description={showingTranslateValue(product.description)}
        >
          {/* ── Product Description HTML styles ── */}
          <style jsx global>{`
      
            .product-description h1,
            .product-description h2,
            .product-description h3,
            .product-description h4 {
              font-weight: 700;
              margin-bottom: 0.5rem;
              margin-top: 0.75rem;
              color: #1a202c;
              font-family: serif;
            }
            .product-description h3 { font-size: 1.1rem; }
            .product-description p {
              margin-bottom: 0.5rem;
              line-height: 1.7;
              color: #4a5568;
              font-size: 0.875rem;
            }
            .product-description ul,
            .product-description ol {
              padding-left: 1.25rem;
              margin-bottom: 0.75rem;
            }
            .product-description ul { list-style-type: disc; }
            .product-description ol { list-style-type: decimal; }
            .product-description li {
              margin-bottom: 0.3rem;
              font-size: 0.875rem;
              color: #4a5568;
              line-height: 1.6;
            }
            .product-description strong { color: #2d3748; }
            .product-description br { display: none; }
          `}</style>

          <div className="px-0 py-6 lg:py-10">
            <div className="mx-auto px-3 lg:px-10 max-w-screen-2xl">
              {/* Breadcrumb */}
              <div className="flex items-center pb-4">
                <ol className="flex items-center w-full overflow-hidden font-serif">
                  <li className="text-sm pr-1 transition duration-200 ease-in cursor-pointer hover:text-[#1F6BBF] font-semibold">
                    <Link href="/"><a>Home</a></Link>
                  </li>
                  <li className="text-sm mt-[1px]"><FiChevronRight /></li>
                  <li className="text-sm pl-1 transition duration-200 ease-in cursor-pointer hover:text-[#1F6BBF] font-semibold">
                    <Link href={`/search?category=${category_name}&_id=${product?.category?._id}` || "/"}>
                      <button type="button" onClick={() => setIsLoading(!isLoading)}>
                        {category_name}
                      </button>
                    </Link>
                  </li>
                  <li className="text-sm mt-[1px]"><FiChevronRight /></li>
                  <li className="text-sm px-1 transition duration-200 ease-in truncate max-w-[160px] sm:max-w-xs">
                    {showingTranslateValue(product?.title)}
                  </li>
                </ol>
              </div>

              <div className="w-full rounded-lg p-3 lg:p-12 bg-white">
                {/* ── Main product layout ── */}
                <div className="flex flex-col xl:flex-row gap-6">
                  {/* ── Image Section ── */}
                  <div className="w-full mx-auto md:w-6/12 lg:w-5/12 xl:w-4/12 xl:pr-10 flex-shrink-0">
                    <Discount slug={true} product={product} discount={discount} />

                    {product.image[0] ? (
                      <Image
                        src={img || product.image[0]}
                        alt="product"
                        width={650}
                        height={650}
                        priority
                        className="w-full h-auto"
                      />
                    ) : (
                      <Image
                        src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                        width={650}
                        height={650}
                        alt="product Image"
                        className="w-full h-auto"
                      />
                    )}

                    {product.image.length > 1 && (
                      <div className="flex flex-row flex-wrap mt-4 border-t">
                        <ImageCarousel
                          images={product.image}
                          handleChangeImage={handleChangeImage}
                          prevRef={prevRef}
                          nextRef={nextRef}
                        />
                      </div>
                    )}
                  </div>

                  {/* ── Details Section ── */}
                  <div className="w-full">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* ── Left: Info + Actions ── */}
                      <div className="w-full lg:w-2/3 xl:pr-6">
                        <div className="mb-4">
                          <h1 className="leading-7 text-lg md:text-xl lg:text-2xl mb-1 font-semibold font-serif text-gray-800">
                            {showingTranslateValue(product?.title)}
                          </h1>
                          <p className="uppercase font-serif font-medium text-gray-500 text-sm">
                            SKU :{" "}
                            <span className="font-bold text-gray-600">{product.sku}</span>
                          </p>
                          <div className="relative">
                            <Stock stock={stock} />
                          </div>
                        </div>

                        <Price
                          price={price}
                          product={product}
                          currency={currency}
                          originalPrice={originalPrice}
                        />

                        {/* Variants */}
                        <div className="mb-4">
                          {variantTitle?.map((a, i) => (
                            <span key={i + 1}>
                              <h4 className="text-sm py-1">
                                {showingTranslateValue(a?.name)}:
                              </h4>
                              <div className="flex flex-row flex-wrap mb-3">
                                <VariantList
                                  att={a._id}
                                  lang={lang}
                                  option={a.option}
                                  setValue={setValue}
                                  varTitle={variantTitle}
                                  setSelectVa={setSelectVa}
                                  variants={product.variants}
                                  selectVariant={selectVariant}
                                  setSelectVariant={setSelectVariant}
                                />
                              </div>
                            </span>
                          ))}
                        </div>

                        {/* ── Description (HTML render with toggle) ── */}
                        <div className="mb-4">
                          {isHtmlDescription ? (
                            <div>
                              <div
                                className="product-description text-sm leading-6 text-gray-500"
                                dangerouslySetInnerHTML={{
                                  __html: isReadMore ? htmlPreview : descriptionHtml,
                                }}
                              />
                              {htmlNeedsToggle && (
                                <span
                                  onClick={() => setIsReadMore(!isReadMore)}
                                  className="read-or-hide cursor-pointer text-[#1F6BBF] font-semibold text-sm mt-1 inline-block hover:underline"
                                >
                                  {isReadMore ? t("common:moreInfo") : t("common:showLess")}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm leading-6 text-gray-500 md:leading-7">
                              {isReadMore
                                ? showingTranslateValue(product?.description)?.slice(0, 230)
                                : showingTranslateValue(product?.description)}
                              <br />
                              {Object?.keys(product?.description)?.includes(lang)
                                ? product?.description[lang]?.length > 230 && (
                                    <span
                                      onClick={() => setIsReadMore(!isReadMore)}
                                      className="read-or-hide cursor-pointer text-[#1F6BBF] font-semibold text-sm mt-1 inline-block hover:underline"
                                    >
                                      {isReadMore ? t("common:moreInfo") : t("common:showLess")}
                                    </span>
                                  )
                                : product?.description?.en?.length > 230 && (
                                    <span
                                      onClick={() => setIsReadMore(!isReadMore)}
                                      className="read-or-hide cursor-pointer text-[#1F6BBF] font-semibold text-sm mt-1 inline-block hover:underline"
                                    >
                                      {isReadMore ? t("common:moreInfo") : t("common:showLess")}
                                    </span>
                                  )}
                            </div>
                          )}
                        </div>

                        {/* ── Add to Cart + WhatsApp ── */}
                        <div className="flex flex-col gap-3 mt-4">
                          {/* Quantity + Add to Cart */}
                          <div className="flex items-center gap-2 sm:gap-3">
                            {/* Quantity control */}
                            <div className="group flex items-center justify-between rounded-md overflow-hidden flex-shrink-0 border h-11 md:h-12 border-gray-300">
                              <button
                                onClick={() => setItem(item - 1)}
                                disabled={item === 1}
                                className="flex items-center justify-center flex-shrink-0 h-full transition ease-in-out duration-300 focus:outline-none w-8 md:w-12 text-heading border-e border-gray-300 hover:text-gray-500"
                              >
                                <span className="text-dark text-base"><FiMinus /></span>
                              </button>
                              <p className="font-semibold flex items-center justify-center h-full cursor-default flex-shrink-0 text-base text-heading w-8 md:w-20 xl:w-24">
                                {item}
                              </p>
                              <button
                                onClick={() => setItem(item + 1)}
                                disabled={selectVariant?.quantity <= item}
                                className="flex items-center justify-center h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-8 md:w-12 text-heading border-s border-gray-300 hover:text-gray-500"
                              >
                                <span className="text-dark text-base"><FiPlus /></span>
                              </button>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none text-white px-4 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-4 hover:text-white bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] hover:from-[#155a9e] hover:via-[#1e88c8] hover:to-[#0090c2] flex-1 h-11 md:h-12"
                            >
                              {t("common:addToCart")}
                            </button>
                          </div>

                          {/* WhatsApp Order Button */}
                          <button
                            onClick={handleWhatsAppOrder}
                            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-md font-semibold font-serif text-sm text-white transition ease-in-out duration-300 bg-[#25D366] hover:bg-[#1ebe5d] h-11 md:h-12"
                          >
                            <FaWhatsapp size={20} />
                            <span>Order on WhatsApp</span>
                          </button>
                        </div>

                        {/* Category & Tags */}
                        <div className="flex flex-col mt-4">
                          <span className="font-serif font-semibold py-1 text-sm d-block">
                            <span className="text-gray-800">{t("common:category")}:</span>{" "}
                            <Link href={`/search?category=${category_name}&_id=${product?.category?._id}` || ""}>
                              <button
                                type="button"
                                className="text-gray-600 font-serif font-medium underline ml-2 hover:text-[#1F6BBF]"
                                onClick={() => setIsLoading(!isLoading)}
                              >
                                {category_name}
                              </button>
                            </Link>
                          </span>
                          {/* Tags swiper — horizontal scroll, no overflow */}
                          <div className="tags-swiper flex flex-row gap-2 mt-2 overflow-x-auto pb-1">
                            <Tags product={product} />
                          </div>
                        </div>

                        {/* Social Share */}
                        <div className="mt-6">
                          <h3 className="text-base font-semibold mb-1 font-serif">
                            {t("common:shareYourSocial")}
                          </h3>
                          <p className="font-sans text-sm text-gray-500">
                            {t("common:shareYourSocialText")}
                          </p>
                          <ul className="flex flex-wrap gap-2 mt-4">
                            {[
                              { Btn: FacebookShareButton, Icon: FacebookIcon },
                              { Btn: TwitterShareButton, Icon: TwitterIcon },
                              { Btn: RedditShareButton, Icon: RedditIcon },
                              { Btn: WhatsappShareButton, Icon: WhatsappIcon },
                              { Btn: LinkedinShareButton, Icon: LinkedinIcon },
                            ].map(({ Btn, Icon }, idx) => (
                              <li key={idx} className="flex items-center text-center border border-gray-100 rounded-full hover:bg-[#1F6BBF] transition ease-in-out duration-500">
                                <Btn
                                  url={`https://www.mahabubmart.com/product/${router.query.slug}`}
                                  quote=""
                                >
                                  <Icon size={32} round />
                                </Btn>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* ── Right: Shipping Card ── */}
                      <div className="w-full lg:w-5/12">
                        <div className="mt-0 bg-gray-50 border border-gray-100 p-4 lg:p-8 rounded-lg">
                          <Card />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <Reviews product={product} />
                </div>
              </div>

              {/* Related Products */}
              {relatedProduct?.length >= 2 && (
                <div className="pt-10 lg:pt-20 lg:pb-10">
                  <h3 className="leading-7 text-lg lg:text-xl mb-3 font-semibold font-serif hover:text-gray-600">
                    {t("common:relatedProducts")}
                  </h3>
                  <div className="flex">
                    <div className="w-full">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                        {relatedProduct?.slice(1, 13).map((product, i) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            attributes={attributes}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Layout>
      )}
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { slug } = context.params;

  const [data, attributes] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      category: "",
      slug: slug,
    }),
    AttributeServices.getShowingAttributes({}),
  ]);

  let product = {};
  if (slug) {
    product = data?.products?.find((p) => p.slug === slug);
  }

  return {
    props: {
      product,
      relatedProduct: data?.relatedProduct,
      attributes,
    },
  };
};

export default ProductScreen;