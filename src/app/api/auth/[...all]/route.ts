import { auth, connectDatabase } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export async function GET(request: Request) {
  await connectDatabase();
  return handlers.GET(request);
}

export async function POST(request: Request) {
  await connectDatabase();
  return handlers.POST(request);
}