import * as React from "react";

import type { File } from "statik";

export type ViewsContextValue = File[];

export const ViewsContext = React.createContext<
  [ViewsContextValue, React.Dispatch<ViewsContextValue>]
>([[], void 0 as any]);

const Viewer: React.FC<File> = (file) => {
  const { url } = file;
  const [views, setViews] = React.useContext(ViewsContext);
  const close = React.useCallback(() => {
    setViews(views.filter((f) => f.url != file.url));
  }, [file]);
  return (
    <div className="flex flex-col w-full h-full">
      <div>
        <button onClick={close}>close</button>
      </div>
      <iframe className="flex flex-1" src={url} />
    </div>
  );
};

export default Viewer;
