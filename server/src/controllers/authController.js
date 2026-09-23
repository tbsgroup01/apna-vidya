const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const User = require("../models/User");
const Role = require("../models/Role");
const Permission = require("../models/Permission");

const signToken = (userId, roleName) => {
  return jwt.sign(
    { userId, role: roleName },
    process.env.JWT_SECRET || "apna_vidya_super_secure_jwt_secret_key_2026",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

const sendAuthResponse = (res, user, statusCode = 200, message = "Success") => {
  const roleName = user.role ? user.role.name : "Admin";
  const permissions =
    user.role && user.role.permissions
      ? user.role.permissions.map((p) => p.name)
      : [];

  const token = signToken(user.id, roleName);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie("token", token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        status: user.status,
        role: roleName,
        roleId: user.roleId,
        permissions,
        lastLogin: user.lastLogin,
      },
      token,
    },
  });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
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
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.status !== "Active") {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.status.toLowerCase()}. Please contact administrator.`,
      });
    }

    user.lastLogin = new Date();
    await user.save();

    return sendAuthResponse(res, user, 200, "Signed in successfully.");
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while processing login.",
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Signed out successfully.",
  });
};

const getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.userInstance;

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been changed successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update password.",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user && user.status === "Active") {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
      await user.save();

      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
      const resetUrl = `${clientUrl}/admin/reset-password?token=${resetToken}`;
      console.log(`[AUTH] Password reset requested for ${email}: ${resetUrl}`);
    }

    return res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, password reset instructions have been generated.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to process password reset request.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: {
          [Op.gt]: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired.",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been successfully reset. You can now log in.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to reset password.",
    });
  }
};

module.exports = {
  login,
  logout,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
};
