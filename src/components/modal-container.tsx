import React from "react";
import { Dialog, DialogContent } from "../lib/shadcn/components/ui/modal";
import { cn } from "../lib/shadcn/lib/utils";

interface ModalContainerProps {
  extraCss?: string;
  title?: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onClose?: any;
  titleCss?: string;
}

export const Modal = ({
  title,
  children,
  isOpen,
  onClose,
  extraCss,
  titleCss,
}: ModalContainerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={extraCss}>
        {title ? (
          <ModalTitle extraCss={cn("mb-2.5", titleCss)}>{title}</ModalTitle>
        ) : null}
        {children}
      </DialogContent>
    </Dialog>
  );
};

interface ModalTitleProps {
  children: React.ReactNode;
  extraCss?: string;
}

export const ModalTitle = ({ children, extraCss }: ModalTitleProps) => {
  return (
    <h3
      className={cn(
        "text-xl md:text-lg font-medium text-light-font-100 dark:text-dark-font-100",
        extraCss
      )}
    >
      {children}
    </h3>
  );
};
