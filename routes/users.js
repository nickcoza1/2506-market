import express from "express";
import bcrypt from "bcrypt";
import { createToken } from "#utils/jwt";
import { createUser, getUserByUsername } from "#db/queries/users";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).send("username and password required");

    const existing = await getUserByUsername(username);
    if (existing) return res.status(400).send("username already exists");

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser(username, passwordHash);

    const token = createToken({ id: user.id });
    res.status(201).send(token);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).send("username and password required");

    const user = await getUserByUsername(username);
    if (!user) return res.status(401).send("Unauthorized");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).send("Unauthorized");

    const token = createToken({ id: user.id });
    res.status(200).send(token);
  } catch (err) {
    next(err);
  }
});

export default router;
