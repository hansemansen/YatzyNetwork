const express = require("express")
const app = express()

app.set("view engine", "pug")

app.use(express.static("assets"))
app.use(express.json())

// Testdata for kunder
const kunder = [
  { nr: 1, navn: "Kenneth", adresse: "Horsevænget 41, Tranbjerg" },
  { nr: 2, navn: "Rikke", adresse: "Københavnergade 1, København" },
];

// GET: Render listen over kunder
app.get("/", (req, res) => {
  res.render("index", { kunder });
});

// GET: Returnér adresse for en specifik kunde
app.get("/:nr", (req, res) => {
  const nr = parseInt(req.params.nr, 10);
  const kunde = kunder.find((k) => k.nr === nr);
  // if (!kunde) {
  //   return res.status(404).json({ error: "Kunde ikke fundet" });
  // }

  res.json({ adresse: kunde.adresse });
});

// Start serveren
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Serveren kører på http://localhost:${PORT}`);
});
