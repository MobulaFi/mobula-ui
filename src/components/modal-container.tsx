import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../lib/shadcn/components/ui/modal";

interface ModalContainerProps {
  extraCss?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
  trigger?: JSX.Element;
  isOpen?: boolean;
  onClose?: () => void;
}

export const ModalContainer = ({
  title,
  children,
  trigger,
  isOpen,
  onClose,
}: ModalContainerProps) => {
  return (
    <>
      <Dialog>
        <DialogTrigger data-state={isOpen ? "open" : "closed"}></DialogTrigger>
        <DialogContent>
          {title ? (
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
          ) : null}
          {children}
        </DialogContent>
      </Dialog>
      {/* <AlertDialog>
        <AlertDialogTrigger>{button}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </AlertDialogHeader>
          {children}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
      {/* <div
        className={`z-[100] left-0 inset-0 top-0 fixed w-screen h-screen bg-background/80 
          flex justify-center backdrop-blur-sm ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-all duration-200 ease-in-out`}
        onClick={() => onClose()}
      />
      <div
        className={cn(
          `z-[101] fixed left-1/2 -translate-x-1/2 top-[10vh] h-fit border border-light-border-primary dark:border-dark-border-primary
           rounded-2xl bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-font-100 dark:text-dark-font-100
            w-full md:w-[90%] ${
              title ? "py-3.5 px-4" : ""
            } overflow-y-scroll  ${
            isOpen
              ? "scale-100 opacity-100"
              : "opacity-0 scale-90 pointer-events-none"
          } transition-all duration-200 ease-in`,
          extraCss
        )}
      >
        {title ? (
          <div className="flex justify-between items-center mb-2.5">
            <LargeFont>{title}</LargeFont>
            <button onClick={() => onClose()}>
              <AiOutlineClose className="text-light-font-100 dark:text-dark-font-100 text-xl" />
            </button>
          </div>
        ) : null}
        {children}
      </div> */}
    </>
  );
};

export const Modal = ({
  title,
  children,
  trigger,
  isOpen,
  onClose,
  extraCss,
}: ModalContainerProps) => {
  console.log("isOpen", isOpen);
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={extraCss}>
          <DialogTitle>{title}</DialogTitle>
          {children}
        </DialogContent>
      </Dialog>
      {/* <AlertDialog>
        <AlertDialogTrigger>{button}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </AlertDialogHeader>
          {children}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
      {/* <div
        className={`z-[100] left-0 inset-0 top-0 fixed w-screen h-screen bg-background/80 
          flex justify-center backdrop-blur-sm ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          } transition-all duration-200 ease-in-out`}
        onClick={() => onClose()}
      />
      <div
        className={cn(
          `z-[101] fixed left-1/2 -translate-x-1/2 top-[10vh] h-fit border border-light-border-primary dark:border-dark-border-primary
           rounded-2xl bg-light-bg-secondary dark:bg-dark-bg-secondary text-light-font-100 dark:text-dark-font-100
            w-full md:w-[90%] ${
              title ? "py-3.5 px-4" : ""
            } overflow-y-scroll  ${
            isOpen
              ? "scale-100 opacity-100"
              : "opacity-0 scale-90 pointer-events-none"
          } transition-all duration-200 ease-in`,
          extraCss
        )}
      >
        {title ? (
          <div className="flex justify-between items-center mb-2.5">
            <LargeFont>{title}</LargeFont>
            <button onClick={() => onClose()}>
              <AiOutlineClose className="text-light-font-100 dark:text-dark-font-100 text-xl" />
            </button>
          </div>
        ) : null}
        {children}
      </div> */}
    </>
  );
};

export const ModalTitle = ({ children }) => {
  return (
    <h3 className="text-xl md:text-lg font-medium text-light-font-100 dark:text-dark-font-100">
      {children}
    </h3>
  );
};
