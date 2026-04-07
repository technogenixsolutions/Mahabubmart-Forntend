// utils/fbpixlescript.js
import Script from "next/script";

const FB_PIXEL_ID = "1759892261652978";

export const FbPixel = () => (
  <Script
    id="fb-pixel"
    strategy="afterInteractive"
    crossOrigin="anonymous"
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
      
      // ✅ Script নিজেই pending event check করবে
      window._fbPixelReady = true;
      if (window._pendingPageView) {
        var p = window._pendingPageView;
        fbq('track', 'PageView', {}, { eventID: p.eventID });
        window._pendingPageView = null;
      }
    `}
  </Script>
);