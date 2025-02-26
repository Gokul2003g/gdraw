import express from "express";
import jwt from "jsonwebtoken"

const app = express();
const port = 3000;

app.listen(port);

app.post('/signup', (req, res) => {
  res.send("Hello World!")
})

app.post('/singin', (req, res) => {
  res.send("Signin route!")
})

app.post("/room", (req, res) => {

})
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})
