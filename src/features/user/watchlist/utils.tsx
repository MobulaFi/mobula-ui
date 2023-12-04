import { GET } from "@utils/fetch";

export const editWatchlist = (
  editName: { oldname: string; newname: string },
  address: string,
  alert: any
) => {
  GET("/watchlist/edit", {
    account: address,
    oldname: editName.oldname,
    newname: editName.newname,
  })
    .then((response) => response.json())
    .then((add) => {
      if (add.error) alert.error(add.error);
      else alert.success("Your watchlist has been edited");
    });
};

export const getBackgroundPosition = (router) => {
  if (router.asPath?.split("?")[0] === "/watchlist/followed") return "33.33%";
  if (router.asPath?.split("?")[0] === "/watchlist/explore") return "66%";
  return "1%";
};

export const incrementWatchlistName = (name, watchlists) => {
  const regex = /^(.*?)(\d+)?$/;
  const [, baseName, index] = name.match(regex);
  let newIndex = index ? parseInt(index, 10) + 1 : 1;
  let newName = `${baseName}${newIndex}`;

  // eslint-disable-next-line @typescript-eslint/no-loop-func
  while (watchlists.some((wl) => wl.name === newName)) {
    newIndex += 1;
    newName = `${baseName}${newIndex}`;
  }
  return newName;
};
