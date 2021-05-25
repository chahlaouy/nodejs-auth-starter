const jwt = require('jsonwebtoken')

const authMiddleware = function (request, response, next){

    const token = request.header('auth-token')
    if (!token) return response.status(401).send('Access denied')

    try {
        /**
         * The verify method is gonna return the id of the user 
         */
        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET)
        request.user = verifiedUser
        next()

    } catch (error) {
        response.status(400).send('Access denied')
    }
}

module.exports = authMiddleware