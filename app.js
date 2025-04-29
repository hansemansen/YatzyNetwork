const express = require("express")
const path = require("path")
const session = require("express-session")
const YatzyBrain = require("./assets/js/yatzybrain")

const app = express()
const yatzyBrain = new YatzyBrain()

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, "assets/")))

app.use(
  session({
    secret: "hemmelige_nøgle",
    resave: false, // Gem kun sessionen, hvis den ændres
    saveUninitialized: true, // Gem en session, selvom den ikke er ændret
    cookie: { secure: false }, // Brug secure:true kun over HTTPS
  })
)

// Indstil Pug som template engine
app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

// Route til forsiden
app.get("/", (req, res) => {
  yatzyBrain.players = []
  res.render("frontpage", { spillere: yatzyBrain.players })
})

// Tilføj en spiller
app.post("/", (req, res) => {
  const navn = req.body.username

  // Findes spilleren allerede?
  const eksisterendeSpiller = yatzyBrain.players.find(
    (spiller) => spiller.name === navn
  )

  if (!eksisterendeSpiller) {
    yatzyBrain.addPlayer(req.session.id, navn) // Tilføj spilleren via YatzyBrain
    req.session.spiller = { id: req.session.id, name: navn } // Gem spilleren i sessionen
  }
  res.json({
    spiller: navn,
    spillere: yatzyBrain.players, // Send den opdaterede liste af spillere
  })
})

// Yatzy-side
app.get("/yatzy", (req, res) => {
  const spiller = req.session.spiller

  if (!spiller) {
    // Hvis sessionen ikke findes, send brugeren tilbage til forsiden
    res.redirect("/")
  } else {
    // Render yatzy-siden med spillerens data
    res.render("yatzy", { spiller, spillere: yatzyBrain.players })
  }
})

// Kast terninger
app.post("/kast", (req, res) => {
  const sessionSpiller = req.session.spiller
  const currentPlayer = yatzyBrain.getCurrentPlayer() //aktuel spiller

  // Kontrollér, om sessionens spiller matcher den aktuelle spiller i tur-logikken
  if (sessionSpiller.id === currentPlayer.id) {
    // Det er spillerens tur
    if (currentPlayer.rollnumber < 3) {
      yatzyBrain.currentPlayerThrows()
      let dices = currentPlayer.dice
      let isHeld = currentPlayer.heldDice

      for (let i = 0; i < 5; i++) {
        if (!isHeld[i]) {
          dices[i] = Math.floor(Math.random() * 6) + 1
        }
      }
      res.json({ kast: "ok", terninger: dices, hold: isHeld })
    } else {
      res.json({ kast: "no", besked: "Vælg point-felt." })
    }
  } else {
    // Ikke spillerens tur
    res.json({ kast: "no", besked: "Det er ikke din tur" })
  }
})

//Terninge Hold
app.post("/hold", (req, res) => {
  const sessionSpiller = req.session.spiller
  let holdingPlayer = yatzyBrain.getCurrentPlayer()

  //console.log("Current player:", holdingPlayer.name)
  if (sessionSpiller.id === holdingPlayer.id) {
    if (holdingPlayer.rollnumber === 1 || holdingPlayer.rollnumber === 2) {
      const index = req.body.terningeIndex

      let isHeld = holdingPlayer.heldDice[index]
      let diceValue = holdingPlayer.dice[index]

      if (isHeld) {
        holdingPlayer.heldDice[index] = false
      } else {
        holdingPlayer.heldDice[index] = true
      }
      // Send den opdaterede værdi i responsen
      res.json({
        besked: "ok",
        value: diceValue,
        isHeld: holdingPlayer.heldDice[index],
      })
    } else {
      res.json({ besked: "Du kan ikke holde." })
    }
  } else {
    // Ikke spillerens tur
    res.json({ besked: "Det er ikke din tur!" })
  }
})

app.post("/pointscalculation", (req, res) => {
  const sessionSpiller = req.session.spiller
  const currentPlayer = yatzyBrain.getCurrentPlayer() // Aktuel spiller

  // Kontrollér, om sessionens spiller matcher den aktuelle spiller i tur-logikken
  if (sessionSpiller.id === currentPlayer.id) {
    const { feltId } = req.body // Modtag feltets id fra klienten

    if (currentPlayer.rollnumber !== 0) {
      //Man kan ikke klikke før man har rullet terningerne
      // Testværdi
      let playerPoints = yatzyBrain.calculatePoints(feltId, currentPlayer.dice)

      yatzyBrain.nextTurn()
      yatzyBrain.clearplayer() //Nulstiller kast og holds
      const dices = currentPlayer.dice

      res.json({ success: true, points: playerPoints, terninger: dices })
    } else {
      // Hvis man prøver at klikke på point igen
      res.json({
        success: false,
        message: "Du skal klikke på roll!",
      })
    }
  } else {
    // Hvis det ikke er spillerens tur
    res.json({
      success: false,
      message: "Det er ikke din tur!",
    })
  }
})

app.get("/endgame", async (req, res) => {
  yatzyBrain.getCurrentPlayer().endgame = true
  const spillere = yatzyBrain.players
  console.log(spillere)
  while (!spillere.every((player) => player.endgame === true)) {
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const spillereData = spillere.map((player) => ({
    name: player.name,
    points: player.points.total,
  }))
  res.render("endgame", { spillere: spillereData })
})

// Start serveren
app.listen(8000, () => {
  console.log(`Serveren kører på http://localhost:8000`)
})
