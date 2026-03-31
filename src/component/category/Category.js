import {useContext} from "react";
import Link from "next/link";
import Image from "next/image";
import {IoClose} from "react-icons/io5";

//internal import
import {pages} from "@utils/data";
import useAsync from "@hooks/useAsync";
import Loading from "@component/preloader/Loading";
import {SidebarContext} from "@context/SidebarContext";
import CategoryServices from "@services/CategoryServices";
import CategoryCard from "@component/category/CategoryCard";
import useUtilsFunction from "@hooks/useUtilsFunction";
import CategoryItem from "./CategoryItem";

const Category = () => {
  const {categoryDrawerOpen, closeCategoryDrawer} = useContext(SidebarContext);
  const {showingTranslateValue} = useUtilsFunction();
  const {data, loading, error} = useAsync(() =>
    CategoryServices.getShowingCategory()
  );

  

  return (
    <div className="flex flex-col w-full h-full bg-white cursor-pointer scrollbar-hide">
      {categoryDrawerOpen && (
        <div className="w-full flex justify-between items-center h-16 px-6 py-4 bg-[#161616] text-white border-b border-gray-100">
          <h2 className="font-semibold font-serif text-lg m-0 text-heading flex align-center">
            <Link href="/">
            
                <Image
             
     src="https://res.cloudinary.com/dgwwhniph/image/upload/v1773404263/Gemini_Generated_Image_kk11j3kk11j3kk11_1_je0nc7.png"
  alt="mahabubmart"
  width={190}
  height={60}
  className="object-contain brightness-0 invert"
  priority
  
                />
           
            </Link>
          </h2>
          <button
            onClick={closeCategoryDrawer}
            className="flex text-xl items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-red-500 p-2 focus:outline-none transition-opacity hover:text-red-600"
            aria-label="close">
            <IoClose />
          </button>
        </div>
      )}
      <div className="w-full max-h-full">
        {categoryDrawerOpen && (
          <h2 className="font-semibold font-serif text-lg m-0 text-heading flex align-center border-b px-8 py-3">
            All Categories
          </h2>
        )}
        {error ? (
          <p className="flex justify-center align-middle items-center m-auto text-xl text-red-500">
            <span> {error}</span>
          </p>
        ) : data.length === 0 ? (
          <Loading loading={loading} />
        ) : (
          <div className="relative ">
            {/* {data[0]?.children?.map((category) => (
              <CategoryCard
                key={category._id}
                id={category._id}
                icon={category.icon}
                nested={category.children}
                title={showingTranslateValue(category?.name)}
              />
            ))} */}

               <div className="p-4">
          {data[0]?.children?.map((category) => (
            <CategoryItem key={category._id} item={category} />
          ))}
        </div>
          </div>
        
        )}

        {categoryDrawerOpen && (
          <div className="relative grid gap-2 mt-5">
            <h3 className="font-semibold font-serif text-lg m-0 text-heading flex align-center border-b px-8 py-3">
              Pages
            </h3>
            
            <div className="relative grid gap-1 p-6">
               
              {pages?.map((item) => (
                <a
                  key={item.title || "/"}
                  href={item.href || "/"}
                  className="p-2 flex font-serif items-center rounded-md hover:bg-gray-50 w-full hover:text-[#1F6BBF]">
                  <item.icon
                    className="flex-shrink-0 h-4 w-4"
                    aria-hidden="true"
                  />
                  <p className="inline-flex items-center justify-between ml-2 text-sm font-medium w-full hover:text-[#1F6BBF]">
                    {item.title}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
