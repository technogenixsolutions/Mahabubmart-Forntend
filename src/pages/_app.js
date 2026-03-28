import "@styles/custom.css";
import { CartProvider } from "react-use-cart";
import { Elements } from "@stripe/react-stripe-js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // ✅ User info cookie থেকে নাও
  useEffect(() => {
    try {
      const cookie = Cookies.get("userInfo");
      if (cookie) {
        const user = JSON.parse(cookie);
        setEmail(user.email || "");
        setPhone(user.phone || "");
      }
    } catch (e) {}
  }, []);

  // ✅ PageView tracking
  useEffect(() => {
    const handlePageView = () => {
      const newEventId =
        "pageview_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

      // 🔹 Server CAPI + GA4
      trackEvent("PageView", {
        event_id: newEventId,
        email: email || "",
        phone: phone || "",
        value: 0,
        items: [],
        event_source_url: window.location.href,
      });

      // 🔹 Browser Pixel
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "PageView", {}, { eventID: newEventId });
      }
    };

    handlePageView();

    router.events.on("routeChangeComplete", handlePageView);
    return () => {
      router.events.off("routeChangeComplete", handlePageView);
    };
  }, [router.events, email, phone]);

  return (
    <>
      {/* ✅ eventId prop সরিয়ে দিলাম */}
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