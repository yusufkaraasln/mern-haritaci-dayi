const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")

//register
router.post("/register", async (req, res) => {

    try {

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(req.body.password,salt)


        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        })

        const savedUser = await user.save()

        res.status(200).json(savedUser)


        
    } catch (e) {
        console.log(e);
    }


});

//login 
router.post("/login",async (req,res)=>{
    try {
            const user = await User.findOne({
                username: req.body.username})

                    !user && res.status(400).json({
                        error: "Username or password not found."
                    })

                    const validatedPass = await bcrypt.compare(req.body.password,user.password)

                    !validatedPass && res.status(400).json({
                        error: "Username or password not found."
                    })

                    const {password,...others} = user._doc

                    res.status(200).json(others)




    } catch (e) {
        res.status(500).json(e)
    }
})

module.exports = router