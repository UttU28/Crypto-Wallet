// api/createTransaction/route.js
import { readFileSync } from "fs";
import { Fireblocks, BasePath, TransferPeerPathType } from "@fireblocks/ts-sdk";

const fireblocks = new Fireblocks({
  apiKey: process.env.FIREBLOCKS_API_KEY,
  privateKey: readFileSync("./fireblocks_secret.key", "utf8"),
  basePath: BasePath.Sandbox,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { assetId, amount, sourceVaultId, destinationVaultId, note, externalAddress, isExternal } = body;

    if (!assetId || !amount || !sourceVaultId || (!isExternal && !destinationVaultId) || (isExternal && !externalAddress)) {
      throw new Error(
        "Missing required fields: assetId, amount, sourceVaultId, destinationVaultId or externalAddress"
      );
    }

    // Construct the transaction payload
    const transactionPayload = {
      assetId,
      amount: `${amount}`,
      source: {
        type: TransferPeerPathType.VaultAccount,
        id: sourceVaultId,
      },
      destination: isExternal
        ? {
            type: TransferPeerPathType.OneTimeAddress,
            oneTimeAddress: { address: externalAddress },
          }
        : {
            type: TransferPeerPathType.VaultAccount,
            id: destinationVaultId,
          },
      note: note || "No note provided",
    };

    // Call Fireblocks API to create the transaction
    const transactionResponse = await fireblocks.transactions.createTransaction({
      transactionRequest: transactionPayload,
    });

    return new Response(JSON.stringify(transactionResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Transaction Error:", error.message || error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
