import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Outlet, useParams } from "react-router-dom";

import Fuzzy, { FuzzyContext } from "./fuzzy";
import { useSWR, FUZZY_URL, Teachings } from "../const";
import type { FuzzyFile } from "statik";

const Wrapper: React.FC = () => {
  const { teaching } = useParams<{ teaching?: Teachings }>();
  const [_, setFuzzy] = React.useContext(FuzzyContext);
  const { data, error } = useSWR<FuzzyFile[]>(
    teaching ? FUZZY_URL(teaching) : null
  );
  useHotkeys("/, ctrl-k", (e) => {
    e.preventDefault();
    setFuzzy({ data: data, error: error, open: true });
  });

  return (
    <>
      <Outlet />
      <Fuzzy />
    </>
  );
};

export default Wrapper;
