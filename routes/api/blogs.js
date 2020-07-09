const express = require("express");
const mongoose = require("mongoose");
const { validate } = require('../../middleware/validator')
const router = express.Router();
const passport = require('passport')

// Load User Model
require("../../models/Blog");
const Blog = mongoose.model("blogs");


router.get('/category/:category', passport.authenticate('jwt', {session: false}), (req,res) => {
    Blog.find({category: req.params.category}).then(blogs => {
        res.json(blogs)
    })
})

router.get('/', (req,res) => {
  Blog.find({}).then(blogs => {
    res.json(blogs)
  })
})
router.get('/single/:id', passport.authenticate('jwt', {session: false}) , (req,res) => {
    Blog.findone({_id: req.params.id}).then(blog => {
        res.json(blog)
    })
})

router.get('/owned', passport.authenticate('jwt', {session: false}), (req,res) => {
    Blog.find({author: req.user.id}).then(blogs => {
        res.json(blogs)
    })
})

router.post('/', passport.authenticate('jwt', {session: false}), (req,res) => {
    const error = validate(req);
    if (error) {
        res.send({text:error,error: true })
    }
    else {
        const newBlog = new Blog({
            name: req.body.name,
            status: req.body.status,
            content: req.body.content,
            category: req.body.category,
            author: req.user.id
        })
        newBlog.save().then(blog => {
            res.json({message:"Blog created"})
        })

    }
})

router.put('/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
    Blog.findOne({_id:req.params.id}).then(blog => {
        if(blog.author == req.user.id) {
            blog.name = req.body.name;
            blog.status = req.body.status;
            blog.content = req.body.content;
            blog.category = req.body.category;

            blog.save().then(blog => {
                res.json({message: "blog updated"})
            })
        }
        else {

        }
    })
})

router.delete('/:id', passport.authenticate('jwt', {session: false}), (req,res) => {
    Blog.findOne({_id:req.params.id}).then(blog => {
        if(blog.author == req.user.id) {
            Blog.remove({_id:req.params.id}).then(blog => {
                res.json({messgae: "blog deleted"})
            })
        } else {
            res.json({messgae: "You do not own this post!"})
        }
    })
})

module.exports = router;
