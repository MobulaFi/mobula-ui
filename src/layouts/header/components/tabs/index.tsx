"use client";

import * as React from "react";
import { useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../../../@/components/ui/navigation-menu";
import { cn } from "../../../../@/lib/utils";
import { NextChakraLink } from "../../../../components/link";
import { navigation } from "../../constants";

export function Tabs() {
  const [isHover, setIsHover] = useState("");
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{navigation?.[0]?.name}</NavigationMenuTrigger>
          <NavigationMenuContent className="z-[10] w-[400px]">
            <ul className="grid gap-3 p-2.5 md:w-[400px] w-[400px] lg:grid-cols-[.75fr_1fr]">
              {navigation?.[0]?.extends?.map((entry, i) => (
                <div
                  key={entry.url}
                  className="flex items-center justify-between hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover rounded px-2.5 transition-all duration-250"
                  onMouseEnter={() => setIsHover(entry.name)}
                  onMouseLeave={() => setIsHover("")}
                >
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center h-[34px] w-[34px] mr-0.5 min-w-[34px]
                   bg-light-bg-hover dark:bg-dark-bg-hover rounded transition-all duration-250`}
                    >
                      {entry.icon}
                    </div>
                    <ListItem href={entry.url} title={entry.name}>
                      {entry.description}
                    </ListItem>
                  </div>
                  <BsChevronRight
                    className={`text-md ${
                      isHover === entry.name ? "animate-tabs" : "opacity-0"
                    } text-light-font-60 dark:text-dark-font-60 animate-skeleton`}
                  />
                </div>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{navigation?.[2]?.name}</NavigationMenuTrigger>
          <NavigationMenuContent className=" z-[10] md:w-[400px] lg:w-[500px] w-[600px]">
            <ul className="grid gap-3 p-2.5 md:w-[400px] lg:w-[500px] w-[600px] grid-cols-2 lg:grid-cols-2">
              {navigation?.[2]?.extends?.map((entry, i) => (
                <div
                  key={entry.url}
                  className="flex items-center justify-between hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover rounded px-2.5 transition-all duration-250"
                  onMouseEnter={() => setIsHover(entry.name)}
                  onMouseLeave={() => setIsHover("")}
                >
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center h-[34px] w-[34px] mr-0.5 min-w-[34px]
               bg-light-bg-hover dark:bg-dark-bg-hover rounded transition-all duration-250`}
                    >
                      {entry.icon}
                    </div>
                    <ListItem
                      key={entry.url}
                      href={entry.url}
                      title={entry.name}
                    >
                      {entry.description}
                    </ListItem>
                  </div>
                  <BsChevronRight
                    className={`text-md ${
                      isHover === entry.name ? "animate-tabs" : "opacity-0"
                    } text-light-font-60 dark:text-dark-font-60 animate-skeleton`}
                  />
                </div>
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
            extraCss="text-sm font-medium hover:text-light-font-60 hover:dark:text-dark-font-60 transition-all duration-250"
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
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-light-font-100 dark:text-dark-font-100">
            {title}
          </div>
          <p className="line-clamp-2 text-[13px] leading-snug text-muted-foreground text-light-font-60 dark:text-dark-font-60">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
