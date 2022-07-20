import * as React from "react";
import { Document, Page } from "react-pdf";

export type ViewsContextValue = string[];

export const ViewsContext = React.createContext<
  [ViewsContextValue, React.Dispatch<ViewsContextValue>]
>([[], void 0 as any]);

const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
  standardFontDataUrl: "standard_fonts/",
};

const Viewer: React.FC<{ url: string }> = ({ url }) => {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  return (
    <Document
      file={url}
      onLoadSuccess={onDocumentLoadSuccess}
      options={options}
    >
      {Array.from({ length: numPages }).map((_, index) => (
        <Page key={index} pageNumber={index + 1} />
      ))}
    </Document>
  );
};

export default Viewer;
