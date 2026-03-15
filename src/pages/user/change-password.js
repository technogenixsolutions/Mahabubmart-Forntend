import React, { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

//internal import
import Error from "@component/form/Error";
import Dashboard from "@pages/user/dashboard";
import InputArea from "@component/form/InputArea";
import CustomerServices from "@services/CustomerServices";
import { notifyError, notifySuccess } from "@utils/toast";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { useRouter } from "next/router";
import { UserContext } from "@context/UserContext";

const ChangePassword = () => {

   const router = useRouter();
    const {
      dispatch,
      state: { userInfo },
    } = useContext(UserContext);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const { storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();

  const onSubmit = ({ email, currentPassword, newPassword }) => {
    // notifySuccess("This Feature is disabled for demo!");
    // return;
    setLoading(true);
    CustomerServices.changePassword({ email, currentPassword, newPassword })
      .then((res) => {
        notifySuccess(res.message);
        setLoading(false);

      // 🔐 Auto Logout After Successful Password Change
      dispatch({ type: "USER_LOGOUT" });
      Cookies.remove("userInfo");
      Cookies.remove("couponInfo");

      router.push("/"); 
      })
      .catch((err) => {
        setLoading(false);
        notifyError(err ? err.response.data.message : err.message);
      });
  };

  useEffect(() => {
    if (Cookies.get("userInfo")) {
      const user = JSON.parse(Cookies.get("userInfo"));
      setValue("email", user.email);
    }
  });


    const handleLogOut = () => {
      dispatch({ type: "USER_LOGOUT" });
      Cookies.remove("userInfo");
      Cookies.remove("couponInfo");
      router.push("/");
    };
  
   

  return (
    <Dashboard
      title={showingTranslateValue(
        storeCustomizationSetting?.dashboard?.change_password
      )}
      description="This is change-password page"
    >
      <h2 className="text-xl font-serif font-semibold mb-5">
        {showingTranslateValue(
          storeCustomizationSetting?.dashboard?.change_password
        )}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="md:grid-cols-6 md:gap-6">
          <div className="md:mt-0 md:col-span-2">
            <div className="lg:mt-6 bg-white">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-6">
                  <InputArea
                    register={register}
                    label={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.user_email
                    )}
                    name="email"
                    type="email"
                    placeholder={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.user_email
                    )}
                  />
                  <Error errorName={errors.email} />
                </div>
                <div className="col-span-6 sm:col-span-6">
                  <InputArea
                    register={register}
                    label={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.current_password
                    )}
                    name="currentPassword"
                    type="password"
                    autocomplete="new-password"
                    placeholder={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.current_password
                    )}
                  />
                  <Error errorName={errors.currentPassword} />
                </div>
                <div className="col-span-6 sm:col-span-6">
                  <InputArea
                    register={register}
                    label={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.new_password
                    )}
                    name="newPassword"
                    type="password"
                    autocomplete="new-password"
                    placeholder={showingTranslateValue(
                      storeCustomizationSetting?.dashboard?.new_password
                    )}
                  />
                  <Error errorName={errors.newPassword} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 text-right">
          {loading ? (
            <button
              disabled={loading}
              type="submit"
              className="md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none  text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] hover:from-[#155a9e] hover:via-[#1e88c8] hover:to-[#0090c2] h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto"
            >
              <img
                src="/loader/spinner.gif"
                alt="Loading"
                width={20}
                height={10}
              />
              <span className="font-serif ml-2 font-light">Processing</span>
            </button>
          ) : (
            <button
              type="submit"
              className="md:text-sm leading-5 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md placeholder-white focus-visible:outline-none focus:outline-none  text-white px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white bg-gradient-to-r from-[#1F6BBF] via-[#279FDF] to-[#00a4db] hover:from-[#155a9e] hover:via-[#1e88c8] hover:to-[#0090c2] h-12 mt-1 text-sm lg:text-sm w-full sm:w-auto"
            >
              {showingTranslateValue(
                storeCustomizationSetting?.dashboard?.change_password
              )}
            </button>
          )}
        </div>
      </form>
    </Dashboard>
  );
};

export default ChangePassword;
