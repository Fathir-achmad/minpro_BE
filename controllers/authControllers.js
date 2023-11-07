const db = require('../models');
const account = db.Account;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {Op} = require('sequelize')

const mailer = require('../helper/mailer')
const fs = require('fs')
const handlebars = require('handlebars')

module.exports = {
    register : async(req,res) => {
        try {
            const { username,email,phone,password,confirmPassword } = req.body

            if (password.length <= 6) {throw ('Password must be at least 6 characters')}
            if (password !== confirmPassword) {
                throw('Password not match')
            }

            //---Crypt password
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password,salt)

            const result = await account.create({username, email, phone, password:hashPassword})

            //---Send mail
            const data = await fs.readFileSync('./template/verify.html', 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({username:username})
            await mailer.sendMail({
                from: "fathir17.fa@gmail.com",
                to: email,
                subject: "Verify account for register",
                html: tempResult
            })

            const payload = { id: result.id, isVerified: result.isVerified } //--- Bawa datanya
            const token = jwt.sign(payload,"fathir-achmad",{expiresIn: '1h'})

            const regisToken = await account.update({ token: token},
            {where:{
                id: result.id
            }})

            res.status(200).send({
                msg: "Account created, and please check your email to verify your account",
                status: true,
                result,
                token
            })
        } catch (err) {
            console.log(err);
            res.status(400).send(err)
        }
    },

    login: async (req, res) => {
        try {
            const username = req.body.username || ""
            const email = req.body.email || ""
            const phone = req.body.phone || ""
            const password = req.body.password

            const result = await account.findOne({
                where : {
                    [Op.or] : [ 
                    {username : username},
                    {email : email},
                    {phone : phone},
                    ]
                }
            })
            if (!result) {
                throw('User not found, please register first')
            }

            const isValid = await bcrypt.compare(password, result.password)

            if (!isValid) {
                throw('Wrong password')
            }

            if (!result.isVerified) {
                throw('User not verified')
            }

            const payload = { id: result.id, isVerified: result.isVerified, imgProfile: result.imgProfile}
            const token = jwt.sign(payload,"fathir-achmad",{expiresIn: '1h'})

            res.status(200).send({
                msg: "Login success",
                status: true,
                token
            })
        } catch (err) {
            console.log(err);
            res.status(400).send(err)
        }
    },
    verify: async(req, res) => {
        try {
            const data = await account.findOne({where : {
                id : req.user.id
            }})
            if (req.token == data.token) {
                const result = await account.update(
                    {isVerified : true,
                        token: ""
                    },
                    {where : {
                        id : req.user.id
                    }}
                )
                res.status(200).send({
                    result,
                    msg: "Success verify",
                    status: true
                })
            }
            else{
                throw({msg: `Token salah`})
            }
        } catch (err) {
            console.log(err);
            res.status(400).send(err)
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const {email} = req.body
            const result = await account.findOne(
                {where: {email : email}}
            )
            if (!result) {
                throw('Email not exist')
            }
            
            const data = await fs.readFileSync('./template/verify.html', 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({username: result.username})
            await mailer.sendMail({
                from: "fathir17.fa@gmail.com",
                to: email,
                subject: "Verify account to forgot password",
                html: tempResult
            })

            const payload = { id: result.id }
            const token = jwt.sign(payload,"fathir-achmad",{expiresIn: '1h'})

            res.status(200).send({
                msg: "Check your email to verify your account",
                status: true,
                token
            })
        } catch (err) {
            console.log(err);
            res.status(400).send(err)
        }
    },

    resetPassword : async (req, res) =>{
        try {
            const {password,confirmPassword} = req.body
            if (password.length < 6) {throw ('Password must be at least 6 characters')}
            if (password !== confirmPassword) {
                throw('Password not match')
            }

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password,salt)

            const result= await account.update(

                { password:hashPassword },
                {where : {
                    id : req.user.id
                }}
            )
            res.status(200).send({
                msg: "Password has been updated successfully",
                status: true,
                result
            })
        } catch (err) {
            console.log(err);
            res.status(400).send(err)
        }
    },

    keepLogin : async(req, res) => { 
        try {
            const result = await account.findOne({
                where: {
                    id : req.user.id
                }
            })

            res.status(200).send({
                msg: "Success to keep login",
                status: true,
                result
            })
        } catch (err) {
            res.status(400).send(err)
            console.log(err);
        }
    },
}; //---End