import "@styles/custom.css";
import { CartProvider } from "react-use-cart";
import { Elements } from "@stripe/react-stripe-js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import { useEffect, useRef, useState } from "react";
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
  const initialTracked = useRef(false);

  // user info refs
  const emailRef = useRef("");
  const phoneRef = useRef("");

  // Load user info from cookie
  useEffect(() => {
    try {
      const cookie = Cookies.get("userInfo");
      if (cookie) {
        const user = JSON.parse(cookie);
        emailRef.current = user.email || "";
        phoneRef.current = user.phone || "";
      }
    } catch (e) {
      console.warn("Error parsing userInfo cookie", e);
    }
  }, []);

  useEffect(() => {
    const handlePageView = () => {
      if (typeof window === "undefined") return;

      const newEventId = "pageview_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
      const fbp = document.cookie.match(/_fbp=([^;]+)/)?.[1] || "";
      const fbc = document.cookie.match(/_fbc=([^;]+)/)?.[1] || "";

      // Server-side + Browser-side
      trackEvent("PageView", {
        event_id: newEventId,
        email: emailRef.current,
        phone: phoneRef.current,
        fbp,
        fbc,
        value: 0,
        items: [],
        event_source_url: window.location.href,
      });

      if (window.fbq) {
        window.fbq("track", "PageView", {}, { eventID: newEventId });
      }
    };

    // ✅ Initial load (deduplicate using ref)
    if (!initialTracked.current) {
      initialTracked.current = true;
      handlePageView();
    }

    // ✅ Route change: fire new PageView
    router.events.on("routeChangeComplete", handlePageView);
    return () => {
      router.events.off("routeChangeComplete", handlePageView);
    };
  }, [router.events]);

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