import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import usersRouter from "#routes/users";
import productsRouter from "#routes/products";
import ordersRouter from "#routes/orders";

const app = express();

app.use(express.json());
app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

app.use((err, req, res, next) => {
  console.error(err);
  if (!res.headersSent) {
    res.status(500).send("Server error");
  }
});

export default app;
