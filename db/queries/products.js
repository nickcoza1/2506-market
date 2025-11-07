import db from "#db/client";

export async function getAllProducts() {
  const { rows } = await db.query(`
    SELECT *
    FROM products
    ORDER BY id;
  `);
  return rows;
}

export async function getProductById(id) {
  const { rows } = await db.query(
    `
    SELECT *
    FROM products
    WHERE id = $1;
  `,
    [id]
  );
  return rows[0];
}

export async function getOrdersForProductAndUser(productId, userId) {
  const { rows } = await db.query(
    `
    SELECT o.*
    FROM orders o
    JOIN orders_products op ON o.id = op.order_id
    WHERE op.product_id = $1
      AND o.user_id = $2
    ORDER BY o.id;
  `,
    [productId, userId]
  );
  return rows;
}
