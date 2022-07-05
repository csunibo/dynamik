import * as React from "react";
import { Link, useParams } from "react-router-dom";

import type { File, Directory } from "statik";
import { useSWR, STATIK_URL, Teachings } from "../const";

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
    <div>
      <h1>
        {teaching} - {data?.name}
      </h1>
      <div className="grid">
        {entries.map((entry, i) => (
          <React.Fragment key={i}>
            <div>
              {entry.kind == "file" ? (
                <a href={entry.data.url}>{entry.data.name}</a>
              ) : (
                <Link to={(path || "") + "/" + entry.data.name}>
                  {entry.data.name}
                </Link>
              )}
            </div>
            <div>{entry.data.size}</div>
            <div>{entry.data.time.toString()}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Teaching;
