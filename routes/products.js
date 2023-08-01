const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

const url = process.env.HOST;
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.API_KEY}`,
};

/**
 * Endpoint pour obtenir tous les posts.
 * Méthode : GET
 * URL : /api/posts
 */
router.get("/", async (req, res) => {
  const query = `{
    posts{
      edges {
        node {
          id
          name
          description
          createdAt
          topics {
            edges {
              node {
                id
                name
              }
            }
          }
          thumbnail {
            url
          }
        }
      }
    }
  }
  `;

  try {
    const response = await axios.post(url, { query }, { headers });
    // Remplace l'objet thumbnail par une chaîne de caractères url et l'objet topics par un tableau de noms de sujets
    const responseData = response.data.data.posts.edges.map((edge) => {
      return {
        ...edge.node,
        image: edge.node.thumbnail.url,
        topics: edge.node.topics.edges.map((edge) => edge.node.name),
      };
    });
    return res.json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erreur interne du serveur");
  }
});

/**
 * Endpoint pour obtenir les posts par date.
 * Méthode : GET
 * URL : /api/posts/date/:date
 * Paramètres :
 *   - date: Date au format YYYY-MM-DD
 */
router.get("/date/:date", async (req, res) => {
  const date = req.params.date;
  console.log(date);
  const query = `{
    posts{
      edges {
        node {
          id
          name
          description
          createdAt
          topics {
            edges {
              node {
                id
                name
              }
            }
          }
          thumbnail {
            url
          }
        }
      }
    }
  }
  `;

  try {
    const response = await axios.post(url, { query }, { headers });
    // Filtre les posts par date, remplace l'objet thumbnail par une chaîne de caractères url et l'objet topics par un tableau de noms de sujets
    const responseData = response.data.data.posts.edges
      .filter((edge) => edge.node.createdAt.includes(date))
      .map((edge) => {
        return {
          ...edge.node,
          image: edge.node.thumbnail.url,
          topics: edge.node.topics.edges.map((edge) => edge.node.name),
        };
      });

    return res.json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
});

// router.get("/:id", async (req, res) => {
//   // ...
// });

module.exports = router;
