import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "studdy-buddy",
  signingKey: process.env.INNGEST_SIGNING_KEY,
});
