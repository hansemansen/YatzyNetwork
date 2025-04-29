// yatzybrain.js
const Person = require("./person")

class YatzyBrain {
  constructor() {
    this.players = [] // Spillere
    this.currentPlayerIndex = 0 // Hvem har tur
  }

  // Tilføj en spiller
  addPlayer(id, navn) {
    this.players.push(new Person(id, navn))
  }

  // Skift til næste spiller
  nextTurn() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length
  }

  currentPlayerThrows() {
    this.players[this.currentPlayerIndex].rollnumber++
  }

  resetCurrentPlayerThrows() {
    this.currentPlayerIndex = 0
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex]
  }

  clearplayer() {
    let player = this.players[this.currentPlayerIndex]
    player.rollnumber = 0
    player.heldDice = [false, false, false, false, false]
  }

  // Beregn og registrer point for den aktuelle spiller
  calculatePoints(felt, dices) {
    let antalafhver = this.countdices(dices)
    let player = this.players[this.currentPlayerIndex]
    if (felt === "1ere") {
      player.points.ettere = dices.filter((dice) => dice === 1).length
    } else if (felt === "2ere") {
      player.points.toere = dices.filter((dice) => dice === 2).length * 2
    } else if (felt === "3ere") {
      player.points.treere = dices.filter((dice) => dice === 3).length * 3
    } else if (felt === "4ere") {
      player.points.firere = dices.filter((dice) => dice === 4).length * 4
    } else if (felt === "5ere") {
      player.points.femmere = dices.filter((dice) => dice === 5).length * 5
    } else if (felt === "6ere") {
      player.points.seksere = dices.filter((dice) => dice === 6).length * 6
    } else if (felt === "1par") {
      let parscore = 0
      for (let i = 0; i < 6; i++) {
        if (antalafhver[i] > 1) {
          let parcheck = 2 * (i + 1)
          if (parcheck > parscore) {
            parscore = parcheck
          }
        }
      }
      player.points.par = parscore
    } else if (felt === "2par") {
      let toparscore = 0
      let antalpar = 0
      for (let i = 0; i < 6; i++) {
        if (antalafhver[i] > 1) {
          antalpar++
          toparscore += 2 * (i + 1)
        }
      }
      if (antalpar === 1) {
        toparscore = 0
      }
      player.points.toPar = toparscore
    } else if (felt === "3ens") {
      let treensscore = 0
      for (let i = 0; i < 6; i++) {
        if (antalafhver[i] >= 3) {
          treensscore = (i + 1) * antalafhver[i]
        }
      }
      player.points.treEns = treensscore
    } else if (felt === "4ens") {
      let fireensscore = 0
      for (let i = 0; i < 6; i++) {
        if (antalafhver[i] >= 4) {
          fireensscore = (i + 1) * antalafhver[i]
        }
      }
      player.points.fireEns = fireensscore
    } else if (felt === "fullhouse") {
      let fuldhusscore = 0
      let treens = false
      let par = false

      for (let i = 0; i < 6; i++) {
        if (antalafhver[i] == 3) {
          fuldhusscore += (i + 1) * 3
          treens = true
        }
        if (antalafhver[i] == 2) {
          fuldhusscore += (i + 1) * 2
          par = true
        }
      }
      if (!treens || !par) {
        fuldhusscore = 0
      }
      player.points.fuldHus = fuldhusscore
    } else if (felt === "smallstraight") {
      let lillescore = 15
      for (let i = 0; i < 5; i++) {
        if (antalafhver[i] != 1) {
          lillescore = 0
        }
      }
      player.points.lilleStraight = lillescore
    } else if (felt === "largestraight") {
      let storescore = 20
      for (let i = 1; i < 6; i++) {
        if (antalafhver[i] != 1) {
          storescore = 0
        }
      }
      player.points.storeStraight = storescore
    } else if (felt === "chance") {
      let chancenscore = 0
      for (let i = 0; i < 6; i++) {
        chancenscore += antalafhver[i] * (i + 1)
      }
      player.points.chancen = chancenscore
    } else if (felt === "yatzy") {
      let yatzyscore = 0
      for (let i = 0; i < 6; i++) {
        if (antalafhver[i] == 5) {
          yatzyscore = 50
        }
      }
      player.points.yatzy = yatzyscore
    }
    this.udregnSumBonusTotal(player)
    return player.points
  }

  countdices(dices) {
    let arraymedantalafhver = [0, 0, 0, 0, 0, 0]
    for (let i = 0; i < 5; i++) {
      let a = dices[i]
      arraymedantalafhver[a - 1]++
    }
    return arraymedantalafhver
  }

  udregnSumBonusTotal(player) {
    player.points.sum =
      player.points.ettere +
      player.points.toere +
      player.points.treere +
      player.points.firere + 
      player.points.femmere +
      player.points.seksere
    if (player.points.sum >= 63) {
      player.points.bonus = 50 
    }
    player.points.total = 
    player.points.sum +
    player.points.bonus +
    player.points.par +
    player.points.toPar +
    player.points.treEns +
    player.points.fireEns +
    player.points.fuldHus +
    player.points.lilleStraight +
    player.points.storeStraight +
    player.points.chancen +
    player.points.yatzy
  }
}

module.exports = YatzyBrain
