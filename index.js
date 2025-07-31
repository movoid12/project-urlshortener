require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
const urlDatabase = {};
let urlCounter = 1;

function isValidUrl(userInput) {
  return Promise.resolve(userInput)
    .then((input) => new URL(input))
    .then((url) => url.protocol === "http:" || url.protocol === "https:")
    .catch(() => false);
}

app.use(express.urlencoded());

// Post endpoint to create short URL
app.post("/api/shorturl", (req, res) => {
  const original_url = req.body.url;
  
  if (!isValidUrl(original_url)) {
    return res.json({ error: "invalid url" });
  }

  const short_url = urlCounter++;
  urlDatabase[short_url] = original_url;
  res.json({ original_url, short_url });
});

// GET endpoint to redirect
app.get("/api/shorturl/:short_url", (req, res) => {
  const short_url = req.params.short_url;

  const original_url = urlDatabase[short_url];

  if (original_url) {
    return res.redirect(original_url);
  } else {
    return res.json({ error: "invalid url" });
  }
});

app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
