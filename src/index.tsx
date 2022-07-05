import * as React from "react";
import { render } from "react-dom";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Teachings } from "./const";

import Home from "./pages/home";
import NotFound from "./pages/not-found";
import Teaching from "./pages/teaching";

render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary fallback={<h1 style={{ color: "red" }}>Error</h1>}>
        <React.Suspense fallback={<h1>loading</h1>}>
          <Routes>
            <Route index element={<Home />} />
            {Object.values(Teachings).map((teaching, i) => (
              <Route
                key={i}
                path={`/${teaching}/`}
                element={<Teaching teaching={teaching} />}
              />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </React.Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

if (import.meta.hot) {
  import.meta.hot.accept();
}
