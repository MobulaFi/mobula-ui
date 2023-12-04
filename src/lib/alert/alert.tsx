// import {CloseIcon, InfoIcon} from "@chakra-ui/icons";
// import {Button, Flex, Icon, Text, ToastId, keyframes, styled, useToast} from "@chakra-ui/react";
// import React from "react";
// import {useEffect, useRef} from "react";
// import {toast} from "./use-toast"

// export const AlertTemplate = ({message, options}: AlertTemplateProps) => {
//   const toast = useToast();
//   const toastIdRef = useRef<ToastId | undefined>();
//   const {boxBg1, borders, text80, text60} = useColors();
//   if (options.type === "error") playSound("/alert/error.mp3");
//   if (options.type === "info") playSound("/alert/info.mp3");
//   if (options.type === "success") playSound("/alert/success.wav");

//   const getColor = () => {
//     if (options.type === "info") return "blue";
//     if (options.type === "success") return "green";
//     return "red";
//   };

//   const getIconFromType = () => {
//     if (options.type === "info") return {title: "Information", icon: InfoIcon};
//     if (options.type === "success")
//       return {title: "Success", icon: SuccessIcon};
//     if (options.type === "error") return {title: "Error", icon: ErrorIcon};
//     return {title: "warning", icon: ErrorIcon};
//   };

//   const close = () => {
//     if (toastIdRef.current) {
//       toast.close(toastIdRef.current);
//     }
//   };

//   const addToast = () => {
//     toastIdRef.current = toast({
//       position: "top-right",
//       isClosable: true,
//       containerStyle: {
//         transition: "none",
//         opacity: 1,
//         transform: "none",
//       },
//       render: () => (
//         <Flex w="100%" justify="flex-end" mr="0px" borderRadius="8px">
//           <Flex
//             direction="column"
//             w="100%"
//             borderRadius="8px"
//             bg={boxBg1}
//             maxW="230px"
//             border={borders}
//             mr="0px"
//             boxShadow="1px 2px 13px 3px rgba(0,0,0,0.1)"
//           >
//             <Bar>
//               <Flex
//                 h="6px"
//                 bg={getColor()}
//                 w="100%"
//                 borderRadius="4px 0px 0px 0px"
//               />
//             </Bar>
//             <Flex
//               align="center"
//               pt="10px"
//               justify="space-between"
//               px="10px"
//               color={text80}
//             >
//               <Flex align="center">
//                 <Icon fontSize="10px" as={getIconFromType().icon} />
//                 <Text
//                   fontSize="13px"
//                   fontWeight="500"
//                   color={text80}
//                   ml="-10px"
//                 >
//                   {getIconFromType().title}
//                 </Text>
//               </Flex>
//               <Button onClick={close}>
//                 <CloseIcon fontSize="10px" />
//               </Button>
//             </Flex>
//             <Text
//               fontSize="13px"
//               mt="5px"
//               px="15px"
//               pb="15px"
//               color={text60}
//               whiteSpace="pre-wrap"
//               textAlign="start"
//             >
//               {message}
//             </Text>
//           </Flex>
//         </Flex>
//       ),
//     });
//     // eslint-disable-next-line no-promise-executor-return
//     new Promise(resolve => setTimeout(resolve, 4800)).then(() => {
//       close();
//     });
//   };

//   useEffect(() => {
//     addToast();
//   }, []);
// };
"use client";
import React, { useRef } from "react";
import { AiFillCloseCircle, AiOutlineClose } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { IoInformationCircle } from "react-icons/io5";

// const widthbar = keyframes`
//   from {width: 100%;}
//   to {width: 0%;}
// `;

// const Bar = styled.div`
//   animation: ${widthbar} 5200ms linear;
// `;

export const AlertTemplate = ({ options, message, close }) => {
  const toastIdRef = useRef<any | undefined>();
  //   if (options.type === "error") playSound("/alert/error.mp3");
  //   if (options.type === "info") playSound("/alert/info.mp3");
  //   if (options.type === "success") playSound("/alert/success.wav");

  const getColor = () => {
    if (options.type === "info") return "bg-blue dark:bg-blue";
    if (options.type === "success") return "bg-green dark:bg-green";
    return "bg-red dark:bg-red";
  };

  const getIconFromType = () => {
    if (options.type === "info")
      return {
        title: "Information",
        icon: (
          <IoInformationCircle className="text-light-font-100 dark:text-dark-font-100 mr-1.5 text-lg" />
        ),
      };
    if (options.type === "success")
      return {
        title: "Success",
        icon: <FaCheckCircle className="text-green dark:text-green mr-1.5" />,
      };
    if (options.type === "error")
      return {
        title: "Error",
        icon: <AiFillCloseCircle className="text-red dark:text-red mr-1.5" />,
      };
    return {
      title: "Warning",
      icon: <IoIosWarning className="text-yellow dark:text-yellow mr-1.5" />,
    };
  };
  const info = getIconFromType();
  const background = getColor();

  return (
    <div className="flex justify-end mt-2.5 mr-2.5">
      <div
        className="flex flex-col rounded-xl bg-light-bg-terciary dark:bg-dark-bg-terciary shadow-lg
           border border-light-border-primary dark:border-dark-border-primary w-[330px] overflow-hidden"
      >
        <div className="w-full mx-auto h-0.5 rounded-t-xl">
          <div
            className={`h-full ${background} rounded-t-xl animate-widthbar`}
          />
        </div>
        <div className="flex flex-col p-5 ">
          <div className="flex items-center justify-between text-light-font-100 dark:text-dark-font-100">
            <div className="flex items-center">
              {info.icon}
              <p className="text-base font-bold text-light-font-100 dark:text-dark-font-100">
                {info.title}
              </p>
            </div>
            <button onClick={close}>
              <AiOutlineClose className="text-sm" />
            </button>
          </div>
          <p className="text-sm mt-1.5 font-medium whitespace-pre-wrap text-start text-light-font-100 dark:text-dark-font-100">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
