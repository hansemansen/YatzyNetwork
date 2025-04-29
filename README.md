# Yatzy Multiplayer Game (Node.js + Express)

Et simpelt Yatzy-spil bygget i JavaScript og Express, hvor spillere kan spille sammen over netværk (testet i samme browser/session).

## Funktioner

- Tilføj spiller via forsiden
- Spil Yatzy med rigtige regler
- Tur-baseret spil med kast og hold-funktion
- Pointudregning for hver kategori
- Simpel session-håndtering
- Automatisk visning af resultat-skærm når spillet er slut

## Teknologier brugt

- Node.js & Express
- Express-session til bruger-håndtering
- Pug templating engine
- Vanilla JavaScript (intet framework)
- Live-server rendering
- `yatzybrain.js` som logikmotor

## Sådan kører du det

Clone projektet:
git clone https://github.com/hansemansen/Yatzy.git
cd Yatzy

Installer afhængigheder:
npm install

Start serveren:
node index.js

Åbn browseren på:
http://localhost:8000  
