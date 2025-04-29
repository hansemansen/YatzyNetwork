document.querySelector("#playerForm").addEventListener("submit", async (event) => {
    event.preventDefault() 

    const username = document.querySelector("#username").value

    try {
      // Send data til serveren
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })

      if (response.ok) {
        const result = await response.json()
        const navn = result.spiller
        alert(`Spilleren ${navn} er blevet tilføjet!`)

        opdaterSpillerListeHTML(result.spillere)
      } else {
        alert("Noget gik galt. Prøv igen.")
      }
    } catch (error) {
      console.error("Fejl:", error)
      alert("Noget gik galt. Prøv igen.")
    }
  })

function opdaterSpillerListeHTML(spillere) {
  const spillerListe = document.querySelector("#playerList")
  spillerListe.innerHTML = "" // Ryd den eksisterende liste
  spillere.forEach((spiller) => {
    const li = document.createElement("li")
    li.textContent = spiller.name
    spillerListe.appendChild(li)
  })
}


