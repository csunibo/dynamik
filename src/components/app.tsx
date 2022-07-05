import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import { FuzzyContext, FuzzyContextValue } from "./fuzzy";

const App: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <React.StrictMode>
      <ErrorBoundary fallback={<h1 style={{ color: "red" }}>Error</h1>}>
        <React.Suspense fallback={<h1>loading</h1>}>
          <FuzzyContext.Provider
            value={React.useState<FuzzyContextValue>({ data: [], open: true })}
          >
            <BrowserRouter>{children}</BrowserRouter>
          </FuzzyContext.Provider>
        </React.Suspense>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

export default App;
