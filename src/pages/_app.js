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
import Cookies from "js-cookie";
import { trackEvent } from "@utils/trackEvent";
const stripePromise = getStripe();

let persistor = persistStore(store);

function MyApp({ Component, pageProps }) {

 const router = useRouter();
  const [email, setEmail] = useState(null);
  const [phone, setPhone] = useState(null);

  // get user from cookie once
  useEffect(() => {
    if (Cookies.get("userInfo")) {
      const user = JSON.parse(Cookies.get("userInfo"));
      setEmail(user.email || null);
      setPhone(user.phone || null);
    }
  }, []);

  useEffect(() => {
    const handlePageView = () => {
      const product = pageProps.product || null;

      const contents = product
        ? [
            {
              id: product._id.toString(),
              quantity: 1,
              item_price: product.price || 0,
            },
          ]
        : [];

      const content_ids = product ? [product._id.toString()] : [];

      const pageViewData = {
        event_id: Date.now().toString(), // unique per pageview
        email, // hashed server-side in backend
        phone, // hashed server-side
        value: product?.price || 0,
        currency: "BDT",
        content_ids,
        contents,
        content_type: product ? "product" : "other",
        items: product
          ? [
              {
                item_id: product._id.toString(),
                item_name: product.name,
                quantity: 1,
                price: product.price || 0,
              },
            ]
          : [],
        page_path: router.asPath,
      };

      // backend call: IP and user-agent handled server-side
      trackEvent("PageView", pageViewData);
    };

    // initial load
    handlePageView();

    // route changes
    router.events.on("routeChangeComplete", handlePageView);
    return () => router.events.off("routeChangeComplete", handlePageView);
  }, [router.events, email, phone, pageProps.product, router.asPath]);

  return (
    <>
    
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
