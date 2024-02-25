const apiRoleModel = require('../models/role').ApiRole;

async function checkRole(req, res, next) {
    const endpoint = req.baseUrl + req.route.path;
    const method = req.method;
    console.log(endpoint +'-'+ method)

    try {
        const ApiRole = await apiRoleModel.findOne({ method, endpoint });
        console.log(ApiRole)

        if (!ApiRole) {
            return res.status(404).json({ message: 'API endpoint not found' });
        }

        const requiredRole = ApiRole.role;

        const userRoles = req.user && req.user.roles ? req.user.roles : [];
        const hasRequiredRole = userRoles.includes(requiredRole);

        if (hasRequiredRole) {
            next();
        } else {
            return res.status(403).json({ message: 'Unauthorized - Insufficient role' });
        }
    } catch (error) {
        console.error('Error checking role:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
    
}

module.exports = checkRole;