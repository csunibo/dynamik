import * as React from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import NotFound from "./pages/not-found";
import Teaching from "./pages/teaching";

const App: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <React.StrictMode>
    <ErrorBoundary fallback={<h1 style={{ color: "red" }}>Error</h1>}>
      <React.Suspense fallback={<h1>loading</h1>}>
        <BrowserRouter>{children}</BrowserRouter>
      </React.Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);

createRoot(document.getElementById("root")!).render(
  <App>
    <Routes>
      <Route index element={<Home />} />
      <Route path="/:teaching/:path" element={<Teaching />} />
      <Route path="/:teaching" element={<Teaching />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </App>
);

if (import.meta.hot) {
  import.meta.hot.accept();
}
