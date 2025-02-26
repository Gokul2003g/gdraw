import express from "express";
import jwt from "jsonwebtoken"
import { middleware } from "./middleware";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types"

const app = express();
const port = 3000;

app.listen(port);

app.post('/signup', (req, res) => {
  const data = CreateUserSchema.safeParse(req.body);
  if (!data.success) {
    res.json({ message: "Incorrect Inputs for Signup" })
    return;
  }

  res.json({ userId: "123" })
})

app.post('/singin', (req, res) => {
  const data = SigninSchema.safeParse(req.body)
  if (!data.success) {
    res.json({ message: "Incorrect inputs for signin" })
    return;
  }
  res.send("Signin route!")
})

app.post("/room", middleware, (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body)
  if (!data.success) {
    res.json({ message: "Incorrect inputs for Room Creation" })
    return;
  }
  res.json({ roomID: 123 })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})
