const express = require("express");
const router = express.Router();
const axios = require("axios");
const e = require("express");
require("dotenv").config();

const url = process.env.HOST;
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.API_KEY}`,
};

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
    // replace thumbnail object with url string
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
    return res.status(500).send("Internal Server Error");
  }
});

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
    // filter by date and replace thumbnail object with url string and topics object with array of topic names

    console.log(response);
    const responseData = response.data.data.posts.edges
      .filter((edge) => edge.node.createdAt.includes(date))
      .map((edge) => {
        return {
          ...edge.node,
          image: edge.node.thumbnail.url,
          topics: edge.node.topics.edges.map((edge) => edge.node.name),
        };
      });

    // const responseData = response.data.data.posts.edges
    //   .filter((edge) => edge.node.createdAt.includes(date))
    //   .map((edge) => {
    //     return {
    //       ...edge.node,
    //       image: edge.node.thumbnail.url,
    //     };
    //   });

    return res.json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
});

// router.get("/:id", async (req, res) => {
//   let page = req.query.page - 1;
//   if (!req.query.page) {
//     page = 0;
//   }
//   let limit = req.query.limit;
//   if (!limit) {
//     limit = 10;
//   }
//   let filter = req.query.filter;
//   let sortby = req.query.sortby;
//   var newsById;

//   if (req.params.id == "first") {
//     try {
//       var news;
//       if (filter) {
//         news = await News.find({ field: filter }).sort(sortby);
//         news = news.slice(page * 10, page * 10 + limit);
//       } else {
//         news = await News.find().sort(sortby);
//         news = news.slice(page * 10, page * 10 + limit);
//       }
//       res.send(news[0]);
//     } catch (err) {
//       res.status(500).send("Error getting the first news : " + err);
//       console.log("Error getting the first news : " + err);
//     }
//   } else if (req.params.id == "last") {
//     try {
//       var news;
//       if (filter) {
//         news = await News.find({ field: filter }).sort(sortby);
//         news = news.slice(page * 10, page * 10 + limit);
//       } else {
//         news = await News.find().sort(sortby);
//         news = news.slice(page * 10, page * 10 + limit);
//       }
//       res.send(news[news.length - 1]);
//     } catch (err) {
//       res.status(500).send("Error getting the last news : " + err);
//       console.log("Error getting the last news : " + err);
//     }
//   } else if (req.params.id == "count") {
//     try {
//       const news = await News.find();
//       res.send({ count: news.length });
//     } catch (err) {
//       res.status(500).send("Error getting the number of news : " + err);
//       console.log("Error getting the number of news :" + err);
//     }
//   } else {
//     try {
//       newsById = await News.findOne({ _id: req.params.id });
//       res.send(newsById);
//     } catch (err) {
//       console.log("Error while getting the news by id : " + err);
//       res.send("Error while getting the news by id : " + err);
//     }
//   }
// });

module.exports = router;
