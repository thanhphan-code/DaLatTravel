import { createChatHandler } from "./handler.ts";

Deno.serve(createChatHandler({ getEnv: (name) => Deno.env.get(name), fetch }));
