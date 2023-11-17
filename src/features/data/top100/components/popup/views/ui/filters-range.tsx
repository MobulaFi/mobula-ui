import { Button } from "components/button";
import { Input } from "components/input";
import { SmallFont } from "../../../../../../../components/fonts";

export const FiltersRange = ({ state, setState }) => {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
        <div className="flex flex-col w-1/2 mr-[5px]">
          <SmallFont>From</SmallFont>
          <Input
            placeholder={state.from}
            type="number"
            onChange={(e) =>
              setState((prev) => ({ ...prev, from: e.target.value }))
            }
          />
        </div>
        <div className="flex flex-col w-1/2 ml-[5px]">
          <SmallFont>To</SmallFont>
          <Input
            placeholder={state.to}
            type="number"
            onChange={(e) =>
              setState((prev) => ({ ...prev, to: e.target.value }))
            }
          />
        </div>
      </div>
      <Button>Reset</Button>
    </div>
  );
};
