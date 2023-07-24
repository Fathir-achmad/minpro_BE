const { body, validationResult } = require('express-validator');
const fs = require('fs')

module.exports = {
    checkCreateBlog : async (req, res, next) => {
        try {
            const {filename,destination} = req.file

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

};