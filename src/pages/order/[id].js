import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { IoCloudDownloadOutline, IoPrintOutline } from "react-icons/io5";
import ReactToPrint from "react-to-print";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// internal imports
import Layout from "@layout/Layout";
import useGetSetting from "@hooks/useGetSetting";
import Invoice from "@component/invoice/Invoice";
import Loading from "@component/preloader/Loading";
import { UserContext } from "@context/UserContext";
import OrderServices from "@services/OrderServices";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Order = ({ params }) => {
  const printRef = useRef();
  const orderId = params.id;

  const router = useRouter();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const {
    state: { userInfo },
  } = useContext(UserContext);
  const { showingTranslateValue, getNumberTwo } = useUtilsFunction();
  const { storeCustomizationSetting, globalSetting } = useGetSetting();

  // Fetch order data
  useEffect(() => {
    (async () => {
      try {
        const res = await OrderServices.getOrderById(orderId);
        setData(res);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log("err", err.message);
      }
    })();

    if (!userInfo) {
      router.push("/");
    }
  }, []);

  // Handle PDF download using jsPDF + html2canvas
  const handleDownloadPDF = () => {
    const invoice = document.getElementById("invoice");
    if (!invoice) return;

    html2canvas(invoice).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 595, 842); // A4 size
      pdf.save("Invoice.pdf");
    });
  };

  return (
    <Layout title="Invoice" description="order confirmation page">
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <div className="max-w-screen-2xl mx-auto py-10 px-3 sm:px-6">
          {/* Greeting Message */}
          <div className="bg-emerald-100 rounded-md mb-5 px-4 py-3">
            <label>
              {showingTranslateValue(
                storeCustomizationSetting?.dashboard?.invoice_message_first
              )}{" "}
              <span className="font-bold text-emerald-600">
                {data?.user_info?.name},
              </span>{" "}
              {showingTranslateValue(
                storeCustomizationSetting?.dashboard?.invoice_message_last
              )}
            </label>
          </div>

          {/* Invoice Container */}
          <div className="bg-white rounded-lg shadow-sm">
            <div id="invoice">
              <Invoice
                data={data}
                printRef={printRef}
                globalSetting={globalSetting}
                currency={globalSetting?.default_currency || "$"}
              />
            </div>

            {/* Buttons */}
            <div className="bg-white p-8 rounded-b-xl">
              <div className="flex lg:flex-row md:flex-row sm:flex-row flex-col justify-between invoice-btn">
                
                {/* Download PDF Button */}
                <button
                  onClick={handleDownloadPDF}
                  className="mb-3 sm:mb-0 md:mb-0 lg:mb-0 flex items-center justify-center bg-emerald-500 text-white transition-all font-serif text-sm font-semibold h-10 py-2 px-5 rounded-md"
                >
                  {showingTranslateValue(
                    storeCustomizationSetting?.dashboard?.download_button
                  )}{" "}
                  <span className="ml-2 text-base">
                    <IoCloudDownloadOutline />
                  </span>
                </button>

                {/* Print Button */}
                <ReactToPrint
                  trigger={() => (
                    <button className="mb-3 sm:mb-0 md:mb-0 lg:mb-0 flex items-center justify-center bg-emerald-500 text-white transition-all font-serif text-sm font-semibold h-10 py-2 px-5 rounded-md">
                      {showingTranslateValue(
                        storeCustomizationSetting?.dashboard?.print_button
                      )}{" "}
                      <span className="ml-2">
                        <IoPrintOutline />
                      </span>
                    </button>
                  )}
                  content={() => printRef.current}
                  documentTitle="Invoice"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

// Pass params from getServerSideProps
export const getServerSideProps = ({ params }) => {
  return {
    props: { params },
  };
};

// Disable SSR for this page to avoid issues
export default dynamic(() => Promise.resolve(Order), { ssr: false });
