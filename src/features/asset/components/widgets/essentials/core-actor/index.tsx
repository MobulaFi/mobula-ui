/* eslint-disable import/no-cycle */
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { MediumFont } from "../../../../../../components/fonts";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { BaseAssetContext } from "../../../../context-manager";
import { FlexBorderBox } from "../../../../style";
import { ActorsBox } from "../../../ui/actors-box";

interface CoreActorProps {
  extraCss?: string;
}

export const CoreActor = ({ extraCss }: CoreActorProps) => {
  const { baseAsset } = useContext(BaseAssetContext);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const router = useRouter();
  return (
    <div
      className={cn(
        `${FlexBorderBox} flex p-5 lg:p-[15px] rounded-2xl lg:rounded-0`,
        extraCss
      )}
    >
      <MediumFont extraCss="mb-0 md:mb-[7.5px]">Core Actors</MediumFont>
      {baseAsset?.investors?.length > 0 ? (
        <>
          {Object.values(baseAsset?.team || {}).length > 0 ? (
            <ActorsBox data={baseAsset?.team} title="Team" />
          ) : null}
          {baseAsset?.investors?.length > 0 ? (
            <ActorsBox
              data={baseAsset?.investors || []}
              title="Top investors"
            />
          ) : null}
          {/* {cexs?.length > 0 ? (
        <ActorsBox data={cexs || []} title="Exchanges" />
      ) : null} */}
        </>
      ) : null}
      {/* ADD DATA FOR EDIT SYSTEM / DO NOT REMOVE!!!
      (
        <Flex direction="column" align="center" justify="center" mt="20px">
          <Image
            src={
              isDarkMode ? "/asset/no-actors.png" : "/asset/empty-roi-light.png"
            }
            boxSize={["120px", "120px", "150px"]}
          />
          <TextSmall mt="15px" mb="10px" fontWeight="500">
            No core actors found
          </TextSmall>
          <Button
            mt={["5px", "5px", "10px"]}
            maxW="160px"
            onClick={() => router.push("/list")}
            variant="outlined"
          >
            + Add Data
          </Button>
        </Flex>
      )}
      */}
    </div>
  );
};
