import { Builder } from "jsr:@fresh/core@^2.2.0/dev";

const builder = new Builder({ serverEntry: "main.jsx" });
await builder.build();
