import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getGameLaunchAccess } from "@/lib/admin-data";
import { getGameInstanceId } from "@/lib/game-tickets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const assetRoot = "/game-assets/dd-project/html5game/";

function runtimeHtml(instanceId: string) {
  const serializedInstance = JSON.stringify(instanceId);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <meta name="color-scheme" content="dark">
  <title>DD Project</title>
  <style>
    * { box-sizing: border-box; }
    html, body { width: 100%; height: 100%; margin: 0; overflow: hidden; background: #050505; }
    body { display: grid; place-items: center; }
    #gm4html5_div_id { width: min(100vw, calc(100vh * 1.111111)); aspect-ratio: 10 / 9; }
    canvas { display: block; width: 100%; height: 100%; margin: 0; image-rendering: pixelated; touch-action: none; }
  </style>
</head>
<body>
  <div class="gm4html5_div_class" id="gm4html5_div_id">
    <canvas id="canvas" width="480" height="432" tabindex="0" aria-label="DD Project game canvas">
      Your browser does not support HTML5 canvas.
    </canvas>
  </div>
  <script src="${assetRoot}DD-Project.js"></script>
  <script>
    window.__MIGUISANSON_GAME_INSTANCE__ = ${serializedInstance};
    g_GameMakerHTML5Dir = ${JSON.stringify(assetRoot)};
    window.addEventListener("load", function () {
      GameMaker_Init();
      document.getElementById("canvas").focus();
    });
  </script>
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id || !session.user.emailVerified) {
    return new NextResponse("Authentication required.", { status: 401 });
  }

  const access = await getGameLaunchAccess(session.user);
  if (!access.allowed) {
    return new NextResponse(access.message ?? "Game access denied.", { status: 403 });
  }

  const instanceId = getGameInstanceId(session.user.id, "dd-project");
  return new NextResponse(runtimeHtml(instanceId), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "same-origin",
    },
  });
}
