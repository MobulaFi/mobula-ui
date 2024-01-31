import React, { useState } from "react";
import { triggerAlert } from "../../../../../lib/toastify";
import { GET } from "../../../../../utils/fetch";
import { containerStyle } from "../../style";
import { Title } from "../ui/title";

export const GetInTouch = () => {
  const [userQuery, setUserQuery] = useState({
    contact: "",
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    setUserQuery({
      ...userQuery,
      [e.target.name]: e.target.value,
    });
  };

  const submit = () => {
    if (!userQuery.contact || !userQuery.title || !userQuery.description)
      return triggerAlert("Error", "Please fill all the fields.");

    GET("/internal/get-in-touch", {
      contact: userQuery.contact,
      title: userQuery.title,
      body: userQuery.description,
    });
    triggerAlert("Success", "Your query has been submitted successfully.");
  };

  return (
    <section
      className="w-full flex justify-center items-center pt-[150px] lg:pt-[50px] pb-[200px] lg:pb-[120px] snap-center"
      style={{
        background:
          "radial-gradient(at right top, rgba(11, 32, 64, 1.0), #131627 80%, #131627)",
      }}
    >
      <div className={containerStyle}>
        <div className="w-full flex items-center lg:flex-col-reverse">
          {/* <div className="w-[55%] mr-[30px] lg:w-full lg:mr-0 lg:mt-[50px]">
            <img src="/landing/map.png" alt="world map" className="w-full" />
          </div> */}
          <div className="w-full max-w-[500px] pl-5 lg:pl-0 lg:w-full mx-auto">
            <Title title="Get in touch" extraCss="mr-auto ml-0 md:mx-auto" />
            <div
              className="shadow-xl bg-[rgba(23, 27, 43, 0.22)] rounded-2xl backdrop-blur-md border
            border-light-border-primary dark:border-dark-border-primary flex items-center
             h-[45px] w-full relative mb-5 mt-2.5 lg:mt-5"
            >
              <input
                type="text"
                placeholder="Telegram, email, discord"
                name="contact"
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
                type="text"
                placeholder="Title"
                name="title"
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
              className="w-[150px] h-[40px] md:h-[35px] text-[15px] font-medium bg-[#253558] hover:bg-[#415288] border hover:border-blue
               dark:border-darkblue water-button mt-[30px] md:mt-6 md:w-[125px] text-sm md:text-xs md:font-normal md:mx-auto"
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
