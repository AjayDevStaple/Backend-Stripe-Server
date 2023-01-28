require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors')
const Stripe = require("stripe") // https://stripe.com/docs/keys#obtain-api-keys
const stripe = Stripe("sk_test_51MUnM2SETy7mFsBWGV3g28ADtelefsmHqJ2dSVIOjwQ14BOO8CD8RCBFHNlTZHtF9h1XhU9L6UMx8KN2NTRw0VnD00lpXvkXeq");
// app.use(express.static("."));
app.use(express.json());
app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));
// An endpoint for your checkout 

console.log('i am here')
app.get("/", (req, res) => {
    console.log("----------")

    res.send("helllo")
});

app.post("/pay", async (req, res) => {
    try {
        console.log("pay working")
        // const {name} = req.body
        let customer = await stripe.customers.create(); // This example just creates a new Customer every time

        // Create an ephemeral key for the Customer; this allows the app to display saved payment methods and save new ones
        const ephemeralKey = await stripe.ephemeralKeys.create(
            { customer: customer.id },
            { apiVersion: '2020-08-27' }
        );

        // Create a PaymentIntent with the payment amount, currency, and customer
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1,
            currency: "usd",
            payment_method_types: ['card'],
            customer: customer.id,
            description: 'Software development services',
        });
        const client_secret = paymentIntent.client_secret
        res.json({ client_secret })
        // Send the object keys to the client
        // res.send({
        //     publishableKey: process.env.publishable_key, // https://stripe.com/docs/keys#obtain-api-keys
        //     paymentIntent: paymentIntent.client_secret,
        //     customer: customer.id,
        //     ephemeralKey: ephemeralKey.secret
        // });
    } catch (err) {
        res.status(500).send(err)
        console.log(err)
    }
});

app.listen(8000, () =>
    console.log(`Node server listening on port 8000`)
);