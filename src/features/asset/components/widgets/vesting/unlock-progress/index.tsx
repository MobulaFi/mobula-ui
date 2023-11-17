/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
import {Flex} from "@chakra-ui/react";
import {useContext, useState} from "react";
import {
  getFormattedAmount,
  getTokenPercentage,
} from "../../../../../../../../utils/helpers/formaters";
import {TextLandingMedium, TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {colors} from "../../../../constant";
import {BaseAssetContext} from "../../../../context-manager";
import {calculateDaysRemaining} from "../../../../utils";

export const UnlockProgress = ({...props}) => {
  const {baseAsset} = useContext(BaseAssetContext);
  const {text80, shadow, borders, hover, text60} = useColors();
  const [isHovering, setIsHovering] = useState("");

  const getTotalAmountUnlock = () => {
    let total = 0;
    let totalUnlock = 0;
    let totalLock = 0;
    const now = new Date().getTime();
    baseAsset?.release_schedule?.forEach(entry => {
      if (entry[0] <= now) totalUnlock += entry[1];
      if (entry[0] > now) totalLock += entry[1];
      total += entry[1];
    });
    return {totalUnlock, totalLock, total};
  };

  const getPercentage = (amount, totalAmount) => (amount * 100) / totalAmount;
  const {totalUnlock, total} = getTotalAmountUnlock();

  const getAmountForEachDistribution = () => {
    const seen = new Set();
    const seenLock = new Set();
    const typeUnlock = {};
    const typeLock = {};
    const now = new Date().getTime();
    baseAsset?.release_schedule?.forEach(entry => {
      if (entry[0] <= now) {
        const entries = Object.entries(entry[2]);
        entries.forEach(([key, value]) => {
          if (!seen.has(key)) {
            seen.add(key);
            typeUnlock[key] = value;
          } else {
            typeUnlock[key] += value;
          }
        });
      }
      if (entry[0] > now) {
        const entries = Object.entries(entry[2]);
        entries.forEach(([key, value]) => {
          if (!seenLock.has(key)) {
            seenLock.add(key);
            typeLock[key] = value;
          } else {
            typeLock[key] += value;
          }
        });
      }
    });
    return {typeUnlock, typeLock};
  };

  const daysRemaining = calculateDaysRemaining(baseAsset?.release_schedule);
  const {typeUnlock: distribution, typeLock: distributionLocked} =
    getAmountForEachDistribution();

  const getSameColors = () => {
    const fusionArr = Object.entries(distribution).concat(
      Object.entries(distributionLocked),
    );
    const extractNames = [];
    fusionArr.forEach(entry => {
      if (!extractNames.includes(entry[0])) extractNames.push(entry[0]);
    });
    const colorsForRound = {};
    extractNames.forEach((entry, i) => {
      colorsForRound[entry] = colors[i];
    });

    return colorsForRound;
  };

  const newColors = getSameColors();
  const hasLockedDistribution = Object.entries(distributionLocked).length > 0;

  const getPositionOfTooltip = (i: number, isUnlock: boolean) => {
    const distribLength = Object.entries(distribution).length;
    const distribLockedLength = Object.entries(distributionLocked).length;
    const isNearEndUnlocked = i >= distribLength - 3;
    const isNearEndLocked = i >= distribLockedLength - 3;

    if (hasLockedDistribution) {
      if (isNearEndUnlocked && isUnlock)
        return {
          left: "0%",
          right: "auto",
        };
      if (isNearEndLocked && !isUnlock)
        return {
          left: "auto",
          right: "0%",
        };
    } else if (isNearEndUnlocked && isUnlock)
      return {
        left: "auto",
        right: "0%",
      };
  };

  const getBorderRadius = i => {
    if (!hasLockedDistribution && Object.keys(distribution).length - 1 === i)
      return "0px 4px 4px 0px";
    if (i === 0) return "4px 0px 0px 4px";

    return "0px";
  };

  return (
    <Flex w="100%" mx="auto" direction="column" mb="30px" {...props}>
      <TextLandingMedium color={text80} mb="10px">
        Unlock Progress
      </TextLandingMedium>
      <Flex pr={["0px", "0px", "0px", "20px"]} direction="column">
        <Flex align="center" justify="space-between" mb="7.5px">
          <TextSmall fontWeight="500">
            {getTokenPercentage(getPercentage(totalUnlock, total))}%
          </TextSmall>
          {daysRemaining[0] < 0 ? (
            <TextSmall fontWeight="500">
              {Math.abs(daysRemaining[0])} days ago
            </TextSmall>
          ) : (
            <TextSmall fontWeight="500">{daysRemaining[0]} days left</TextSmall>
          )}
        </Flex>
        <Flex
          w="100%"
          h="25px"
          borderRadius="4px"
          bg={hover}
          position="relative"
          border={borders}
        >
          {Object.entries(distribution).map(([key, value], i) => (
            <Flex
              bg={newColors[key]}
              h="100%"
              borderRadius={getBorderRadius(i)}
              borderRight={borders}
              position="relative"
              onMouseEnter={() => setIsHovering(key)}
              onMouseLeave={() => setIsHovering("")}
              cursor="pointer"
              w={`${getPercentage(value, total)}%`}
            >
              {isHovering === key ? (
                <Flex
                  w="fit-content"
                  h="auto"
                  p="7px 10px"
                  borderRadius="4px"
                  bg={hover}
                  maxW="300px"
                  position="absolute"
                  top="calc(100% + 7.5px)"
                  left={getPositionOfTooltip(i, true)?.left}
                  right={getPositionOfTooltip(i, true)?.right}
                  border={borders}
                  boxShadow={shadow}
                  direction="column"
                  zIndex="2"
                >
                  <Flex align="center" mb="5px">
                    <Flex
                      w="10px"
                      h="10px"
                      borderRadius="full"
                      bg={newColors[key]}
                      mr="5px"
                      minW="10px"
                    />
                    <TextSmall
                      color={text80}
                      fontWeight="500"
                      whiteSpace="pre-wrap"
                    >
                      {key}
                    </TextSmall>
                  </Flex>
                  <Flex
                    align="center"
                    justify="space-between"
                    w="100%"
                    mr="15px"
                  >
                    <TextSmall color={text60} whiteSpace="nowrap">
                      % Unlocked:
                    </TextSmall>
                    <TextSmall color={text80} fontWeight="500">
                      {getTokenPercentage(getPercentage(value, total))}%
                    </TextSmall>
                  </Flex>

                  <Flex
                    align="center"
                    mr="15px"
                    justify="space-between"
                    w="100%"
                  >
                    <TextSmall color={text60} whiteSpace="nowrap">
                      Amount Unlocked:
                    </TextSmall>
                    <TextSmall color={text80} fontWeight="500">
                      {getFormattedAmount(value)}
                    </TextSmall>
                  </Flex>
                  <Flex
                    align="center"
                    mr="15px"
                    justify="space-between"
                    w="100%"
                  >
                    <TextSmall color={text60} whiteSpace="nowrap">
                      Amount USD:
                    </TextSmall>
                    <TextSmall color={text80} fontWeight="500">
                      $
                      {getFormattedAmount(
                        Number(value) * (baseAsset?.price || 0),
                      )}
                    </TextSmall>
                  </Flex>
                </Flex>
              ) : null}
            </Flex>
          ))}
          {getPercentage(totalUnlock, total) !== 100 ? (
            <Flex
              position="absolute"
              top="-2.5px"
              left={`${getPercentage(totalUnlock, total)}%`}
              h="125%"
              w="2px"
              zIndex={1}
              borderRadius="full"
              bg={text60}
            />
          ) : null}
          {Object.entries(distributionLocked).map(([key, value], i) => (
            <Flex
              bg={newColors[key]}
              h="100%"
              borderRadius={
                i === Object.entries(distributionLocked).length - 1
                  ? "0px 4px 4px 0px"
                  : "0px"
              }
              borderRight={borders}
              position="relative"
              onMouseEnter={() => setIsHovering(key + value)}
              onMouseLeave={() => setIsHovering("")}
              cursor="pointer"
              zIndex={3}
              opacity={isHovering === key + value ? 1 : 0.3}
              w={`${getPercentage(value, total)}%`}
            >
              {isHovering === key + value ? (
                <Flex
                  w="fit-content"
                  h="auto"
                  p="7px 10px"
                  borderRadius="4px"
                  bg={hover}
                  position="absolute"
                  top="calc(100% + 7.5px)"
                  left={getPositionOfTooltip(i, false)?.left}
                  right={getPositionOfTooltip(i, false)?.right}
                  border={borders}
                  boxShadow={shadow}
                  direction="column"
                  zIndex="2"
                >
                  <Flex align="center" mb="5px">
                    <Flex
                      w="10px"
                      h="10px"
                      borderRadius="full"
                      bg={newColors[key]}
                      mr="5px"
                    />
                    <TextSmall
                      color={text80}
                      fontWeight="500"
                      whiteSpace="nowrap"
                    >
                      {key}
                    </TextSmall>
                  </Flex>
                  <Flex
                    align="center"
                    justify="space-between"
                    w="100%"
                    mr="15px"
                  >
                    <TextSmall color={text60} whiteSpace="nowrap">
                      % Locked:
                    </TextSmall>
                    <TextSmall color={text80} fontWeight="500">
                      {getTokenPercentage(getPercentage(value, total))}%
                    </TextSmall>
                  </Flex>
                  <Flex
                    align="center"
                    mr="15px"
                    justify="space-between"
                    w="100%"
                  >
                    <TextSmall color={text60} whiteSpace="nowrap">
                      Amount Locked:
                    </TextSmall>
                    <TextSmall color={text80} fontWeight="500">
                      {getFormattedAmount(value)}
                    </TextSmall>
                  </Flex>
                  <Flex
                    align="center"
                    mr="15px"
                    justify="space-between"
                    w="100%"
                  >
                    <TextSmall color={text60} whiteSpace="nowrap">
                      Amount USD:
                    </TextSmall>
                    <TextSmall color={text80} fontWeight="500">
                      $
                      {getFormattedAmount(
                        Number(value) * (baseAsset?.price || 0),
                      )}
                    </TextSmall>
                  </Flex>
                </Flex>
              ) : null}
            </Flex>
          ))}
        </Flex>
      </Flex>
    </Flex>
  );
};
