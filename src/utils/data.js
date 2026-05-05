import { MdProductionQuantityLimits } from "react-icons/md";
import {
  // FiUser,
  FiGift,
  FiGrid,
  FiAlertCircle,
  FiHelpCircle,
  FiTruck,
  FiPhoneCall,
  FiCreditCard,
  FiMail,
  FiMapPin,

  FiFileText,
  FiUsers,
  FiPocket,
  FiSettings,
  FiList,
  FiPhoneIncoming,
} from "react-icons/fi";


const pages = [
  {
    title: 'All Products',
    href: '/products',
    icon: MdProductionQuantityLimits,
  },
  {
    title: "Offers",
    href: "/discount-products",
    icon: FiGift,
  },
  // {
  //   title: "Checkout",
  //   href: "/checkout",
  //   icon: FiShoppingBag,
  // },
  {
    title: "FAQs",
    href: "/faq",
    icon: FiHelpCircle,
  },
  {
    title: "About Us",
    href: "/about-us",
    icon: FiUsers,
  },
  {
    title: "Contact Us",
    href: "/contact-us",
    icon: FiPhoneIncoming,
  },
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
    icon: FiPocket,
  },
  {
    title: "Terms and Conditions",
    href: "/terms-and-conditions",
    icon: FiFileText,
  },
];

const userSidebar = [
  {
    title: "Dashboard",
    href: "/user/dashboard",
    icon: FiGrid,
  },
  {
    title: "My Orders",
    href: "/user/my-orders",
    icon: FiList,
  },
  {
    title: "Update Profile",
    href: "/user/update-profile",
    icon: FiSettings,
  },
  {
    title: "Change Password",
    href: "/user/change-password",
    icon: FiFileText,
  },
];



const ctaCardData = [
  {
    id: 1,
    title: "Buy Your",
    subTitle: "Electris Products",
    image: "/cta/cta-bg-1.png",
    url: "/search?category=fresh-vegetable",
  },
  {
    id: 2,
    title: "Taste of",
    subTitle: "Fish & Meat",
    image: "/cta/cta-bg-1.png",
    url: "/search?Category=fish--meat",
  },
  {
    id: 3,
    title: "Taste of",
    subTitle: "Bread & Bakery",
    image: "/cta/cta-bg-1.png",
    url: "/search?Category=biscuits--cakes",
  },
];

const featurePromo = [
  {
    id: 1,
    title: "featurePromo1-title",
    info: "featurePromo1-info",
    icon: FiTruck,
  },
  {
    id: 2,
    title: "featurePromo2-title",
    info: "featurePromo2-info",
    icon: FiPhoneCall,
  },
  {
    id: 3,
    title: "featurePromo3-title",
    info: "featurePromo3-info",
    icon: FiCreditCard,
  },
  {
    id: 4,
    title: "featurePromo4-title",
    info: "featurePromo4-info",
    icon: FiGift,
  },
];

const contactData = [
  {
    id: 1,
    title: "contact-page-box1-title",
    info: "contact-page-box1-info",
    icon: FiMail,
    contact: "Mahabubmart@gmail.com",
    className: "bg-emerald-100",
  },
  {
    id: 2,
    title: "contact-page-box2-title",
    info: "contact-page-box2-info",
    icon: FiPhoneCall,
    contact: "029-00124667",
    className: "bg-yellow-100",
  },
  {
    id: 3,
    title: "contact-page-box3-title",
    info: "contact-page-box3-info",
    icon: FiMapPin,
    contact: "",
    className: "bg-indigo-100",
  },
];

export {pages, userSidebar, ctaCardData, featurePromo, contactData};
