import React, { useState } from "react";
import { triggerAlert } from "../../../../../lib/toastify";
import { containerStyle } from "../../style";
import { Title } from "../ui/title";

export const GetInTouch = () => {
  const [userQuery, setUserQuery] = useState({
    telegram: "",
    email: "",
    description: "",
  });

  const handleChange = (e) => {
    setUserQuery({
      ...userQuery,
      [e.target.name]: e.target.value,
    });
  };

  const submit = () => {
    if (!userQuery.telegram || !userQuery.email || !userQuery.description)
      return triggerAlert("Error", "Please fill all the fields.");
    if (!userQuery.email.includes("@"))
      return triggerAlert("Error", "Email is not valid");
    triggerAlert("Success", "Your query has been submitted successfully.");
  };

  return (
    <section
      className="w-screen flex justify-center items-center pt-[150px] lg:pt-[50px] pb-[200px] lg:pb-[120px] snap-center"
      style={{
        background:
          "radial-gradient(at right top, rgba(11, 32, 64, 1.0), #131627 80%, #131627)",
      }}
    >
      <div className={containerStyle}>
        <div className="w-full flex items-center lg:flex-col-reverse">
          <div className="w-[55%] mr-[30px] lg:w-full lg:mr-0 lg:mt-[50px]">
            <img src="/landing/map.png" alt="world map" className="w-full" />
          </div>
          <div className="w-[45%] pl-5 lg:pl-0 lg:w-full">
            <Title title="Get in touch" />
            <div
              className="shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
            border-light-border-primary dark:border-dark-border-primary flex items-center
             h-[45px] w-full relative mb-5 lg:mt-5"
            >
              <input
                type="text"
                placeholder="Telegram username"
                name="telegram"
                onChange={handleChange}
                className="h-full w-full px-2.5 bg-[#101A32]
                       text-light-font-100 dark:text-dark-font-100 font-poppins "
                style={{
                  background: "transparent",
                }}
              />
            </div>
            <div
              className="shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
            border-light-border-primary dark:border-dark-border-primary flex items-center
             h-[45px] w-full relative mb-5"
            >
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                className="h-full w-full px-2.5 bg-[#101A32]
                       text-light-font-100 dark:text-dark-font-100 font-poppins "
                style={{
                  background: "transparent",
                }}
              />
            </div>
            <div
              className="shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
            border-light-border-primary dark:border-dark-border-primary flex items-center
             h-[230px] w-full relative"
            >
              <textarea
                placeholder="Describe your query or issue here."
                name="description"
                onChange={handleChange}
                className="h-full w-full px-2.5 bg-[#101A32]
                       text-light-font-100 dark:text-dark-font-100 font-poppins"
                style={{
                  background: "transparent",
                }}
              />
            </div>
            <button
              className="mt-[40px] w-[150px] h-[45px] text-[15px] font-medium bg-[#253558] hover:bg-[#415288] border hover:border-blue dark:border-darkblue water-button md:h-[40px] md:w-[132px] md:text-sm md:font-normal"
              onClick={submit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
