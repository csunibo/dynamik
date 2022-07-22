import * as React from "react";
import useResizeObserver from "@react-hook/resize-observer";
import { Link } from "react-router-dom";

import { ViewsContext } from "../components/viewer";
import type { Directory, File } from "statik";

type Entry = FileEntry | DirectoryEntry;
interface FileEntry {
  kind: "file";
  data: File;
}
interface DirectoryEntry {
  kind: "directory";
  data: Directory;
}

enum Sizes {
  SM = 640,
  MD = 768,
  LG = 1024,
}

const useSize = <T extends HTMLElement>(target: React.RefObject<T>) => {
  const [size, setSize] = React.useState<DOMRectReadOnly>();

  React.useLayoutEffect(() => {
    if (target.current) setSize(target.current.getBoundingClientRect());
  }, [target]);

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect));
  return size;
};

const Files: React.FC<Directory & { baseURL: string }> = ({
  files,
  directories,
  baseURL,
}) => {
  const grid = React.useRef(null);
  const size = useSize(grid);
  const [views, setViews] = React.useContext(ViewsContext);
  const entries: Entry[] = [
    ...(files || []).map(
      (file): FileEntry => ({
        kind: "file",
        data: file,
      })
    ),
    ...(directories || []).map(
      (dir): DirectoryEntry => ({
        kind: "directory",
        data: dir,
      })
    ),
  ];
  return (
    <div
      ref={grid}
      className={`grid ${
        (size?.width || 0) >= Sizes.LG
          ? "grid-cols-3"
          : (size?.width || 0) >= Sizes.MD
          ? "grid-cols-2"
          : "grid-cols-1"
      }`}
    >
      {entries.map((entry, i) => (
        <React.Fragment key={i}>
          <div>
            {entry.kind == "file" ? (
              <a onClick={(_) => setViews([...views, entry.data])}>
                {entry.data.name}
              </a>
            ) : (
              <Link to={baseURL + entry.data.name}>{entry.data.name}</Link>
            )}
          </div>
          <div className={(size?.width || 0) <= Sizes.MD ? "hidden" : ""}>
            {entry.data.size}
          </div>
          <div className={(size?.width || 0) <= Sizes.LG ? "hidden" : ""}>
            {entry.data.time.toString()}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Files;
