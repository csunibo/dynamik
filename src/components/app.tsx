import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

const App: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <React.StrictMode>
      <ErrorBoundary fallback={<h1 style={{ color: "red" }}>Error</h1>}>
        <React.Suspense fallback={<h1>loading</h1>}>
          <BrowserRouter>{children}</BrowserRouter>
        </React.Suspense>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

export default App;
