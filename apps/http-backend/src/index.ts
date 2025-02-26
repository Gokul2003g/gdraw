import express from "express";
import jwt from "jsonwebtoken"
import { middleware } from "./middleware";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/client"
import { JWT_SECRET } from "@repo/backend-common/config";

const app = express();
const port = 3002;
app.use(express.json());;

app.post('/signup', async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({ message: "Incorrect Inputs for Signup" })
    return;
  }
  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data?.username,
        // FIX: hash the password bcrypt lib
        password: parsedData.data?.password,
        name: parsedData.data?.name
      }
    })
    res.json({ userId: user.id })
  } catch (e) {
    res.status(411).json({
      message: "User already exists with this username"
    })
  }
})

app.post('/signin', async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body)
  if (!parsedData.success) {
    res.json({ message: "Incorrect inputs for signin" })
    return;
  }

  try {
    const user = await prismaClient.user.findFirst({
      where: {
        email: parsedData.data.username,
        // FIX: Compare the hashed passwords
        password: parsedData.data.password
      }
    })

    if (!user) {
      res.status(403).json({ message: "Not Authorized" })
    }

    console.log(JWT_SECRET)
    const token = jwt.sign({ userId: user?.id }, JWT_SECRET)
    console.log("error here")
    res.json({ token })
  } catch (e) {
    res.status(411).json({ message: "Error signing in" })
  }
})

app.post("/room", middleware, async (req, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body)
  if (!parsedData.success) {
    res.json({ message: "Incorrect inputs for Room Creation" })
    return;
  }

  // TODO: remove ts error
  //@ts-ignore
  const userId = req.userId;

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId
      }
    })
    res.json({ roomID: room.id })
  } catch (e) {
    res.json({ message: "Room already exists" })
  }
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})
