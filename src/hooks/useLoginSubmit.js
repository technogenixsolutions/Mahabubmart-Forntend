// import Cookies from "js-cookie";
// import { useRouter } from "next/router";
// import { useContext, useState } from "react";
// import { useForm } from "react-hook-form";
// import { GoogleLogin } from "@react-oauth/google";

// //internal import

// import { UserContext } from "@context/UserContext";
// import { notifyError, notifySuccess } from "@utils/toast";
// import CustomerServices from "@services/CustomerServices";

// const useLoginSubmit = (setModalOpen) => {
//   const router = useRouter();
//   const { redirect } = router.query;
//   const { dispatch } = useContext(UserContext);
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm();

//   const submitHandler = ({
//     name,
//     email,
//     registerEmail,
//     verifyEmail,
//     password,
//   }) => {
//     setLoading(true);
//     const cookieTimeOut = 0.5;

//     if (registerEmail && password) {
//       CustomerServices.customerLogin({
//         registerEmail,
//         password,
//       })
//         .then((res) => {
//           setLoading(false);
//           setModalOpen(false);
//           router.push(redirect || "/");
//           notifySuccess("Login Success!");
//           dispatch({ type: "USER_LOGIN", payload: res });
//           Cookies.set("userInfo", JSON.stringify(res), {
//             expires: cookieTimeOut,
//           });
//         })
//         .catch((err) => {
//           notifyError(err ? err.response.data.message : err.message);
//           setLoading(false);
//         });
//     }
// if (name && email && password) {
//   CustomerServices.registerCustomer({
//     name,
//     email,
//     password,
//   })
//         .then((res) => {
//           setLoading(false);
//           setModalOpen(false);
//           notifySuccess(res.message);
//         })
//         .catch((err) => {
//           setLoading(false);
//           notifyError(err.response.data.message);
//         });
//     }
//     if (verifyEmail) {
//       CustomerServices.forgetPassword({ verifyEmail })
//         .then((res) => {
//           setLoading(false);
//           notifySuccess(res.message);
//           setValue("verifyEmail");
//         })
//         .catch((err) => {
//           setLoading(false);
//           notifyError(err ? err.response.data.message : err.message);
//         });
//     }
//   };

//   const handleGoogleSignIn = (user) => {
//     // console.log("google sign in", user?.credential);
//     const cookieTimeOut = 0.5;

//     if (user) {
//       CustomerServices.signUpWithProvider(user?.credential)
//         .then((res) => {
//           setModalOpen(false);
//           notifySuccess("Login success!");
//           router.push(redirect || "/");
//           dispatch({ type: "USER_LOGIN", payload: res });
//           Cookies.set("userInfo", JSON.stringify(res), {
//             expires: cookieTimeOut,
//           });
//         })

//         .catch((err) => {
//           notifyError(err.message);
//           setModalOpen(false);
//         });
//     }
//   };

//   return {
//     handleSubmit,
//     submitHandler,
//     handleGoogleSignIn,
//     register,
//     errors,
//     GoogleLogin,
//     loading,
//   };
// };

// export default useLoginSubmit;


import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";

// internal import
import { UserContext } from "@context/UserContext";
import { notifyError, notifySuccess } from "@utils/toast";
import CustomerServices from "@services/CustomerServices";

const useLoginSubmit = (setModalOpen) => {
  const router = useRouter();
  const { redirect } = router.query;
  const { dispatch } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const submitHandler = ({
    name,
    email,
    registerEmail,
    verifyEmail,
    password,
  }) => {
    setLoading(true);
    const cookieTimeOut = 0.5;

    /* ================= LOGIN ================= */
    if (registerEmail && password) {
      CustomerServices.customerLogin({
        registerEmail,
        password,
      })
        .then((res) => {
          setLoading(false);
          setModalOpen(false);

          notifySuccess("Login successful!");

          dispatch({ type: "USER_LOGIN", payload: res });

          Cookies.set("userInfo", JSON.stringify(res), {
            expires: cookieTimeOut,
          });

          router.push(redirect || "/");
        })
        .catch((err) => {
          setLoading(false);
          notifyError(
            err?.response?.data?.message || err.message || "Login failed"
          );
        });
    }

    /* ================= REGISTER (NO EMAIL VERIFY) ================= */
    else if (name && email && password) {
      CustomerServices.registerCustomer({
        name,
        email,
        password,
      })
        .then((res) => {
          setLoading(false);
          setModalOpen(false);

          notifySuccess(res.message || "Registration successful!");

          // ✅ Auto login after register
          dispatch({ type: "USER_LOGIN", payload: res });

          Cookies.set("userInfo", JSON.stringify(res), {
            expires: cookieTimeOut,
          });

          router.push(redirect || "/");
        })
        .catch((err) => {
          setLoading(false);
          notifyError(
            err?.response?.data?.message || err.message || "Registration failed"
          );
        });
    }

    /* ================= FORGOT PASSWORD ================= */
    else if (verifyEmail) {
      CustomerServices.forgetPassword({ verifyEmail })
        .then((res) => {
          setLoading(false);
          notifySuccess(res.message);
          setValue("verifyEmail", "");
        })
        .catch((err) => {
          setLoading(false);
          notifyError(
            err?.response?.data?.message || err.message || "Request failed"
          );
        });
    } else {
      setLoading(false);
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleSignIn = (user) => {
    const cookieTimeOut = 0.5;

    if (user) {
      CustomerServices.signUpWithProvider(user?.credential)
        .then((res) => {
          setModalOpen(false);
          notifySuccess("Login successful!");

          dispatch({ type: "USER_LOGIN", payload: res });

          Cookies.set("userInfo", JSON.stringify(res), {
            expires: cookieTimeOut,
          });

          router.push(redirect || "/");
        })
        .catch((err) => {
          notifyError(err?.message || "Google login failed");
          setModalOpen(false);
        });
    }
  };

  return {
    handleSubmit,
    submitHandler,
    handleGoogleSignIn,
    register,
    errors,
    GoogleLogin,
    loading,
  };
};

export default useLoginSubmit;
