import { prototypeFileOrHtmlResponse } from "@/lib/prototypeResponse";

export function GET(request: Request) {
  return prototypeFileOrHtmlResponse("usls-graduate-lifecycle", request);
}
