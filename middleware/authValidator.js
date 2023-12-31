const { body, header, validationResult } = require('express-validator')

module.exports = {
    checkRegister : async(req,res,next) => {
        try {
            await body('username').notEmpty().isAlphanumeric().withMessage("Username required").run(req)
            await body('email').notEmpty().withMessage("Email required").isEmail().run(req)
            await body('phone').notEmpty().isMobilePhone().withMessage("Phone number required").run(req)

            await body('password').notEmpty().isStrongPassword({
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            }).run(req)
            await body ('confirmPassword').notEmpty().equals(req.body.password).withMessage(" password not match").run(req)

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

    checkLogin: async (req, res, next) => {
        try {
            await body('username').isAlphanumeric().withMessage("Username required").optional({
                nullable: true,
            }).run(req)

            await body('email').isEmail().withMessage("Email required").optional({
                nullable: true,
            }).run(req)
            
            await body('phone').optional({
                nullable:true
            }).isMobilePhone().withMessage("Phone required").optional({
                nullable: true,
            }).run(req)

            await body('password').notEmpty().withMessage("Password required").run(req)

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

    checkForgotPass : async(req, res, next) => {
        try {
            await body('email').notEmpty().withMessage("Email required").isEmail().run(req)
            
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

    checkResetPass : async (req, res, next) => {
        try {
            await header('authorization').notEmpty().withMessage("Token required").run(req)
            await body('password').notEmpty().isStrongPassword({
                minLength: 6,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 0
            }).run(req)
            await body ('confirmPassword').notEmpty().equals(req.body.password).withMessage("Password not match").run(req)

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

    checkKeepLogin : async (req, res, next) => {
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

    checkVerify: async(req, res, next) => {
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
            res.status(400).send(err)
        }
    }

}
