const authentication = require('../database/model/authentication')
const { comparepassword, sethastpassword, setjwttoken } = require('./logicFunction')



const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        res.status(400).json({
            status: 'Enter All The Detail'
        })
    }

    const finduser = await authentication.find({ email })
    if (finduser.length == 1) {
        const resp = await comparepassword(finduser[0].password, password)
        if (resp) {
            let token = setjwttoken({ id: finduser[0]._id, name: finduser[0].name, email: finduser[0].email }, process.env.jwtsecure)
            res.status(200).json({
                status: { username: finduser[0].name, token }
            })
        } else {
            res.status(400).json({
                status: 'Enter the correct password'
            })
        }
    } else {
        res.status(400).json({
            status: 'Enter the correct email'
        })
    }
}



const register = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        res.status(400).json({
            status: 'Enter All The Detail'
        })
    }
    const finduser = await authentication.find({ email })
    if (finduser.length == 1) {
        res.status(400).json({
            status: "Email Alredy Present"
        })
    } else {
        const hash = await sethastpassword(password)
            const data = await authentication.create({ name, email, password: hash })
            if (data) {
                let token = setjwttoken({ id: data._id, name: data.name, email: data.email }, process.env.jwtsecure)
                res.status(200).json({ username: name, token })
            }
    }
}




const updateuser = async (req, res) => {
    const { name, email, newemail, location } = req.body
    try {
        await authentication.findOneAndUpdate({ email }, { name, email: newemail, location })
        res.status(200).json({
            status: 'updateuser'
        })
    } catch (err) {
        res.status(400).json({
            status: err
        })
    }
}



module.exports = { login, register, updateuser }