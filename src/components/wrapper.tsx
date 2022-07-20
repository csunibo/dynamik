import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Outlet, useParams } from "react-router-dom";

import Fuzzy, { FuzzyContext, FuzzyContextValue } from "./fuzzy";
import { useSWR, FUZZY_URL, Teachings } from "../const";
import type { FuzzyFile } from "statik";
import { ViewsContext, ViewsContextValue } from "./viewer";

const Wrapper: React.FC = () => {
  const { teaching } = useParams<{ teaching?: Teachings }>();
  const [open, setOpen] = React.useState<boolean>(false);
  const [views, setViews] = React.useState<ViewsContextValue>([]);
  const { data, error } = useSWR<FuzzyFile[]>(
    teaching ? FUZZY_URL(teaching) : null
  );
  useHotkeys(
    "/, ctrl-k",
    (e) => {
      e.preventDefault();
      setOpen(true);
    },
    [setOpen]
  );

  return (
    <FuzzyContext.Provider
      value={[
        { open, error, data },
        ({ open: o }: FuzzyContextValue) => {
          if (open != o) setOpen(o);
        },
      ]}
    >
      <ViewsContext.Provider value={[views, setViews]}>
        <Outlet />
        <Fuzzy />
      </ViewsContext.Provider>
    </FuzzyContext.Provider>
  );
};

export default Wrapper;
