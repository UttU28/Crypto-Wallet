import { readFileSync } from "fs";
import { Fireblocks, BasePath } from "@fireblocks/ts-sdk";

const fireblocks = new Fireblocks({
  apiKey: process.env.FIREBLOCKS_API_KEY,
  privateKey: readFileSync("./fireblocks_secret.key", "utf8"),
  basePath: BasePath.Sandbox,
});

export async function GET(req) {
  try {
    const url = new URL(req.url);

    const email = url.searchParams.get("email");
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email not provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const limit = 10;

    const emailLocalPart = email.split('@')[0];
    const vaults = await fireblocks.vaults.getPagedVaultAccounts({ limit });
    const filteredVaults = vaults.data.accounts.filter(vault => vault.customerRefId && vault.customerRefId.startsWith(emailLocalPart));
    console.log(filteredVaults)
    return new Response(JSON.stringify(filteredVaults), {
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
