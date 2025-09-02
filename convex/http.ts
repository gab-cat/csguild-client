import { httpRouter } from "convex/server";

import { auth } from "./auth/index";

const http = httpRouter();

auth.addHttpRoutes(http);

export default http;
