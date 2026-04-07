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
import { use } from "react";


const stripePromise = getStripe();
let persistor = persistStore(store);

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // ✅ initial PageView একবারই হবে
  const initialTracked = useRef(false);
  
  // email/phone ref — useEffect এ stale closure এড়াতে
  const emailRef = useRef("");
  const phoneRef = useRef("");

  useEffect(() => {
    try {
      const cookie = Cookies.get("userInfo");
    
      if (cookie) {
        const user = JSON.parse(cookie);
        console.log(user)
        emailRef.current = user.email || "";
        phoneRef.current = user.phone || "";
        setEmail(user.email || "");
        setPhone(user.phone || "");
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const handlePageView = () => {
      const newEventId =
        "pageview_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

      trackEvent("PageView", {
        event_id: newEventId,
        email: emailRef.current || "",
        phone: phoneRef.current || "",
        value: 0,
        items: [],
        event_source_url: window.location.href,
      });

      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "PageView", {}, { eventID: newEventId });
      }
    };

    // ✅ Initial load একবারই
    if (!initialTracked.current) {
      initialTracked.current = true;
      handlePageView();
    }

    // ✅ Route change এ normally fire হবে
    router.events.on("routeChangeComplete", handlePageView);
    return () => {
      router.events.off("routeChangeComplete", handlePageView);
    };
  }, [router.events]); // ✅ email/phone dependency সরিয়ে দিলাম

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