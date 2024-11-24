// api/addVaultAsset/route.js

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

    const { vaultAccountId, assetId } = body;

    const vaultWallet = await fireblocks.vaults.createVaultAccountAsset({
      vaultAccountId,
      assetId,
    });

    return new Response(JSON.stringify(vaultWallet), {
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
