const db = require('../models');
const account = db.Account;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('../helper/mailer')
const fs = require('fs')
const handlebars = require('handlebars')

module.exports = {
    changeUsername : async(req, res) => {
        try {
            const { oldUsername,newUsername } = req.body

            const userExist = await account.findOne( //--- Cek id 
                {where: {id : req.user.id}} //--- kenapa make id karena pakai token dari login dan payloadnya cuma bawa id
            )
            if (oldUsername !== userExist.username) {
                throw('Username not found')
            }

            const sameUsername = await account.findAll({
                where: {id : req.user.id}
            })
            if (newUsername == sameUsername.username) {
                throw('Username already exists')
            }

            const result = await account.update(
                {username: newUsername},
                {where: {id: req.user.id}}
            )
            const data = await fs.readFileSync('./template/changing.html', 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({data:newUsername, description: "Username has been changed"})
            await mailer.sendMail({
                from: "fathir17.fa@gmail.com",
                to: userExist.email,
                subject: "Change username",
                html: tempResult
            })
            res.status(200).send({
                msg: "Success to change username, check your email",
                status: true,
                result,
            })

        } catch (err) {
            console.log(err);
            res.status(400).send(err)
        }
    },

    changePhone : async(req, res) => {
        try {
            const { oldPhone,newPhone } = req.body

            const userExist = await account.findOne(
                {where: {id : req.user.id}} 
            )
            if (oldPhone !== userExist.phone) {
                throw('Phone not found')
            }

            const result = await account.update(
                {phone: newPhone},
                {where: {id: req.user.id}}
            )
            const data = await fs.readFileSync('./template/changing.html', 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({data: userExist.username, description: "Phone has been changed"})
            await mailer.sendMail({
                from: "fathir17.fa@gmail.com",
                to: userExist.email,
                subject: "Change phone number",
                html: tempResult
            })
            res.status(200).send({
                msg: "Success to change phone number",
                status: true,
                result,
            })

        } catch (err) {
            console.log(err);
            res.status(400).send(err)
        }
    },

    changeEmail : async(req, res) => {
        try {
            const { oldEmail,newEmail } = req.body
            
            const userExist = await account.findOne( 
                {where: {id : req.user.id}},
                )
                
                if (oldEmail !== userExist.email) {
                    throw('Email not found')
                }

                const sameEmail = await account.findOne({
                    where: {id : req.user.id}
                })
                if (newEmail == sameEmail.email) {
                    throw('Email already exists')
                }
                
                const result = await account.update(
                    {email: newEmail,
                    isVerified: false},
                    {where: {id: userExist.id}},
            )
            
            const updatedUser = await account.findOne( 
                {where: {id : req.user.id}},
                )

            const payload = { id: updatedUser.id, isVerified: updatedUser.isVerified } //--- Bawa datanya
            const token = jwt.sign(payload,"fathir-achmad",{expiresIn: '1h'})

            const emailToken = await account.update(
                { token: token},
                {where:{
                    id: updatedUser.id
                }})

            const data = fs.readFileSync('./template/verify.html', 'utf-8')
            const tempCompile = await handlebars.compile(data)
            const tempResult = tempCompile({ username: updatedUser.username })
            await mailer.sendMail({
                from: "fathir17.fa@gmail.com",
                to: newEmail,
                subject: "Change email",
                html: tempResult
            })
            res.status(200).send({
                msg: "Please check your email and verify first",
                status: true,
                result,
                token
            })
        } catch (err) {
            console.log(err);
            res.status(400).send(err)
        }
    },
    
    changePassword : async(req, res) => {
        try {
            const { oldPassword,newPassword,confirmPassword } = req.body

            const userExist = await account.findOne( 
                {where: {id : req.user.id}} 
            )

            const compare = await bcrypt.compare(oldPassword, userExist.password)
            if (!compare) {
                throw('Incorrect password')
            }
            if (newPassword !== confirmPassword) {
                throw('Password mismatch')
            }
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(newPassword,salt)

            const result = await account.update(
                {password:hashPassword},
                {where: {id: req.user.id}}
            )
            res.status(200).send({
                msg: "Success change password",
                status: true,
                result,
            })

        } catch (err) {
            console.log(err);
            res.status(400).send(err)
        }
    },

    changeAvatar: async (req, res) => {
        try {
            if (req.file.size > 1024 * 1024) throw {
                status: false,
                message: "file size to large"
            }
            
            const tempData = await account.findOne({
                where : {id: req.user.id}
            })

            if (tempData.imgProfile !== null) {
                fs.unlinkSync(`./public/avatar/${tempData.imgProfile}`)
            }

            
            await account.update({
                imgProfile: req.file.filename
            }, {
                where: {
                    id: req.user.id
                }
            })

            res.status(200).send({
                status: true,
                msg: "Success change avatar",
            })
        } catch (err) {
            res.status(400).send(err)
            console.log(err);
        }
    }
    
}; //--- End