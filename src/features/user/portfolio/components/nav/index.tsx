import { usePathname } from "next/navigation";
import { Container } from "../../../../../components/container";
import { NextChakraLink } from "../../../../../components/link";

export const Nav = () => {
  const pathname = usePathname();
  console.log("pathname", pathname);
  return (
    <Container extraCss="mb-0 pb-0">
      <div className="flex items-center">
        <NextChakraLink
          href="/portfolio"
          extraCss={`${
            pathname === "/portfolio"
              ? "text-light-font-100 dark:text-dark-font-100"
              : "text-light-font-40 dark:text-dark-font-40"
          } mr-3 text-base md:text-sm`}
        >
          Dashboard
        </NextChakraLink>
        <NextChakraLink
          href="/portfolio/manage"
          extraCss={`${
            pathname === "/portfolio/manage"
              ? "text-light-font-100 dark:text-dark-font-100"
              : "text-light-font-40 dark:text-dark-font-40"
          } text-base md:text-sm`}
        >
          Manage
        </NextChakraLink>
      </div>
    </Container>
  );
};
