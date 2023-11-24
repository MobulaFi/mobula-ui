import { usePathname } from "next/navigation";

export const usePathnameInfo = () => {
  const pathname = usePathname();
  let infos;
  if (pathname.includes("governance")) {
    infos = {
      title: "Governance",
      subtitle: "Governors",
      list: [
        {
          name: "Overview",
          url: "/governance/overview",
        },
        {
          name: "New Proposal",
          url: "/governance/new",
        },
        {
          name: "Staking",
          url: "/governance/staking",
        },
        {
          name: "Stats",
          url: "/governance/metrics",
        },
      ],
    };
  } else {
    infos = {
      title: "Protocol",
      subtitle: "Mobulers",
      list: [
        {
          name: "Overview",
          url: "/protocol/overview",
        },
        {
          name: "First Sort",
          url: "/protocol/sort",
        },
        {
          name: "Final Validation",
          url: "/protocol/validation",
        },
        {
          name: "Pending Pool",
          url: "/protocol/pool",
        },
        {
          name: "Stats",
          url: "/protocol/metrics",
        },
      ],
    };
  }
  return infos;
};
