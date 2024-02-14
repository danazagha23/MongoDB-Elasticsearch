
function checkRole(role) {
    return function(req, res, next) {
        // Check if user has the required role
        if (req.user && req.user.role === role) {
            next(); 
        } else {
            return res.status(403).json({ message: 'Insufficient role permissions' });        }
    };
}

module.exports = checkRole;