import { createBrowserHistory } from "@shuvi/runtime-react/lib/runtime/router/history";
import { createBootstrap } from "./create-bootstrap";

export const bootstrap = createBootstrap({
  historyCreator: createBrowserHistory
});
