"use client";
import { useSearchParams } from "next/navigation";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { NextChakraLink } from "../../../../../components/link";
import { useTop100 } from "../../context-manager";

interface PaginationProps {
  maxPage: number;
  bg?: boolean;
  path?: string;
}

export const Pagination = ({
  maxPage,
  bg = true,
  path = "/home",
}: PaginationProps) => {
  const { setIsLoading } = useTop100();
  const params = useSearchParams();
  const pageNumber = params.get("page");
  const page = pageNumber
    ? Math.min(parseInt(pageNumber as string, 10), maxPage)
    : 1;

  const options =
    "mx-0 flex justify-center items-center cursor-pointer p-0 w-[35px] h-[35px] rounded-md text-base font-medium";

  return (
    <div
      className={`flex items-center justify-center w-full ${
        bg ? "bg-light-bg-table dark:bg-dark-bg-table" : ""
      } pb-[100px] md:pb-[50px] pt-[50px] md:pt-2.5`}
    >
      <div className="flex items-center p-0.5">
        <NextChakraLink
          extraCss={`${
            page > 1 ? "cursor-pointer" : "cursor-not-allowed opacity-50"
          } mr-2.5 flex items-center`}
          href={page > 1 ? `${path}?page=${page - 1}` : undefined}
          onClick={() => setIsLoading(true)}
        >
          <BsChevronLeft className="text-light-font-100 dark:text-dark-font-100" />
        </NextChakraLink>
        <NextChakraLink
          extraCss={`${options} ${
            page === 1 || page === undefined
              ? "text-light-font-100 dark:text-dark-font-100 bg-light-bg-hover dark:bg-dark-bg-hover border border-light-border-primary dark:border-dark-border-primary"
              : "text-light-font-60 dark:text-dark-font-60"
          }`}
          href={page === 1 ? undefined : `${path}?page=1`}
          onClick={() => setIsLoading(true)}
        >
          1
        </NextChakraLink>
        {page >= 5 && (
          <button
            className="text-light-font-60 dark:text-dark-font-60 mx-1 text-base"
            type="button"
            disabled
          >
            ...
          </button>
        )}
        {Math.max(Math.min(page - 2, maxPage - 5), 2) < maxPage && (
          <NextChakraLink
            extraCss={`${options} ${
              Math.max(Math.min(page - 2, maxPage - 5), 2) === page
                ? "text-light-font-100 dark:text-dark-font-100 bg-light-bg-hover dark:bg-dark-bg-hover border border-light-border-primary dark:border-dark-border-primary"
                : "text-light-font-60 dark:text-dark-font-60"
            }`}
            href={
              Math.max(Math.min(page - 2, maxPage - 5), 2) === page
                ? undefined
                : `${path}?page=${Math.max(Math.min(page - 2, maxPage - 5), 2)}`
            }
            onClick={() => setIsLoading(true)}
          >
            {Math.max(Math.min(page - 2, maxPage - 5), 2)}
          </NextChakraLink>
        )}
        {Math.max(Math.min(page - 1, maxPage - 4), 3) < maxPage && (
          <NextChakraLink
            extraCss={`${options} ${
              Math.max(Math.min(page - 1, maxPage - 4), 3) === page
                ? "text-light-font-100 dark:text-dark-font-100 bg-light-bg-hover dark:bg-dark-bg-hover border border-light-border-primary dark:border-dark-border-primary"
                : "text-light-font-60 dark:text-dark-font-60"
            }`}
            href={
              Math.max(Math.min(page - 1, maxPage - 4), 3) === page
                ? undefined
                : `${path}?page=${Math.max(Math.min(page - 1, maxPage - 4), 3)}`
            }
            onClick={() => setIsLoading(true)}
          >
            {Math.max(Math.min(page - 1, maxPage - 4), 3)}
          </NextChakraLink>
        )}
        {Math.max(Math.min(page + 2, maxPage - 3), 4) < maxPage && (
          <NextChakraLink
            extraCss={`${options} ${
              Math.max(Math.min(page, maxPage - 3), 4) === page
                ? "text-light-font-100 dark:text-dark-font-100 bg-light-bg-hover dark:bg-dark-bg-hover border border-light-border-primary dark:border-dark-border-primary"
                : "text-light-font-60 dark:text-dark-font-60"
            }`}
            href={
              Math.max(Math.min(page, maxPage - 3), 4) === page
                ? undefined
                : `${path}?page=${Math.max(Math.min(page, maxPage - 3), 4)}`
            }
            onClick={() => setIsLoading(true)}
          >
            {Math.max(Math.min(page, maxPage - 3), 4)}
          </NextChakraLink>
        )}
        {Math.max(Math.min(page + 1, maxPage - 2), 5) < maxPage && (
          <NextChakraLink
            extraCss={`${options} ${
              Math.max(Math.min(page + 1, maxPage - 2), 5) === page
                ? "text-light-font-100 dark:text-dark-font-100 bg-light-bg-hover dark:bg-dark-bg-hover border border-light-border-primary dark:border-dark-border-primary"
                : "text-light-font-60 dark:text-dark-font-60"
            }`}
            href={
              Math.max(Math.min(page + 1, maxPage - 2), 5) === page
                ? undefined
                : `${path}?page=${Math.max(Math.min(page + 1, maxPage - 2), 5)}`
            }
            onClick={() => setIsLoading(true)}
          >
            {Math.max(Math.min(page + 1, maxPage - 2), 5)}
          </NextChakraLink>
        )}
        {Math.max(Math.min(page + 2, maxPage - 1), 6) < maxPage && (
          <NextChakraLink
            extraCss={`${options} ${
              Math.max(Math.min(page + 2, maxPage - 1), 6) === page
                ? "text-light-font-100 dark:text-dark-font-100 bg-light-bg-hover dark:bg-dark-bg-hover border border-light-border-primary dark:border-dark-border-primary"
                : "text-light-font-60 dark:text-dark-font-60"
            }`}
            href={
              Math.max(Math.min(page + 2, maxPage - 1), 6) === page
                ? undefined
                : `${path}?page=${Math.max(Math.min(page + 2, maxPage - 1), 6)}`
            }
            onClick={() => setIsLoading(true)}
          >
            {Math.max(Math.min(page + 2, maxPage - 1), 6)}
          </NextChakraLink>
        )}
        {page < maxPage - 5 && (
          <button
            className="text-light-font-60 dark:text-dark-font-60 mx-1 text-base"
            type="button"
            disabled
          >
            ...
          </button>
        )}
        {maxPage > 1 && (
          <NextChakraLink
            extraCss={`${options} ${
              maxPage === page
                ? "text-light-font-100 dark:text-dark-font-100 bg-light-bg-hover dark:bg-dark-bg-hover border border-light-border-primary dark:border-dark-border-primary"
                : "text-light-font-60 dark:text-dark-font-60"
            }`}
            href={page <= maxPage ? `${path}?page=${maxPage}` : undefined}
            onClick={() => setIsLoading(true)}
          >
            {maxPage}
          </NextChakraLink>
        )}
        <NextChakraLink
          extraCss={`${
            page < maxPage ? "cursor-pointer" : "cursor-not-allowed opacity-50"
          } ml-2.5 flex items-center`}
          href={page < maxPage ? `${path}?page=${page + 1}` : undefined}
          onClick={() => setIsLoading(true)}
        >
          <BsChevronRight className="text-light-font-100 dark:text-dark-font-100" />
        </NextChakraLink>
      </div>
    </div>
  );
};
