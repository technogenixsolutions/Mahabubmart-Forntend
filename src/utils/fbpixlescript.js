// utils/fbpixlescript.js
import Script from "next/script";

const FB_PIXEL_ID = "1759892261652978";

export const FbPixel = () => (
  <Script
    id="fb-pixel"
    strategy="afterInteractive"
    crossOrigin="anonymous"
    onLoad={() => {
      // ✅ Script load হওয়ার পর window এ flag set করো
      window._fbPixelReady = true;
      // ✅ Pending event থাকলে fire করো
      if (window._pendingPageView) {
        const { eventID, url } = window._pendingPageView;
        window.fbq("track", "PageView", {}, { eventID });
        window._pendingPageView = null;
      }
    }}
  >
    {`
      !function(f,b,e,v,n,t,s){
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)
      }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

      fbq('init', '${FB_PIXEL_ID}');
      // ❌ PageView এখানে fire করব না
    `}
  </Script>
);