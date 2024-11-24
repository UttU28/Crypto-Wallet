// api/getAllVaultAccounts/route.js

import { readFileSync } from "fs";
import { Fireblocks, BasePath } from "@fireblocks/ts-sdk";

const fireblocks = new Fireblocks({
  apiKey: process.env.FIREBLOCKS_API_KEY,
  privateKey: readFileSync("./fireblocks_secret.key", "utf8"),
  basePath: BasePath.Sandbox,
});

export async function GET() {
  try {
    const limit = 10; // Set the limit or fetch from query params if needed
    const vaults = await fireblocks.vaults.getPagedVaultAccounts({ limit });

    return new Response(JSON.stringify(vaults), {
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
