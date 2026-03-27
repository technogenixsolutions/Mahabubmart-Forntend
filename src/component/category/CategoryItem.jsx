import { useRouter } from "next/router";
import { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const CategoryItem = ({ item, level = 0 }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const label =
    typeof item?.name === "object"
      ? item.name.en || item.name.bd || Object.values(item.name)[0] || ""
      : item?.name || "";

  const hasChildren = Array.isArray(item?.children) && item.children.length > 0;

  const handleRoute = () => {
    const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    router.push(`/search?category=${slug}&_id=${item._id}`);
  };

  return (
    <div className="w-full">

      {/* ── ITEM ROW ── */}
      <div
        onClick={() => {
          if (hasChildren) {
            setOpen((prev) => !prev);
          } else {
            handleRoute();
          }
        }}
        className="flex justify-between items-center py-2 pr-4 text-sm cursor-pointer
                   hover:bg-gray-100 hover:text-[#1F6BBF] rounded select-none transition-colors duration-150"
        style={{ paddingLeft: `${level * 14 + 16}px` }}
      >
        <span className="font-serif">{label}</span>

        {hasChildren && (
          <span className="text-gray-400 transition-transform duration-200">
            {open ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
          </span>
        )}
      </div>

      {/* ── ACCORDION: সব screen এ নিচে নিচে expand ── */}
      {hasChildren && open && (
        <div className="border-l-2 border-gray-200 ml-4">
          {item.children.map((child) => (
            <CategoryItem key={child._id} item={child} level={level + 1} />
          ))}
        </div>
      )}

    </div>
  );
};

export default CategoryItem;