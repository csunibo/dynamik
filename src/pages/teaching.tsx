import * as React from "react";
import { Allotment } from "allotment";
import { useParams } from "react-router-dom";

import type { Directory } from "statik";
import { useSWR, STATIK_URL, Teachings } from "../const";
import Viewer, { ViewsContext } from "../components/viewer";
import Files from "../components/files";

const Teaching: React.FC = () => {
  const { teaching, ...others } = useParams<{
    teaching: Teachings;
    "*"?: string;
  }>();
  const path = others["*"];
  const baseURL = path ? (path.endsWith("/") ? path : path + "/") : "";
  const [views] = React.useContext(ViewsContext);
  const { data } = useSWR<Directory>(STATIK_URL(teaching!, "/" + (path || "")));

  return (
    <Allotment defaultSizes={[30, 80]}>
      <Allotment.Pane snap minSize={250}>
        <div className="overflow-y-auto h-full">
          <h1>
            {teaching} - {data?.name}
          </h1>
          <Files baseURL={baseURL} {...data!} />
        </div>
      </Allotment.Pane>
      {views.length > 0 && (
        <Allotment vertical>
          {views.map((view, i) => (
            <Viewer key={i} {...view} />
          ))}
        </Allotment>
      )}
    </Allotment>
  );
};

export default Teaching;
