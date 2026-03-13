import useTranslation from "next-translate/useTranslation";

const Stock = ({ stock, card }) => {
  const { t } = useTranslation();

  return (
    <>
      {stock <= 0 ? (
        <span className="bg-red-100 absolute z-10 text-red-500 dark:text-red-400 rounded-full inline-flex items-center justify-center px-2 py-0 text-xs font-medium font-serif">
          {/* Stock Out */}
          {t("common:stockOut")}
        </span>
      ) : (
        <>
          <span
            className={`${
              card
                ? "bg-gray-100 absolute z-10 text-emerald-500 rounded-full text-xs px-2 py-0 font-medium"
                : "bg-emerald-100 text-emerald-500 rounded-full inline-flex items-center justify-center px-2 py-0 text-xs font-semibold font-serif"
            }`}
          >
            {t("common:stock")} :
            <span className="text-red-500 dark:text-red-400  pl-1 font-bold">
              {stock}{" "}
            </span>
          </span>
        </>
      )}
    </>
  );
};

export default Stock;
