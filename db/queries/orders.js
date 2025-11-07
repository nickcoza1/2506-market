import db from "#db/client";

export async function createOrder({ userId, date, note }) {
  const { rows } = await db.query(
    `
    INSERT INTO orders (date, note, user_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `,
    [date, note ?? null, userId]
  );
  return rows[0];
}

export async function getOrdersByUser(userId) {
  const { rows } = await db.query(
    `
    SELECT *
    FROM orders
    WHERE user_id = $1
    ORDER BY id;
  `,
    [userId]
  );
  return rows;
}

export async function getOrderById(id) {
  const { rows } = await db.query(
    `
    SELECT *
    FROM orders
    WHERE id = $1;
  `,
    [id]
  );
  return rows[0];
}

export async function addProductToOrder(orderId, productId, quantity) {
  const { rows } = await db.query(
    `
    INSERT INTO orders_products (order_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *;
  `,
    [orderId, productId, quantity]
  );
  return rows[0];
}

export async function getProductsInOrder(orderId) {
  const { rows } = await db.query(
    `
    SELECT p.*, op.quantity
    FROM orders_products op
    JOIN products p ON op.product_id = p.id
    WHERE op.order_id = $1;
  `,
    [orderId]
  );
  return rows;
}
