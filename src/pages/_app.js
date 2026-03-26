import "@styles/custom.css";
import { CartProvider } from "react-use-cart";
import { Elements } from "@stripe/react-stripe-js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";
//internal import
import store from "@redux/store";
import getStripe from "@utils/stripe";
import { UserProvider } from "@context/UserContext";
import DefaultSeo from "@component/common/DefaultSeo";
import { SidebarProvider } from "@context/SidebarContext";
import { FbPixel } from "@utils/fbpixlescript";
import { trackEvent } from "@utils/trackEvent";
const stripePromise = getStripe();

let persistor = persistStore(store);

function MyApp({ Component, pageProps }) {


   const router = useRouter();

useEffect(() => {
    // function to send PageView to backend
    const handlePageView = () => {
      const pageViewData = {
        event_id: Date.now().toString(), // unique per pageview
        email: pageProps.user?.email || null,
        phone: pageProps.user?.phone || null,
        value: 0,
        content_ids: pageProps.product ? [pageProps.product._id] : [],
        items: pageProps.product
          ? [
              {
                item_id: pageProps.product.id,
                item_name: pageProps.product.name,
                price: pageProps.product.price,
                quantity: 1,
              },
            ]
          : [],
        page_path: router.asPath,
      };

      // call backend CAPI
      trackEvent("PageView", pageViewData);
    };

    // initial load
    handlePageView();

    // route change
    router.events.on("routeChangeComplete", handlePageView);
    return () => {
      router.events.off("routeChangeComplete", handlePageView);
    };
  }, [router.events, pageProps.user, pageProps.product, router.asPath]);
  return (
    <>
      <FbPixel />
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <UserProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <SidebarProvider>
                <Elements stripe={stripePromise}>
                  <CartProvider>
                    <DefaultSeo />
                    <Component {...pageProps} />
                  </CartProvider>
                </Elements>
              </SidebarProvider>
            </PersistGate>
          </Provider>
        </UserProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default MyApp;
