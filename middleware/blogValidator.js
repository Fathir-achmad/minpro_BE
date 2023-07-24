const { body, header, validationResult } = require('express-validator');
const fs = require('fs')

module.exports = {
    checkCreateBlog : async (req, res, next) => {
        try {
            const {filename,destination} = req.file
            await header('authorization').notEmpty().withMessage("Token required").run(req)

            await body('title').trim().notEmpty().withMessage("Title is required").run(req)
            await body('keyword').trim().notEmpty().withMessage("Keyword is required").run(req)
            await body('content').trim().notEmpty().isLength({max:500}).withMessage("Content is required").run(req)
            await body('country').trim().notEmpty().withMessage("Country is required").run(req)

            const validation = validationResult(req)
            if (validation.isEmpty()) {
                next()
            }
            else{
                fs.unlinkSync(`${destination}/${filename}`) //---
                return res.status(400).send({
                    status: false,
                    msg: 'Invalid validation',
                    error: validation.array()
                })
            }

        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },

    checkBlogById : async (req, res, next) => {
        try {

            await body('id').trim().notEmpty().withMessage("Id blog is required").run(req)

            const validation = validationResult(req)
            if (validation.isEmpty()) {
                next()
            }
            else{
                return res.status(400).send({
                    status: false,
                    msg: 'Invalid validation',
                    error: validation.array()
                })
            }

        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },
    
    checkLikeBlog : async (req, res, next) => {
        try {

            await body('BlogId').trim().notEmpty().withMessage("Liked blog id is required").run(req)
            await header('authorization').notEmpty().withMessage("Token required").run(req)

            const validation = validationResult(req)
            if (validation.isEmpty()) {
                next()
            }
            else{
                return res.status(400).send({
                    status: false,
                    msg: 'Invalid validation',
                    error: validation.array()
                })
            }

        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },

    checkMyBlog : async (req, res, next) => {
        try {

            await header('authorization').notEmpty().withMessage("Token required").run(req)

            const validation = validationResult(req)
            if (validation.isEmpty()) {
                next()
            }
            else{
                return res.status(400).send({
                    status: false,
                    msg: 'Invalid validation',
                    error: validation.array()
                })
            }

        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },

    checkLikedBlog : async (req, res, next) => {
        try {

            await header('authorization').notEmpty().withMessage("Token required").run(req)

            const validation = validationResult(req)
            if (validation.isEmpty()) {
                next()
            }
            else{
                return res.status(400).send({
                    status: false,
                    msg: 'Invalid validation',
                    error: validation.array()
                })
            }

        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },

    checkDeleteBlog : async (req, res, next) => {
        try {

            await body('id').trim().notEmpty().withMessage("Blog id is required").run(req)
            await header('authorization').notEmpty().withMessage("Token required").run(req)

            const validation = validationResult(req)
            if (validation.isEmpty()) {
                next()
            }
            else{
                return res.status(400).send({
                    status: false,
                    msg: 'Invalid validation',
                    error: validation.array()
                })
            }

        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    },

};