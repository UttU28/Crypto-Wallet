// Importing modules
const express = require("express");
const { readFileSync } = require("fs");
const { Fireblocks, BasePath, TransferPeerPathType,  } = require("@fireblocks/ts-sdk");
import { Request, Response } from "express";

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Fireblocks setup
const fireblocks = new Fireblocks({
    apiKey: process.env.FIREBLOCKS_API_KEY,
    privateKey: readFileSync("./fireblocks_secret.key", "utf8"),
    basePath: BasePath.Sandbox,
});

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to DD backend!');
});

app.post('/', (req: Request, res: Response) => {
    const requestBody = req.body;
    res.send({ message: 'POST request received', data: requestBody });
});

app.get('/getAllVaults', async (req: Request, res: Response) => {
    try {
        const limit = 10;
        const vaults = await fireblocks.vaults.getPagedVaultAccounts({ limit });
        res.status(200).json(vaults.data.accounts);
    } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

app.post('/getUserVault', async (req: Request, res: Response) => {
  try {
      const { email } = req.body;
      if (!email) {
          return res.status(400).json({ error: 'Email not provided' });
      }
      const limit = 10;
      const emailLocalPart = email.split('@')[0];
      const vaults = await fireblocks.vaults.getPagedVaultAccounts({ limit });
      console.log(email);
      console.log(vaults);
      const filteredVaults = vaults.data.accounts.filter((vault: { customerRefId?: string }) =>
          vault.customerRefId && vault.customerRefId.startsWith(emailLocalPart)
      );

      res.status(200).json(filteredVaults);
  } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
          res.status(500).json({ error: error.message });
      } else {
          res.status(500).json({ error: 'Internal Server Error' });
      }
  }
});

app.post('/createVaultAccount', async (req: Request, res: Response) => {
  try {
    const { name, hiddenOnUI, customerRefId, autoFuel } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Vault name is required." });
    }
    const vaultRequest = {
      createVaultAccountRequest: {
        name,
        hiddenOnUI: hiddenOnUI || false,
        customerRefId: customerRefId || null,
        autoFuel: autoFuel || false,
      },
    };
    const vaultResponse = await fireblocks.vaults.createVaultAccount(vaultRequest);
    res.status(200).json(vaultResponse);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.post("/createTransaction", async (req: Request, res: Response) => {
  try {
    const { assetId, amount, sourceVaultId, destinationVaultId, note, externalAddress, isExternal, } = req.body;
    if (
      !assetId ||
      !amount ||
      !sourceVaultId ||
      (!isExternal && !destinationVaultId) ||
      (isExternal && !externalAddress)
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: assetId, amount, sourceVaultId, destinationVaultId or externalAddress",
      });
    }

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

    const transactionResponse = await fireblocks.transactions.createTransaction({
      transactionRequest: transactionPayload,
    });

    res.status(200).json(transactionResponse);
  } catch (error: unknown) {
    console.error("Transaction Error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.post("/addVaultAccountAsset", async (req: Request, res: Response) => {
  try {
    const { vaultAccountId, assetId } = req.body;
    if (!vaultAccountId || !assetId) {
      return res.status(400).json({
        error: "Missing required fields: vaultAccountId and assetId",
      });
    }
    const vaultWallet = await fireblocks.vaults.createVaultAccountAsset({
      vaultAccountId,
      assetId,
    });
    res.status(200).json(vaultWallet.data);
  } catch (error: unknown) {
    console.error("Error adding asset to vault account:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.listen(PORT, () => {
    console.log('The application is listening on port http://localhost:' + PORT);
});
