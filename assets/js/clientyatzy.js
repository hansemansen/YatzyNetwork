//Eventlistener på kast-click
document.querySelector("#kast").addEventListener("click", async (event) => {
  event.preventDefault() // Stop standardformularindsendelsen

  try {
    // Send data til serveren
    const response = await fetch("/kast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
    if (response.ok) {
      const svar = await response.json()
      if (svar.kast === "ok") {
        // Opdater antallet af kast på GUI
        const antalKastElement = document.querySelector("#antalkast")
        let antalKast = parseInt(antalKastElement.textContent, 10) || 0
        antalKast++
        antalKastElement.textContent = antalKast

        // Kast terningerne
        for (let i = 0; i < 5; i++) {
          if (!svar.hold[i]) {
            //Hvis terningen ikke er holdt
            let a = `/images/${svar.terninger[i]}er.png`

            document.querySelector(`#terning-billede${i + 1}`).src = a
          }
        }
        document.querySelector("#kast-resultat").textContent = ""
      } else {
        // Vis en besked, hvis det ikke er spillerens tur
        document.querySelector("#kast-resultat").textContent = svar.besked
      }
    } else {
      console.error("Fejl i respons:", response.statusText)
    }
  } catch (error) {
    console.error("Fejl:", error)
    alert("Noget gik galt. Prøv igen.")
  }
})

//Eventlistener på terninge-click
document.querySelectorAll(".terning img").forEach((element, index) => {
  element.addEventListener("click", async () => {
    try {
      const response = await fetch("/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ terningeIndex: index }),
      })
      if (response.ok) {
        const result = await response.json()
        if (result.besked === "ok") {
          // Opdater terningens billede
          const newImage = result.isHeld
            ? `/images/${result.value}erblå.png`
            : `/images/${result.value}er.png`
          element.src = newImage
        } else {
          document.querySelector("#kast-resultat").textContent = result.besked
        }
      }
    } catch (error) {
      console.error("Fejl under fetch:", error)
    }
  })
})

// Vælg alle elementer med data-clickable
const clickableElements = document.querySelectorAll("[data-clickable]")

// Eventlisteners på alle felter
clickableElements.forEach((element) => {
  element.addEventListener("click", async () => {
    if (element.dataset.clickable === "false") {
      // Hvis det ikke er klikbart, afslut funktionen uden at gøre noget
      document.querySelector("#kast-resultat").textContent =
        "Vælg et andet felt"
      return
    }

    try {
      const response = await fetch("/pointscalculation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feltId: element.id }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        let feltPoint = result.points

        indsætPoint(feltPoint) // Kald metode der indsætter opdaterede points i GUI
        element.dataset.clickable = "false" //Gør feltet unclickable
        element.style.backgroundColor = "#72bcd4"
        tjekOmSpilletErSlut()
        document.querySelector("#antalkast").textContent = 0

        //Opdater terningebilleder, så de alle er "unhold"
        for (let i = 0; i < 5; i++) {
          terningbillede = `/images/${result.terninger[i]}er.png`
          document.querySelector(`#terning-billede${i + 1}`).src =
            terningbillede

          //Clear beskedfelt
          document.querySelector("#kast-resultat").textContent = ""
        }
      } else {
        document.querySelector("#kast-resultat").textContent = result.message
      }
    } catch (error) {
      console.error("Fejl under fetch:", error)
    }
  })
})

function indsætPoint(spillerPoints) {
  document.getElementById("1ere").value = spillerPoints.ettere
  document.getElementById("2ere").value = spillerPoints.toere
  document.getElementById("3ere").value = spillerPoints.treere
  document.getElementById("4ere").value = spillerPoints.firere
  document.getElementById("5ere").value = spillerPoints.femmere
  document.getElementById("6ere").value = spillerPoints.seksere

  document.getElementById("sum").value = spillerPoints.sum
  document.getElementById("bonus").value = spillerPoints.bonus
  document.getElementById("1par").value = spillerPoints.par
  document.getElementById("2par").value = spillerPoints.toPar
  document.getElementById("3ens").value = spillerPoints.treEns
  document.getElementById("4ens").value = spillerPoints.fireEns
  document.getElementById("fullhouse").value = spillerPoints.fuldHus
  document.getElementById("smallstraight").value = spillerPoints.lilleStraight
  document.getElementById("largestraight").value = spillerPoints.storeStraight
  document.getElementById("chance").value = spillerPoints.chancen
  document.getElementById("yatzy").value = spillerPoints.yatzy
  document.getElementById("total").value = spillerPoints.total
}

function tjekOmSpilletErSlut() {
  const aktiveFelter = document.querySelectorAll('[data-clickable="true"]')
  if (aktiveFelter.length === 0) {
    document.querySelector("#kast-resultat").textContent = "Spillet er slut!"
    console.log("Spillet er slut.")
    window.location.href = "/endgame"
  }
}
