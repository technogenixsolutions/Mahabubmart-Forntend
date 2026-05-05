import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { useCart } from "react-use-cart";
import { IoBagCheckOutline, IoClose, IoBagHandle } from "react-icons/io5";

//internal import
import CartItem from "@component/cart/CartItem";
import LoginModal from "@component/modal/LoginModal";
import { UserContext } from "@context/UserContext";
import { SidebarContext } from "@context/SidebarContext";
import SettingServices from "@services/SettingServices";
import useAsync from "@hooks/useAsync";
import OrderNowModal from "./OrderNowModal";
import { initiateCheckout } from "@utils/fbCheckout";

const Cart = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const { isEmpty, items, cartTotal } = useCart();
  const { toggleCartDrawer, closeCartDrawer } = useContext(SidebarContext);
  const { data: globalSetting } = useAsync(SettingServices.getGlobalSetting);
 

const [pendingCheckout, setPendingCheckout] = useState(false);
  const currency = globalSetting?.default_currency || "৳"

  const {
    state: { userInfo },
  } = useContext(UserContext);

  const handleOpenLogin = () => {
    if (router.push("/?redirect=/checkout")) {
      toggleCartDrawer();
      setModalOpen(!modalOpen);
    }
  };

  const orderNowButton = (
  <button
    onClick={ () => {


     closeCartDrawer();
    router.push("/cod"); // 🔹 Redirect to COD page
    }}
    className="w-full mb-3 py-3 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 
    flex items-center justify-center text-sm sm:text-base text-white 
    font-medium font-serif transition duration-300"
  >
    🛒 Order Now (Cash on Delivery)
  </button>
);
const handleCheckout = async () => {
  if (!userInfo) {
    setPendingCheckout(true); // 🔥 mark as pending
    handleOpenLogin();
    return;
  }

  // 🔹 Call InitiateCheckout FIRST
  await initiateCheckout(
    { cart: items, total: cartTotal },
    userInfo
  );

  closeCartDrawer();
  router.push("/checkout");
};

 // 🔥 CHECKOUT BUTTON (MAIN FIX)
const checkoutButton = (
  <button
    onClick={handleCheckout}
    className="w-full py-3 px-3 rounded-lg bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] 
    hover:from-[#155a9e] hover:via-[#1e88c8] hover:to-[#0090c2] 
    flex items-center justify-between text-sm sm:text-base text-white transition duration-300"
  >
    <span className="font-medium font-serif">
      Proceed To Checkout
    </span>

    <span className="rounded-lg font-bold font-serif py-2 px-3 bg-white text-[#1F6BBF]">
      {currency}
      {cartTotal.toFixed(2)}
    </span>
  </button>
);


useEffect(() => {
  if (userInfo && pendingCheckout) {
    // 🔥 After login → run checkout flow
    const runCheckout = async () => {
      await initiateCheckout(
        { cart: items, total: cartTotal },
        userInfo
      );

      setPendingCheckout(false);
      closeCartDrawer();
      router.push("/checkout");
    };

    runCheckout();
  }
}, [userInfo, pendingCheckout]);

  return (
    <>
   
      {modalOpen && (
        <LoginModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      )}
      <div className="flex flex-col w-full h-full justify-between items-middle bg-white rounded cursor-pointer">
        <div className="w-full flex justify-between items-center relative px-5 py-4 border-b bg-indigo-50 border-gray-100">
          <h2 className="font-semibold font-serif text-lg m-0 text-heading flex items-center">
            <span className="text-xl mr-2 mb-1">
              <IoBagCheckOutline />
            </span>
            Shopping Cart
          </h2>
          <button
            onClick={closeCartDrawer}
            className="inline-flex text-base items-center justify-center text-gray-500 p-2 focus:outline-none transition-opacity hover:text-red-400"
          >
            <IoClose />
            <span className="font-sens text-sm text-gray-500 hover:text-red-400 ml-1">
              Close
            </span>
          </button>
        </div>
    {/* CART ITEMS */}
        <div className="overflow-y-scroll flex-grow scrollbar-hide w-full">
          {isEmpty && (
            <div className="flex flex-col h-full justify-center items-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                <IoBagHandle className="text-4xl text-[#1F6BBF]" />
              </div>

              <h3 className="font-serif text-gray-700 text-lg pt-5">
                Your cart is empty
              </h3>

              <p className="text-sm text-gray-500 pt-2 text-center px-10">
                No items added in your cart.
              </p>
            </div>
          )}

          {items?.map((item, i) => (
            <CartItem key={i} item={item} />
          ))}
        </div>

        {/* FOOTER BUTTONS */}
        <div className="mx-5 my-3">
          {items.length > 0 && orderNowButton}

          {items.length > 0 && checkoutButton}

          {items.length <= 0 && checkoutButton}
        </div>
      </div>
    </>
  );
};

export default Cart;
