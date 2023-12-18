"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Button } from "../../../../components/button";
import { cn } from "../../lib/utils";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

interface CalendarCustomProps {
  className?: string;
  showOutsideDays?: boolean;
  selectedDay?: Date;
  setSelectedDay?: React.Dispatch<React.SetStateAction<Date>>;
  footer?: React.ReactNode;
  [key: string]: any;
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selectedDay,
  setSelectedDay,
  footer,
  ...props
}: CalendarCustomProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-3 absolute bg-light-bg-terciary dark:bg-dark-bg-terciary shadow-md z-10 rounded-xl border border-light-border-primary dark:border-dark-border-primary",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          Button,
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center rounded-full text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-blue [&:has([aria-selected])]:dark:bg-blue  first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          Button,
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-light-font-80 dark:text-dark-font-80"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-blue dark:bg-blue rounded-full mary text-light-font-80 dark:text-dark-font-80 hover:dark:bg-dark-bg-hover hover:bg-light-bg-hover focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-light-font-80 dark:text-dark-font-80 opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-light-font-40 dark:text-dark-font-40",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <BsChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <BsChevronRight className="h-4 w-4" />,
      }}
      mode="single"
      selected={selectedDay}
      onSelect={setSelectedDay}
      footer={footer}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
