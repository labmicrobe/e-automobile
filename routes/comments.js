var express    = require("express");
var router     = express.Router({mergeParams: true});
var Store      = require("../models/stores");
var Comment    = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new",middleware.isLoggedIn, function(req, res){
    console.log(req.params.id);
    Store.findById(req.params.id, function(err, store){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {store:store});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup store using ID
   Store.findById(req.params.id, function(err, store){
       if(err){
           console.log(err);
           res.redirect("/stores");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){     	
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               store.comments.push(comment);
               store.save();
              // console.log(comment);
               res.redirect('/stores/' + store._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {store_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/stores/" + req.params.id );
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/stores/" + req.params.id);
       }
    });
});

module.exports = router;