const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please sign in.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "apna_vidya_super_secure_jwt_secret_key_2026"
    );

    const user = await User.findByPk(decoded.userId || decoded.id, {
      include: [
        {
          model: Role,
          as: "role",
          include: [
            {
              model: Permission,
              as: "permissions",
              attributes: ["name"],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User session expired or user no longer exists.",
      });
    }

    if (user.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.status.toLowerCase()}. Please contact administrator.`,
      });
    }

    const permissions =
      user.role && user.role.permissions
        ? user.role.permissions.map((p) => p.name)
        : [];

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      status: user.status,
      role: user.role ? user.role.name : null,
      roleId: user.roleId,
      permissions,
    };

    req.userInstance = user;

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session token expired. Please log in again.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid or malformed authentication token.",
    });
  }
};

const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (req.user.role === "Super Admin" || roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access forbidden. Insufficient role permissions.",
    });
  };
};

const authorizePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (
      req.user.role === "Super Admin" ||
      (req.user.permissions && req.user.permissions.includes(permission))
    ) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access forbidden. Requires permission: ${permission}`,
    });
  };
};

module.exports = {
  authenticate,
  authorizeRole,
  authorizePermission,
};
