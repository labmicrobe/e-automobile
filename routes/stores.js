var express = require("express");
var router  = express.Router();
var Store = require("../models/stores");
var middleware = require("../middleware");


//INDEX - show all stores
router.get("/", function(req, res){
    // Get all stores from DB
    Store.find({}, function(err, allStores){
       if(err){
           console.log(err);
       } else {
          res.render("stores/index",{stores:allStores});
       }
    });
});

//CREATE - add new store to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to STORE array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newStore = {name: name, image: image, description: desc, author:author}
    // Create a new STORE and save to DB
    Store.create(newStore, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to STORE page
           // console.log(newlyCreated);
            res.redirect("/stores");
        }
    });
});

//NEW - show form to create new store
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("stores/new"); 
});

// SHOW - shows more info about one STORE
router.get("/:id", function(req, res){
    //find the STORE with provided ID
    Store.findById(req.params.id).populate("comments").exec(function(err, foundStore){
        if(err){
            console.log(err);
        } else {
            //render show template with that store
            res.render("stores/show", { store: foundStore});
        }
    });
});

// EDIT STORE ROUTE
router.get("/:id/edit", middleware.checkStoreOwnership, function(req, res){
    Store.findById(req.params.id, function(err, foundStore){
        res.render("stores/edit", {store: foundStore});
    });
});

// UPDATE STORE ROUTE
router.put("/:id",middleware.checkStoreOwnership, function(req, res){
    // find and update the correct store
    Store.findByIdAndUpdate(req.params.id, req.body.store, function(err, updatedStore){
       if(err){
           res.redirect("/stores");
       } else {
           //redirect somewhere(show page)
           res.redirect("/stores/" + req.params.id);
       }
    });
});

// DESTROY STORE ROUTE
router.delete("/:id",middleware.checkStoreOwnership, function(req, res){
   Store.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/stores");
      } else {
          res.redirect("/stores");
      }
   });
});


module.exports = router;

