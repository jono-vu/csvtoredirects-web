import { render } from "preact";
import { ChakraProvider } from "@chakra-ui/react";

import { App } from "./app.tsx";

import "./index.css";

render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  document.getElementById("app")!
);
