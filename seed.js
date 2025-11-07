import db from "#db/client";
import fs from "fs/promises";
import bcrypt from "bcrypt";

await db.connect();

const schema = await fs.readFile("./db/schema.sql", "utf-8");
await db.query(schema);

const hashed = await bcrypt.hash("password123", 10);
const {
  rows: [user],
} = await db.query(
  `
  INSERT INTO users (username, password)
  VALUES ($1, $2)
  RETURNING *;
`,
  ["seeduser", hashed]
);

const products = [
  ["Phone", "Nice phone", 699.99],
  ["Laptop", "Nice laptop", 1299.99],
  ["Headphones", "Nice headphones", 199.99],
  ["Mouse", "Wireless mouse", 29.99],
  ["Keyboard", "Mech keyboard", 89.99],
  ["Monitor", "4K monitor", 299.99],
  ["Backpack", "Everyday bag", 59.99],
  ["Bottle", "Water bottle", 19.99],
  ["Webcam", "HD webcam", 79.99],
  ["Mic", "USB mic", 99.99],
];

const productIds = [];
for (const [title, description, price] of products) {
  const {
    rows: [p],
  } = await db.query(
    `
    INSERT INTO products (title, description, price)
    VALUES ($1, $2, $3)
    RETURNING *;
  `,
    [title, description, price]
  );
  productIds.push(p.id);
}

const {
  rows: [order],
} = await db.query(
  `
  INSERT INTO orders (date, note, user_id)
  VALUES (CURRENT_DATE, 'seed order', $1)
  RETURNING *;
`,
  [user.id]
);

for (const pid of productIds.slice(0, 5)) {
  await db.query(
    `
    INSERT INTO orders_products (order_id, product_id, quantity)
    VALUES ($1, $2, $3);
  `,
    [order.id, pid, 1]
  );
}

console.log("🌱 Seed complete.");
await db.end();
