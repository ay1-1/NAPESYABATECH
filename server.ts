import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment configurations
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API secure proxy to get Packet Africa transactions list
  app.get("/api/packet-transactions", async (req, res) => {
    const apiKey = process.env.PACKET_AFRICA_KEY;
    const isApiKeyPlaceholder = !apiKey || apiKey.includes("...") || apiKey === "MY_PACKET_AFRICA_KEY";

    if (isApiKeyPlaceholder) {
      console.log("[Get Transactions] Simulating Packet Africa list fetching...");
      return res.json([
        {
          reference: "TXN-PA-101",
          description: "Faculty Dues Payment",
          amount: "5000",
          status: "SUCCESS",
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          customer: {
            name: "Jane Doe",
            email: "jane.doe@yabatech.edu.ng",
            phone: "+234 809 876 5432",
            customFields: {
              "Matric Number": "F/ND/22/3210002",
              "Department ": "Electrical engineering ",
              "Payment Option": "Returning"
            }
          }
        },
        {
          reference: "TXN-PA-102",
          description: "Departmental Dues Payment",
          amount: "3000",
          status: "SUCCESS",
          createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          customer: {
            name: "Alice Johnson",
            email: "alice.j@yabatech.edu.ng",
            phone: "+234 702 345 6789",
            customFields: {
              "Matric Number": "F/ND/23/3210004",
              "Department ": "Civil engineering ",
              "Payment Option": "Returning"
            }
          }
        },
        {
          reference: "TXN-PA-103",
          description: "Faculty Dues Payment",
          amount: "5000",
          status: "FAILED",
          createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          customer: {
            name: "David Alao",
            email: "david.alao@yabatech.edu.ng",
            phone: "+234 815 555 0199",
            customFields: {
              "Matric Number": "F/HD/22/3210005",
              "Department ": "Chemical engineering ",
              "Payment Option": "Returning"
            }
          }
        }
      ]);
    }

    try {
      const response = await fetch("https://api.packetafrica.com/api/transactions/public/my-transactions", {
        method: "GET",
        headers: {
          "x-packet-key": apiKey,
          "Accept": "application/json",
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Packet Africa API list error (${response.status}):`, errorText);
        return res.status(response.status).json({
          success: false,
          message: `Failed to fetch transactions from Packet Africa: ${response.statusText}`,
          details: errorText
        });
      }

      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Network error while fetching transactions from Packet Africa:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error connecting to Packet Africa.",
        error: error.message
      });
    }
  });

  // API secure proxy for Packet Africa verification
  app.post("/api/verify-napes-payment", async (req, res) => {
    const { matricNumber, email, duesType, reference } = req.body;

    if (!email || !duesType) {
      return res.status(400).json({ success: false, message: "Email and Dues Type are required." });
    }

    const expectedAmount = duesType === "faculty" ? 5000 : 3000;
    const apiKey = process.env.PACKET_AFRICA_KEY;

    // Check if we should fall back to simulation for local testing or placeholder keys
    const isDemoReference = reference && reference.toUpperCase().startsWith("PA-TEST-");
    const isApiKeyPlaceholder = !apiKey || apiKey.includes("...") || apiKey === "MY_PACKET_AFRICA_KEY";

    if (isDemoReference || isApiKeyPlaceholder) {
      console.log(`[Verify Payment] Simulating Packet Africa verification for reference: ${reference || 'N/A'}`);
      return res.json({
        success: true,
        message: "Simulated Packet Africa Payment Verification Successful",
        transaction: {
          id: `pa-tx-${Date.now()}`,
          reference: reference || `PA-${Math.floor(100000 + Math.random() * 900000)}`,
          amount: expectedAmount,
          purpose: duesType === "faculty" ? "Faculty Dues" : "Departmental Dues",
          email: email,
          matricNumber: matricNumber || "N/A",
          date: new Date().toISOString(),
          status: "success"
        }
      });
    }

    try {
      const response = await fetch("https://api.packetafrica.com/api/transactions/public/my-transactions", {
        method: "GET",
        headers: {
          "x-packet-key": apiKey,
          "Accept": "application/json",
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Packet Africa API error (${response.status}):`, errorText);
        return res.status(response.status).json({
          success: false,
          message: `Failed to fetch transactions from Packet Africa: ${response.statusText}`,
          details: errorText
        });
      }

      const data = await response.json();
      const transactions = Array.isArray(data) ? data : (data.data || []);

      // Search for a matching transaction
      const matchingTx = transactions.find((tx: any) => {
        const txStatus = (tx.status || "").toLowerCase();
        const isSuccess = txStatus === "success" || txStatus === "successful" || txStatus === "completed" || txStatus === "paid";
        if (!isSuccess) return false;

        const txAmount = parseFloat(tx.amount || "0");
        const txTotalAmount = parseFloat(tx.totalAmount || "0");
        if (txAmount !== expectedAmount && txTotalAmount !== expectedAmount) return false;

        if (reference) {
          return (tx.reference || "").toLowerCase() === reference.toLowerCase() ||
                 (tx.id || "").toString().toLowerCase() === reference.toLowerCase();
        }

        const txEmail = (tx.email || (tx.customer && tx.customer.email) || "").trim().toLowerCase();
        const studentEmail = email.trim().toLowerCase();

        let txMatric = "";
        if (tx.matricNumber) {
          txMatric = tx.matricNumber;
        } else if (tx.metadata && (tx.metadata.matricNumber || tx.metadata.matric)) {
          txMatric = tx.metadata.matricNumber || tx.metadata.matric;
        } else if (tx.customer && tx.customer.customFields) {
          const customKeys = Object.keys(tx.customer.customFields);
          const matricKey = customKeys.find(k => k.toLowerCase().includes("matric"));
          if (matricKey) {
            txMatric = tx.customer.customFields[matricKey];
          }
        }
        
        const studentMatric = (matricNumber || "").trim().toLowerCase();
        const cleanTxMatric = (txMatric || "").trim().toLowerCase();

        return (txEmail && txEmail === studentEmail) || (studentMatric && cleanTxMatric === studentMatric);
      });

      if (matchingTx) {
        return res.json({
          success: true,
          message: "Payment successfully verified against Packet Africa ledger.",
          transaction: {
            id: matchingTx.id || matchingTx.reference,
            reference: matchingTx.reference || matchingTx.id,
            amount: matchingTx.amount,
            purpose: duesType === "faculty" ? "Faculty Dues" : "Departmental Dues",
            email: matchingTx.email || (matchingTx.customer && matchingTx.customer.email),
            matricNumber: matricNumber,
            date: matchingTx.createdAt || matchingTx.date || new Date().toISOString(),
            status: "success"
          }
        });
      } else {
        return res.json({
          success: false,
          message: `No matching successful payment of ₦${expectedAmount.toLocaleString()} found on Packet Africa for email ${email}${reference ? ` with reference ${reference}` : ''}. Please check your payment receipt.`
        });
      }

    } catch (error: any) {
      console.error("Network error while verifying payment with Packet Africa:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error connecting to Packet Africa.",
        error: error.message
      });
    }
  });

  // API placeholder for paystack verification
  app.post("/api/verify-payment", (req, res) => {
    res.json({ status: "success", message: "Payment verified simulated" });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NAPES Hub Running on http://localhost:${PORT}`);
  });
}

startServer();
