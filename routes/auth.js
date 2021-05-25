const router = require('express').Router()
const User = require('../models/User')
const { registerValidation, loginValidation } = require('../validation/validation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * Register Route
 */
router.post('/register', async (request, response) => {

    /**
     * Validate The data
     */

    const { error } = registerValidation(request.body)
    if(error) return response.status(400).send(error.details[0].message)
    
    /**
     * Check wether the email is already taken
     */
    
    const emailExists = await User.findOne({email: request.body.email})
    
    if( emailExists) return response.status(400).send("email already taken")

    /**
     * Hashing the password
     */

    const salt = await bcrypt.genSalt(10)
    const hashedPaswword = await bcrypt.hash(request.body.password, salt)

    /**
     * Create the User
     */
    const newUser = new User({
        name: request.body.name,
        email: request.body.email,
        password: hashedPaswword
    });

    try {
        /**
         * Trying to persist the User otherwise throw an exception
         */
        user = await newUser.save()
        response.status(200).send({
            message: 'user has been registred successfully',
            user: user
        })
    } catch (error) {

        /**
         * Catch the exception
         */

        response.status(400).send(error)
    }
})

/**
 * Login Route
 */

router.post('/login', async (request, response) => {

    const { error } = loginValidation(request.body)
    if (error) return response.status(400).send(error.details[0].message)

    const user = await User.findOne({email: request.body.email})
    if (!user) return response.status(400).send('Please check your crendentials')
    const isPasswordValid = await bcrypt.compare(request.body.password, user.password)
    if(!isPasswordValid) return response.status(400).send('Please check your crendentials')

    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
    
    response.header('auth-token', token).send(token)

})
module.exports = router