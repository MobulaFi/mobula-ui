import { useColors } from "@/lib/chakra/colorMode";
import { Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Dispatch, Key, SetStateAction } from "react";

interface NavProps {
  list: string[] | { name: string; url: string }[];
  active: string;
  setActive?: Dispatch<SetStateAction<string>>;
  setPreviousTab?: Dispatch<SetStateAction<string>>;
  isGeneral?: boolean;
  isPortfolio?: boolean;
}

export const TopNav = ({
  list,
  setActive,
  active,
  setPreviousTab,
  isGeneral = false,
  isPortfolio = false,
}: NavProps) => {
  const { text40, text80, borders } = useColors();
  const router = useRouter();

  const getWidth = () => {
    const widthPerButton = 100 / (list?.length || 0);
    const left = widthPerButton * list.indexOf(active as any);
    return left;
  };

  const width = getWidth();

  return (
    <Flex
      w="100%"
      overflowX="scroll"
      className="scroll"
      display={["flex", "flex", isPortfolio ? "flex" : "none", "none"]}
      position="relative"
      direction="column"
      borderBottom={borders}
    >
      <Flex align="center" w="100%">
        {list.map((item, index) => (
          <Button
            onClick={() => {
              if (isGeneral) router.push(item.url);
              else {
                setPreviousTab(active);
                setActive(item);
              }
            }}
            fontWeight="500"
            w={`${100 / (list?.length || 0)}%`}
            fontSize="12px"
            pb="10px"
            h="100%"
            pt="10px"
            px="10px"
            borderRadius="0px"
            borderBottom={
              isGeneral && active === item?.name ? "2px solid #5c6ac4" : "none"
            }
            transition="all 250ms ease-in-out"
            color={
              active === item || (isGeneral && active === item?.name)
                ? text80
                : text40
            }
            key={item as Key}
          >
            {isGeneral ? item.name : item}
          </Button>
        ))}
      </Flex>
      {!isGeneral ? (
        <Flex
          h="2px"
          mt="5px"
          px="10px"
          bottom="0px"
          w={`${100 / (list?.length || 0)}%`}
          transition="all 200ms ease-in-out"
          position="absolute"
          bg="blue"
          left={`${width}%`}
        />
      ) : null}
    </Flex>
  );
};
