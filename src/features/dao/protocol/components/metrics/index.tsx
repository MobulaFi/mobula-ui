"use client";
import { Flex } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import React from "react";
import { Container } from "../../../../../components/container";
import { MediumFont } from "../../../../../components/fonts";
import { TitleContainer } from "../../../../../components/title";
import { addressSlicer } from "../../../../../utils/formaters";
import { RightContainer } from "../../../common/components/container-right";
import { MetricsLine } from "../../../common/components/line-metric";
import { LeftNavigation } from "../../../common/components/nav-left";
import { LeftNavigationMobile } from "../../../common/components/nav-left-mobile";
import { Tags } from "../../../common/components/tags";
import { Member } from "../../models";

interface MetricsProps {
  total_mobulers: Member[];
  dao_members: Member[];
  total_proposals: { id: number }[];
}

export const Metrics = ({
  total_mobulers,
  dao_members,
  total_proposals,
}: MetricsProps) => {
  const pathname = usePathname();
  const filteredArr = dao_members?.filter((valeur, index, self) => {
    const usernames = self.map((obj) => obj.username);
    return usernames.indexOf(valeur.username) === index;
  });
  return (
    <Container extraCss="flex-row lg:flex-col">
      <div className="block lg:hidden">
        <LeftNavigation
          page={pathname.includes("protocol") ? "protocol" : "governance"}
        />
      </div>
      <div className="hidden lg:block">
        <LeftNavigationMobile page="governance" />
      </div>
      <RightContainer>
        <div className="mb-5 mt-3 flex flex-col rounded-2xl sm:rounded-0 border border-light-border-primary dark:border-dark-border-primary">
          <TitleContainer>
            <MediumFont extraCss="px-[15px]">General</MediumFont>
          </TitleContainer>
          <MetricsLine
            logo="/governals/total-mobulers.svg"
            keys="Total mobulers"
          >
            <div className="flex items-center">
              <Tags extraCss="mr-[5px] md:mr-0">{total_mobulers?.length}</Tags>
            </div>
          </MetricsLine>
          <MetricsLine
            logo="/governals/total-protocol-prop.svg"
            keys="Total protocol proposals"
          >
            <div className="flex items-center">
              <Tags extraCss="mr-[5px] md:mr-0">{total_proposals?.length}</Tags>
            </div>
          </MetricsLine>
        </div>
        <div className="mb-5 w-full flex flex-col rounded-2xl sm:rounded-0 border border-light-border-primary dark:border-dark-border-primary">
          <TitleContainer>
            <MediumFont extraCss="px-[15px]">Mobulers</MediumFont>
          </TitleContainer>
          {filteredArr?.map((user: any, idx: number) => (
            <MetricsLine
              logo={user.profile_pic || user.users.profile_pic}
              address={user.address}
              rank={idx}
              isProtocolStat
              isProfilePic
              keys={
                user.username ||
                user.users?.username ||
                addressSlicer(user.address)
              }
              key={user.username || user.users?.username || user.address}
            >
              <Flex align="center">
                <Tags extraCss="mr-[5px] md:mr-0 text-green dark:text-green">
                  {user?.good_decisions}
                </Tags>
                <Tags extraCss="mr-[5px] md:mr-0 text-red dark:text-red">
                  {user?.bad_decisions}
                </Tags>
              </Flex>
            </MetricsLine>
          ))}
        </div>
      </RightContainer>
    </Container>
  );
};
