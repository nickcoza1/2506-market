import express from "express";
import requireUser from "#middleware/requireUser";
import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  addProductToOrder,
  getProductsInOrder,
} from "#db/queries/orders";
import { getProductById } from "#db/queries/products";

const router = express.Router();

router.post("/", requireUser, async (req, res, next) => {
  try {
    const { date, note } = req.body;
    if (!date) return res.status(400).send("date required");

    const order = await createOrder({ userId: req.user.id, date, note });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

router.get("/", requireUser, async (req, res, next) => {
  try {
    const orders = await getOrdersByUser(req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireUser, async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send("Order not found");
    if (order.user_id !== req.user.id) return res.status(403).send("Forbidden");
    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/products", requireUser, async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send("Order not found");
    if (order.user_id !== req.user.id) return res.status(403).send("Forbidden");

    const { productId, quantity } = req.body;
    if (!productId || !quantity)
      return res.status(400).send("productId and quantity required");

    const product = await getProductById(productId);
    if (!product) return res.status(400).send("Product does not exist");

    const added = await addProductToOrder(order.id, productId, quantity);
    res.status(201).json(added);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/products", requireUser, async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) return res.status(404).send("Order not found");
    if (order.user_id !== req.user.id) return res.status(403).send("Forbidden");

    const products = await getProductsInOrder(order.id);
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

export default router;
