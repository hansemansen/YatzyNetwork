document.addEventListener("DOMContentLoaded", () => {
    // Tilføj eventhandler til alle <li> elementer i listen
    document.querySelectorAll("li").forEach((element) => {
      element.addEventListener("click", async () => {
        const nr = element.getAttribute("data-nr"); // Hent kundens nummer
        try {
          const response = await fetch(`/${nr}`); // Hent kundens adresse
          if (response.ok) {
            const data = await response.json();
            document.getElementById("adresse").textContent = data.adresse; // Vis adressen
          } else {
            document.getElementById("adresse").textContent = "Kunde ikke fundet.";
          }
        } catch (error) {
          document.getElementById("adresse").textContent = "Fejl under indlæsning.";
          console.error(error);
        }
      });
    });
  });