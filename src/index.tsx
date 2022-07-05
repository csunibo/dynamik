import * as React from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route } from "react-router-dom";

import App from "./components/app";
import Wrapper from "./components/wrapper";

import Home from "./pages/home";
import NotFound from "./pages/not-found";
import Teaching from "./pages/teaching";

createRoot(document.getElementById("root")!).render(
  <App>
    <Wrapper />
    <Routes>
      <Route index element={<Home />} />
      <Route path="/:teaching" element={<Wrapper />}>
        <Route path=":path" element={<Teaching />} />
        <Route path="" element={<Teaching />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </App>
);

if (import.meta.hot) {
  import.meta.hot.accept();
}
