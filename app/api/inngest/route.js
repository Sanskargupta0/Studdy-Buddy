import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import {
  CreateNewUser,
  GenerateNotes,
  GenerateStudyTypeContent
} from "@/inngest/functions";
export const runtime = "edge";

export const { GET, POST, PUT } = serve({
  client: inngest,
  streaming: "allow",
  functions: [
    CreateNewUser,
    GenerateNotes,
    GenerateStudyTypeContent,
  ],
});
