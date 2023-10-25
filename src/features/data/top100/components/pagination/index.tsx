"use client";
import { Box, Button, Flex, Spacer, VStack } from "@chakra-ui/react";
import { Next, Previous } from "chakra-paginator";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { NextChakraLink } from "../../../../../components/link";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { useTop100 } from "../../context-manager";

export const Pagination = ({
  maxPage,
  bg = true,
  path = "/",
}: {
  maxPage: any;
  bg?: boolean;
  path?: string;
}) => {
  const router = useRouter();
  const { setIsLoading } = useTop100();
  const { text60, text80, hover, borders, bgTable } = useColors();
  const searchParams = useSearchParams();
  const pageNumber = searchParams.get("page");
  const page = pageNumber
    ? Math.min(parseInt(pageNumber as string, 10), parseInt(maxPage, 10))
    : 1;
  const options = {
    mx: "0px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    p: 0,
    boxSize: "35px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
  };
  return (
    <VStack bg={bg ? bgTable : ""} py={10}>
      <Box>
        <Flex p={2}>
          <Spacer />
          <Previous bg="none" border="none" cursor="pointer" mr="20px">
            <NextChakraLink
              color={text80}
              cursor={page > 1 ? "pointer" : "not-allowed"}
              href={page > 1 ? `${path}?page=${page - 1}` : undefined}
              onClick={() => setIsLoading(true)}
            >
              <FaChevronLeft color={text80} />
            </NextChakraLink>
          </Previous>

          <NextChakraLink
            color={page === 1 ? text80 : text60}
            sx={options}
            bg={page === 1 ? hover : "none"}
            border={page === 1 ? borders : "none"}
            href={page === 1 ? undefined : `${path}?page=1`}
            onClick={() => setIsLoading(true)}
          >
            1
          </NextChakraLink>
          {page >= 5 && (
            <Button
              mx={2}
              bg="none"
              color={text60}
              border="none"
              type="button"
              disabled
              fontSize="16px"
            >
              ...
            </Button>
          )}

          {Math.max(Math.min(page - 2, maxPage - 5), 2) < maxPage && (
            <NextChakraLink
              sx={options}
              color={
                Math.max(Math.min(page - 2, maxPage - 5), 2) === page
                  ? text80
                  : text60
              }
              href={
                Math.max(Math.min(page - 2, maxPage - 5), 2) === page
                  ? undefined
                  : `${path}?page=${Math.max(
                      Math.min(page - 2, maxPage - 5),
                      2
                    )}`
              }
              onClick={() => setIsLoading(true)}
            >
              {Math.max(Math.min(page - 2, maxPage - 5), 2)}
            </NextChakraLink>
          )}

          {Math.max(Math.min(page - 1, maxPage - 4), 3) < maxPage && (
            <NextChakraLink
              bg={
                Math.max(Math.min(page - 1, maxPage - 4), 3) === page
                  ? hover
                  : "none"
              }
              color={
                Math.max(Math.min(page - 1, maxPage - 4), 3) === page
                  ? text80
                  : text60
              }
              sx={options}
              href={
                Math.max(Math.min(page - 1, maxPage - 4), 3) === page
                  ? undefined
                  : `${path}?page=${Math.max(
                      Math.min(page - 1, maxPage - 4),
                      3
                    )}`
              }
              onClick={() => setIsLoading(true)}
            >
              {Math.max(Math.min(page - 1, maxPage - 4), 3)}
            </NextChakraLink>
          )}
          {Math.max(Math.min(page + 2, maxPage - 3), 4) < maxPage && (
            <NextChakraLink
              sx={options}
              bg={
                Math.max(Math.min(page, maxPage - 3), 4) === page
                  ? hover
                  : "none"
              }
              border={
                Math.max(Math.min(page, maxPage - 3), 4) === page
                  ? borders
                  : "none"
              }
              color={
                Math.max(Math.min(page, maxPage - 3), 4) === page
                  ? text80
                  : text60
              }
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
              sx={options}
              bg={
                Math.max(Math.min(page + 1, maxPage - 2), 5) === page
                  ? hover
                  : "none"
              }
              border={
                Math.max(Math.min(page + 1, maxPage - 2), 5) === page
                  ? borders
                  : "none"
              }
              color={
                Math.max(Math.min(page + 1, maxPage - 2), 5) === page
                  ? text80
                  : text60
              }
              href={
                Math.max(Math.min(page + 1, maxPage - 2), 5) === page
                  ? undefined
                  : `${path}?page=${Math.max(
                      Math.min(page + 1, maxPage - 2),
                      5
                    )}`
              }
              onClick={() => setIsLoading(true)}
            >
              {Math.max(Math.min(page + 1, maxPage - 2), 5)}
            </NextChakraLink>
          )}
          {Math.max(Math.min(page + 2, maxPage - 1), 6) < maxPage && (
            <NextChakraLink
              sx={options}
              bg={
                Math.max(Math.min(page + 2, maxPage - 1), 6) === page
                  ? hover
                  : "none"
              }
              border={
                Math.max(Math.min(page + 2, maxPage - 1), 6) === page
                  ? borders
                  : "none"
              }
              color={
                Math.max(Math.min(page + 2, maxPage - 1), 6) === page
                  ? text80
                  : text60
              }
              href={
                Math.max(Math.min(page + 2, maxPage - 1), 6) === page
                  ? undefined
                  : `${path}?page=${Math.max(
                      Math.min(page + 2, maxPage - 1),
                      6
                    )}`
              }
              onClick={() => setIsLoading(true)}
            >
              {Math.max(Math.min(page + 2, maxPage - 1), 6)}
            </NextChakraLink>
          )}
          {page < maxPage - 5 && (
            <Button mx={2} type="button" disabled color={text60}>
              ...
            </Button>
          )}
          {maxPage > 1 && (
            <NextChakraLink
              sx={options}
              color={maxPage === page ? text80 : text60}
              href={page <= maxPage ? `${path}?page=${maxPage}` : undefined}
              onClick={() => setIsLoading(true)}
            >
              {maxPage}
            </NextChakraLink>
          )}
          <Next bg="none" border="none" ml="20px">
            <NextChakraLink
              color={text80}
              cursor={page < maxPage ? "pointer" : "not-allowed"}
              href={page < maxPage ? `${path}?page=${page + 1}` : undefined}
              onClick={() => setIsLoading(true)}
            >
              <FaChevronRight color={text80} />
            </NextChakraLink>
          </Next>
        </Flex>
      </Box>
    </VStack>
  );
};
