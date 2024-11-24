// api/createVaultAccount/route.js

import { readFileSync } from "fs";
import { Fireblocks, BasePath } from "@fireblocks/ts-sdk";

const fireblocks = new Fireblocks({
  apiKey: process.env.FIREBLOCKS_API_KEY,
  privateKey: readFileSync("./fireblocks_secret.key", "utf8"),
  basePath: BasePath.Sandbox,
});

export async function POST(req) {
  try {
    const body = await req.json();

    const vaultRequest = {
      createVaultAccountRequest: {
        name: body.name,
        hiddenOnUI: body.hiddenOnUI,
        customerRefId: body.customerRefId,
        autoFuel: body.autoFuel,
      },
    };

    const vaultResponse = await fireblocks.vaults.createVaultAccount(vaultRequest);

    console.log(vaultResponse);

    return new Response(JSON.stringify(vaultResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
