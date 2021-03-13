//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Setup Database
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewURLParser: true,
  useUnifiedTopology: true
});

//Create Schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

//Create Model
const Article = mongoose.model("Article", articleSchema);

//Express Chainable Route Handlers:

///////////////////////////Requests Targeting All Articles////////////////////////////

app.route("/articles")

  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }

    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      };
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all articles.")
      } else {
        res.send(err);
      }
    });
  });

///////////////////////////Requests Targeting Specific Articles////////////////////////////

//Put and Patch
app.route("/articles/:articleTitle")

.get(function(req, res) {
const articleTitle = req.params.articleTitle;
  Article.findOne({
    title: articleTitle
  }, function(err, foundArticle) {
    if (foundArticle) {
      res.send(foundArticle)
    } else {
      res.send("No articles matching that title was found.");
    }
  });

})

//Replace an entire document with a new one
.put(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if (!err) {
        res.send("Successfully updated articles")
      } else {
        res.send("No articles matching that title was found.");
      }
    }
  );
})

//Update a specific field from the document
.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if (!err) {
        res.send("Successfully updated article field")
      } else {
        res.send("No articles matching that title was found.");
      }
    }
  );
})

//Delete a specific field from the document
.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if (!err) {
        res.send("Successfully deleted article field")
      } else {
        res.send("No articles matching that title was found.");
      }
    }
  );
});

// //Route Methods:
// //GET
// app.get("/articles", function(req, res) {
//   Article.find(function(err, foundArticles) {
//     if (!err) {
//       res.send(foundArticles);
//     } else {
//       res.send(err);
//     }
//
//   });
// });

//POST
// app.post("/articles", function(req, res){
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content
//   });
//   newArticle.save(function(err){
//     if (!err) {
//       res.send("Successfully added a new article.");
//     } else {
//       res.send(err);
//     };
//   });
// });

// //DELETE
// app.delete("/articles", function(req, res){
//   Article.deleteMany(function(err){
//     if (!err) {
//       res.send("Successfully deleted all articles.")
//     } else {
//       res.send(err);
//     }
//   });
// });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
