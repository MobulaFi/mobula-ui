"use client";

import * as React from "react";
import { useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import { NextChakraLink } from "../../../../components/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../../../lib/shadcn/components/ui/navigation-menu";
import { cn } from "../../../../lib/shadcn/lib/utils";
import { navigation } from "../../constants";

export function Tabs() {
  const [isHover, setIsHover] = useState("");
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{navigation?.[0]?.name}</NavigationMenuTrigger>
          <NavigationMenuContent className="z-[101] w-[415px] p-0">
            <ul className="grid gap-0 p-2.5 w-[415px]">
              {navigation?.[0]?.extends?.map((entry, i) => (
                <ListItem
                  key={entry.url}
                  href={entry.url}
                  className="p-0 h-fit w-full m-0"
                >
                  <div
                    key={entry.url}
                    className="flex items-center justify-between hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover rounded-md p-4 transition-all duration-200"
                    onMouseEnter={() => setIsHover(entry.name)}
                    onMouseLeave={() => setIsHover("")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center h-[34px] w-[34px] mr-2.5 min-w-[34px]
               bg-light-bg-hover dark:bg-dark-bg-hover rounded-md transition-all duration-200`}
                      >
                        {entry.icon}
                      </div>
                      <div className="flex flex-col">
                        <div className="text-[15px] font-medium leading-none text-light-font-100 dark:text-dark-font-100 mb-1">
                          {entry.name}
                        </div>
                        <p className="text-[13px] text-light-font-40 dark:text-dark-font-40 ">
                          {" "}
                        </p>
                        {entry.description}{" "}
                      </div>
                    </div>
                    <BsChevronRight
                      className={`text-sm ${
                        isHover === entry.name ? "animate-tabs" : "opacity-0"
                      } text-light-font-60 dark:text-dark-font-60 animate-skeleton`}
                    />
                  </div>
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{navigation?.[2]?.name}</NavigationMenuTrigger>
          <NavigationMenuContent className=" z-[10]  w-[415px]">
            <ul className="grid gap-0 p-2.5 w-[415px]">
              {/* <ul className="grid gap-0 p-2.5 lg:w-[500px] w-[700px] grid-cols-2 lg:grid-cols-2"> */}
              {navigation?.[2]?.extends?.map((entry, i) => (
                <ListItem
                  key={entry.url}
                  href={entry.url}
                  className="p-0 h-fit w-full m-0"
                >
                  <div
                    key={entry.url}
                    className="flex items-center justify-between hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover rounded-md p-4 transition-all duration-200"
                    onMouseEnter={() => setIsHover(entry.name)}
                    onMouseLeave={() => setIsHover("")}
                  >
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center h-[34px] w-[34px] mr-2.5 min-w-[34px]
               bg-light-bg-hover dark:bg-dark-bg-hover rounded-md transition-all duration-200`}
                      >
                        {entry.icon}
                      </div>
                      <div className="flex flex-col">
                        <div className="text-[15px] font-normal leading-none text-light-font-100 dark:text-dark-font-100 mb-1">
                          {entry.name}
                        </div>
                        <p className="text-[13px] text-light-font-40 dark:text-dark-font-40 ">
                          {" "}
                        </p>
                        {entry.description}{" "}
                      </div>
                    </div>
                    <BsChevronRight
                      className={`text-sm ${
                        isHover === entry.name ? "animate-tabs" : "opacity-0"
                      } text-light-font-60 dark:text-dark-font-60 animate-skeleton`}
                    />
                  </div>
                </ListItem>
              ))}

              {/* <ListItem href="/docs/installation" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem> */}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NextChakraLink
            href={navigation?.[1]?.url}
            extraCss="text-sm font-normal hover:text-light-font-60 hover:dark:text-dark-font-60 transition-all duration-200"
          >
            {navigation?.[1]?.name}
          </NextChakraLink>
        </NavigationMenuItem>
        {/* {navigation.map((item) => {
          const isActive = selected === item.name && item.extends;
          const isEcosystem = isSmallScreen && item.name === "Ecosystem";
          const isDoubleSize = item.extends.length > 4;
          return (
            <NavigationMenuItem key={item.name}>
              <NavigationMenuTrigger> {item.name}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {item?.extends?.map((entry, i) => {
                    // const isHover = mouseHover === entry.name;
                    if (i >= 4)
                      return (
                        <ListItem
                          key={entry.name}
                          title={entry.name}
                          href={entry.url}
                        >
                          {entry.description}
                        </ListItem>
                      );
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })} */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <li>
      <NextChakraLink
        href={href}
        ref={ref}
        className={cn(
          "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
      >
        <div className="text-sm font-normal leading-none text-light-font-100 dark:text-dark-font-100">
          {title}
        </div>
        <p className="line-clamp-2 text-[13px] leading-snug text-muted-foreground text-light-font-60 dark:text-dark-font-60">
          {children}
        </p>
      </NextChakraLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
