import { httpRouter } from "convex/server";

import { auth } from "./authDefinitions/index";

const http = httpRouter();

auth.addHttpRoutes(http);

export default http;
