const router = require('express').Router()
const authMiddleware = require('../middleware/auth-middleware')
const User = require('../models/User')


/**
 * Update Member
 */

router.get('/', authMiddleware, async (request, response) => {

    const user = await User.findById(request.user._id)
    response.send(user)
})

module.exports = router
