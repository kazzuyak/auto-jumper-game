import express from "express";
import Bundler from "parcel-bundler";

const app = express();

const clientPath = __dirname + "/../client/game.html";
// const bundler = new Bundler(clientPath, {});
// app.use(bundler.middleware());

app.listen(process.env.PORT || 3000);