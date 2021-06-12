import express from "express";
import path from "path";

const app = express();

app.use(express.static(path.join(__dirname, "../client")))

app.get("/", (_req: any, res: any) => {
  res.sendFile(path.join(__dirname, "../client/game.html"))
})

app.listen(process.env.PORT || 3000);