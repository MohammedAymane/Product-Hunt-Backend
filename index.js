const express = require("express");
const cors = require("cors");

const corsOption = {
  origin: "http://localhost:4200", // L'origine autorisée pour les requêtes CORS
};

const app = express();

// Initialisation des middlewares
app.use(cors(corsOption)); // Utilisation du middleware CORS pour gérer les requêtes cross-origin
app.use(express.json({ extended: false })); // Utilisation du middleware express.json() pour analyser les corps de requête JSON

// Endpoint racine pour vérifier si l'API fonctionne
app.get("/", (req, res) => {
  res.send("API running");
});

// Define Routes
app.use("/products", require("./routes/products")); // Utilisation des routes définies dans le fichier "./routes/products"

const PORT = process.env.PORT || 9000;

// Démarrage du serveur sur le port spécifié
app.listen(PORT, () => {
  console.log("Server started on port : " + PORT);
});
