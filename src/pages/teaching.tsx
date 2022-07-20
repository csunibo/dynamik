import * as React from "react";
import { Allotment } from "allotment";
import { Link, useParams } from "react-router-dom";

import type { File, Directory } from "statik";
import { useSWR, STATIK_URL, Teachings } from "../const";
import Viewer, { ViewsContext } from "../components/viewer";

interface Entry {
  kind: "file" | "directory";
  data: File | Directory;
}

const Teaching: React.FC = () => {
  const { teaching, ...others } = useParams<{
    teaching: Teachings;
    "*"?: string;
  }>();
  const path = others["*"];
  const baseURL = path ? (path.endsWith("/") ? path : path + "/") : "";
  const [views, setViews] = React.useContext(ViewsContext);
  const { data } = useSWR<Directory>(STATIK_URL(teaching!, "/" + (path || "")));
  const { files, directories } = data!;
  const entries: Entry[] = [
    ...((files || []).map((file) => ({ kind: "file", data: file })) as Entry[]),
    ...((directories || []).map((dir) => ({
      kind: "directory",
      data: dir,
    })) as Entry[]),
  ];

  return (
    <Allotment defaultSizes={[30, 80]}>
      <Allotment.Pane snap minSize={250} className="overflow-y-auto">
        <h1>
          {teaching} - {data?.name}
        </h1>
        <div className="grid">
          {entries.map((entry, i) => (
            <React.Fragment key={i}>
              <div>
                {entry.kind == "file" ? (
                  <a onClick={(_) => setViews([...views, entry.data.url])}>
                    {entry.data.name}
                  </a>
                ) : (
                  <Link to={baseURL + entry.data.name}>{entry.data.name}</Link>
                )}
              </div>
              <div>{entry.data.size}</div>
              <div>{entry.data.time.toString()}</div>
            </React.Fragment>
          ))}
        </div>
      </Allotment.Pane>
      {views.length > 0 && (
        <Allotment vertical>
          {views.map((view, i) => (
            <Viewer key={i} url={view} />
          ))}
        </Allotment>
      )}
    </Allotment>
  );
};

export default Teaching;
