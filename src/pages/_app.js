import "@styles/custom.css";
import { CartProvider } from "react-use-cart";
import { Elements } from "@stripe/react-stripe-js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
//internal import
import store from "@redux/store";
import getStripe from "@utils/stripe";
import { UserProvider } from "@context/UserContext";
import DefaultSeo from "@component/common/DefaultSeo";
import { SidebarProvider } from "@context/SidebarContext";
import Cookies from "js-cookie";
import { trackEvent } from "@utils/trackEvent";
import { FbPixel } from "@utils/fbpixlescript";
const stripePromise = getStripe();

let persistor = persistStore(store);

function MyApp({ Component, pageProps }) {

const router = useRouter();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [eventId, setEventId] = useState(Date.now().toString());
  useEffect(() => {
    if (Cookies.get("userInfo")) {
      const user = JSON.parse(Cookies.get("userInfo"));
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, []);

  useEffect(() => {
    const handlePageView = () => {

      const newEventId = Date.now().toString() + Math.floor(Math.random() * 1000);
      setEventId(newEventId);
      const pageViewData = {
        event_id: newEventId,
        email: email || "",
        phone: phone || "",
        value: 0,
        items: pageProps.product
          ? [
              {
                id: pageProps.product._id,
                name: pageProps.product.name,
                quantity: 1,
                item_price: pageProps.product.price,
              },
            ]
          : [],
        page_path: router.asPath,
      };
      trackEvent("PageView", pageViewData);

        // Send event to Pixel (deduplicated)
      if (typeof fbq === "function") {
        fbq("track", "PageView", { event_id: newEventId });
      }
    
    };

    handlePageView();
    router.events.on("routeChangeComplete", handlePageView);
    return () => router.events.off("routeChangeComplete", handlePageView);
  }, [router.events, email, phone, pageProps.product, router.asPath]);

  return (
    <>

    <FbPixel eventId={eventId}/> 
    
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
