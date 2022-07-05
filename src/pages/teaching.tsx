import * as React from "react";
import useSWR from "swr";

import { STATIK_URL, Teachings } from "../const";

const Teaching: React.FC<{ teaching: Teachings }> = ({ teaching }) => {
  console.log(STATIK_URL(teaching, "/"));
  const { data } = useSWR(STATIK_URL(teaching, "/"), { suspense: true });

  return (
    <div>
      teaching: {teaching}
      {data?.toString()}
    </div>
  );
};

export default Teaching;
