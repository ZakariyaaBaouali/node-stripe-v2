import { Router, Request, Response } from "express";
import Stripe from "stripe";
import { SERVER_PORT, STRIPE_SECRET_KEY } from "../config";
import { Cart } from "../dto";

const route = Router();
const stripe = new Stripe(STRIPE_SECRET_KEY);

route.get("/checkout", async (req: Request, res: Response) => {
  const cartItems: Cart = {
    userId: 1212122,
    id: 232323,
    name: "product-1",
    desc: "great product",
    qte: 2,
    price: 10.5,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNSxf5ha2-HCoZC08jbZrh74U_FlUctCpjsg&s",
  };
  const customer = await stripe.customers.create({
    metadata: {
      userId: cartItems.userId,
      items: JSON.stringify(cartItems),
    },
  });
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: cartItems.price * 100,
          product_data: {
            name: cartItems.name,
            description: cartItems.desc,
            images: [cartItems.image],
            metadata: {
              id: cartItems.id,
            },
          },
        },
        quantity: cartItems.qte,
      },
    ],
    customer: customer.id,
    shipping_address_collection: {
      allowed_countries: ["US", "GE", "MA"],
    },
    mode: "payment",
    success_url: `http://localhost:${SERVER_PORT}/stripe/complete?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:${SERVER_PORT}/stripe/failed`,
  });

  res.status(200).send(session.url);
});

route.get("/complete", async (req: Request, res: Response) => {
  const session_id = req.query.session_id as string;
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["payment_intent.payment_method"],
  });
  const customer_id = session.customer as string;
  const customer = await stripe.customers.retrieve(customer_id);
  //add customer and session data to db
  res.status(200).send(session);
});

route.get("/failed", async (req: Request, res: Response) => {
  res.status(200).send("ok");
});

export default route;
