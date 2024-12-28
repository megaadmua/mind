require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/create-payment-intent', async (req, res) => {
  const { items, delivery } = req.body;

  let amount = items.reduce((total, item) => {
    return total + item.quantity * 490;
  }, 0);

  amount += delivery;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // в центах
      currency: 'czk',
      payment_method_types: ['card']
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
