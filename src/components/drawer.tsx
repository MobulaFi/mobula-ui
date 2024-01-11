import { ReactNode } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  titleChildren?: ReactNode;
  position?: string;
}

export const Drawer = ({
  isOpen,
  onClose,
  children,
  position = "right",
  titleChildren,
}: DrawerProps) => {
  const getClassFromPosition = () => {
    switch (position) {
      case "bottom":
        return "w-screen h-fit bottom-0 left-0";
      case "right":
        return "w-[400px] h-screen top-0 sm:w-screen";
    }
  };
  const positionClass = getClassFromPosition();
  return (
    <>
      <div
        className={`fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm h-screen w-screen ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-all duration-300 ease-in-out`}
        onClick={onClose}
      />
      <div
        className={`flex flex-col z-[101] fixed border-l border-light-border-primary
         dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-secondary 
         transition-all duration-300 ease-in-out ${positionClass}`}
        style={{
          [position]: isOpen ? "0%" : "-100%",
        }}
      >
        {titleChildren ? (
          <div className="flex items-center justify-between border-b border-light-border-primary dark:border-dark-border-primary p-5 md:p-[15px]">
            <div className="flex items-center">{titleChildren}</div>
            <button onClick={onClose}>
              <AiOutlineClose className="text-light-font-100 dark:text-dark-font-100 text-xl" />
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </>
  );
};
