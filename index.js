const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());

let accessToken = "";

app.get("/", (req, res) => {
  res.json({ message: "Backend API running on port 5000" });
});

// Login API
app.post("/login", async (req, res) => {
  const { apiKey, requestToken } = req.body;

  try {
    const response = await axios.post(
      "https://api.kite.trade/session/token",
      {
        api_key: apiKey,
        request_token: requestToken,
        checksum: "checksum_placeholder",
      },
      {
        headers: {
          "X-Kite-Version": "3",
          "Content-Type": "application/json",
        },
      }
    );

    accessToken = response.data.data.access_token;
    res.json({ message: "Login Successful", accessToken });
  } catch (error) {
    res.status(500).json({ message: "Login Failed", error: error.message });
  }
});

// Order API
app.post("/order", async (req, res) => {
  const { tradingsymbol, quantity, transactionType } = req.body;

  try {
    await axios.post(
      "https://api.kite.trade/orders/regular",
      {
        tradingsymbol,
        quantity,
        transaction_type: transactionType,
        order_type: "MARKET",
        exchange: "NSE",
        product: "MIS",
        validity: "DAY",
      },
      {
        headers: {
          "X-Kite-Version": "3",
          Authorization: `token ${accessToken}`,
        },
      }
    );

    res.json({ message: "Order Placed Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Order Failed", error: error.message });
  }
});

app.listen(5000, () => {
  console.log("Backend API running on port 5000");
});
