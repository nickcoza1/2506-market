import express from "express";
import requireUser from "#middleware/requireUser";
import {
  getAllProducts,
  getProductById,
  getOrdersForProductAndUser,
} from "#db/queries/products";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/orders", requireUser, async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).send("Product not found");

    const orders = await getOrdersForProductAndUser(req.params.id, req.user.id);
    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
});

export default router;
