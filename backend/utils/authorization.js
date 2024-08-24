const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
const authenticated = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
         res.redirect("/user/login");
    }
    try {
        const decodedToken = jwt.verify(token, "Decentralized");;
        req.user = { 
            firstName: decodedToken.firstName, 
            role: decodedToken.role 
        };
        if (!req.user || !req.user.role) {
            return res.status(401).json({ msg: "Unauthorized access / role not defined" });
        }
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Invalid token" });
    }
};

// Middleware to check if the user has one of the allowed roles
const authorization = (...roles) => {
    return (req, res, next) => {
        const  role  = req.user.role;
        if (!role || !roles.includes(role)) {
            return res.status(403).json({ msg: "Forbidden: You do not have the required permissions" });
        }
        next();
    };
};

module.exports = {
    authenticated,
    authorization
};
