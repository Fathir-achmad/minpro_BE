const { body, header,validationResult } = require('express-validator');

module.exports = {
    checkChangeUsername : async (req, res, next) => {
        try {
            await header('authorization').notEmpty().withMessage("Token required").run(req)

            await body('oldUsername').notEmpty().withMessage("Username required").run(req)
            await body('newUsername').notEmpty().withMessage("Username required").run(req)

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
            res.status(400).send(err)
        }
    },

    checkChangeEmail : async(req, res, next) => {
        try {
            await header('authorization').notEmpty().withMessage("Token required").run(req)

            await body('oldEmail').notEmpty().withMessage("Email required").isEmail().run(req)
            await body('newEmail').notEmpty().withMessage("Email required").isEmail().run(req)

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
            res.status(400).send(err)
        }
    },

    checkChangePhone : async(req, res, next) => {
        try {
            await header('authorization').notEmpty().withMessage("Token required").run(req)

            await body('oldPhone').notEmpty().isMobilePhone().withMessage("Phone number required").run(req)
            await body('newPhone').notEmpty().isMobilePhone().withMessage("Phone number required").run(req)

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
            res.status(400).send(err)
        }
    },

    checkChangePassword: async(req, res, next) => {
        try {
            await header('authorization').notEmpty().withMessage("Token required").run(req)

            await body('oldPassword').notEmpty().withMessage("Password required").run(req)

            await body('newPassword').notEmpty().isStrongPassword({
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            }).withMessage("Password not fill required").run(req)
            await body ('confirmPassword').notEmpty().equals(req.body.newPassword).withMessage("Password not match").run(req)

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
            res.status(400).send(err)
        }
    }, 
}