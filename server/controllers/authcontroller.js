const Role = require("../models/rolemodule.js");
const User = require("../models/usermodule.js");
const { comparePassword, generateHash } = require("../lib/hashpassword.js");
const generatePassword = require("../lib/generatePassword.js");
const transporter = require("../lib/sendemail.js");
const { generateToken } = require("../lib/generateToken.js");

const { cleanupUnassignedFlats } = require("./flat.controller.js");

exports.register = async (req, res) => {
  try {
    const { name, email, phone, roleId, flatId } = req.body;

    const user = await User.findOne({ email });
    console.log(user);

    if (user) {
      return res.status(400).json({
        message: `User already exist with ${email}, Please try with another email`,
      });
    }

    const role = await Role.findById(roleId);
    console.log(role);

    if (role.role === "resident") {
      if (!flatId) {
        return res.status(400).json({
          message: `Flat assignment is required for the ${role.role}`,
        });
      }
    }
    const password = generatePassword(8);
    const hashPass = await generateHash(password);
    console.log(password, hashPass);

    if (role.role === "resident" && flatId) {
      const Flat = require("../models/flatmodule.js");
      const flatObj = await Flat.findById(flatId);
      if (flatObj) {
        flatObj.isaccopied = true;
        await flatObj.save();
      }
    }

    const NewUser = await User.create({
      name,
      email,
      phone,
      role: roleId,
      password: hashPass,
      flat: flatId || undefined,
    });

    const alluserData = await User.findById(NewUser._id).populate("role");
    console.log(alluserData);

    const resetLink = `http://localhost:5173/reset-setup-password?email=${encodeURIComponent(NewUser.email)}`;

    try {
      await transporter.sendMail({
        from: `SMS TEAM <${process.env.SMTP_USER}>`,
        to: NewUser.email,
        subject: "Welcome to Society Management System - Set Your Password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #3f51b5; text-align: center;">Welcome to Society Management System!</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">Hi <strong>${NewUser.name}</strong>,</p>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">Your account has been successfully created by the administrator. To activate your account, please set your password by using the temporary password below:</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #3f51b5;">
              <p style="margin: 0 0 10px 0; color: #333; font-size: 15px;"><strong>Temporary Password:</strong> 
                <span style="font-family: monospace; font-size: 17px; font-weight: bold; background: #e8eaf6; color: #3f51b5; padding: 3px 8px; border-radius: 4px;">${password}</span>
              </p>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; text-align: center;">
              <a href="${resetLink}" target="_blank" style="background-color: #3f51b5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Set Your Permanent Password</a>
            </p>
            
            <p style="color: #888; font-size: 13px; line-height: 1.6; margin-top: 25px;">
              If the button above does not work, copy and paste the following link in your browser:<br>
              <a href="${resetLink}" target="_blank" style="color: #3f51b5;">${resetLink}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="color: #888; font-size: 14px; text-align: center;">Best regards,<br>Society Management Team</p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Nodemailer failed to send welcome email:", mailError.message);
    }

    res.status(201).json({
      message: "success",
      data: alluserData,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("role");
    console.log(user);
    if (!user) {
      return res.status(400).json({
        message: "User is not registered , please register try again",
      });
    }
    console.log(password, user.password);
    const isPassword = await comparePassword(password, user.password);
    console.log(isPassword);
    if (!isPassword) {
      return res.status(401).json({
        message: "Password is incorrect",
      });
    }
    if (!user.role) {
      return res.status(400).json({
        message: "User role configuration is invalid or missing in database. Please seed the roles and users correctly.",
      });
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role.role,
    };
    const token = generateToken(payload);
    console.log(token);

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction ? true : false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successfull",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.verify = async (req, res) => {
  console.log(req.user);

  res.status(200).json({
    authenticated: true,
    data: req.user,
  });
};

exports.logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", null, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction ? true : false,
      maxAge: 0,
    });

    res.status(200).json({
      authenticated: false,
      message: "Logout successfull",
    });
  } catch (error) { }
};

exports.setupInitialPassword = async (req, res) => {
  try {
    const { email, tempPassword, newPassword } = req.body;

    if (!email || !tempPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email }).populate("role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await comparePassword(tempPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Temporary password is incorrect" });
    }

    // Set new password
    const hashedNewPassword = await generateHash(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    // Generate JWT token (login the user automatically)
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role.role,
    };
    const token = generateToken(payload);

    // Set cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction ? true : false,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Password configured successfully",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
