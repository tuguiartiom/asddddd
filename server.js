const express = require("express");
const app = express();
const { resolve } = require("path");
// Replace if using a different env file or config
const env = require("dotenv").config({ path: "./.env" });
const cors = require("cors");
const stripe = require("stripe")(
  "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",
  {
    apiVersion: "2022-08-01",
  }
);

const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

app.get("/", (req, res) => {});

app.get("/config", (req, res) => {
  res.send({
    publishableKey:
      "pk_live_51N9DqQD5UgJ5rX9nG6wbKZr1kyNfdgfDQ4xa6LH5JQBPGAAXB5AOUVep2I8uIoI20IRGXiewzMpbZXdYW7MONBTQ00irWEVucT",
  });
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      amount: req.query.amount,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Node server listening at http://localhost:5252`)
);
