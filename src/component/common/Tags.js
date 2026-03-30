const Tags = ({ product }) => {
  return (
    <>
      {product?.tag?.length !== 0 && (
        <div className="flex flex-row flex-wrap">
          {JSON.parse(product?.tag).map((t, i) => (
            <span
              key={i + 1}
              className="bg-gray-50 mr-2 border-0 text-gray-600 inline-flex items-center justify-center px-3 py-1 text-xs font-semibold font-serif mt-2 whitespace-nowrap"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </>
  );
};

export default Tags;