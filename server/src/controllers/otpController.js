const { PlatformSetting } = require("../models/PlatformSetting");

const DEFAULT_AUTH_KEY = "h5DpCOAGoMlCM-Sw9BdayFbSiVNIi_ODoxyR1y703gk";
const GATEWAY_URL = "https://apitxt.com/api/sendOTP";

// In-memory store for active OTPs: mobile -> { otp, expiresAt, lastSentAt, attempts, verified }
const otpStore = new Map();

// Sweep expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of otpStore.entries()) {
    if (now > value.expiresAt) {
      otpStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

const normalizeMobile = (phone) => {
  if (!phone) return "";
  let digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10) {
    return "91" + digits;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return "91" + digits.slice(1);
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits;
  }
  if (digits.startsWith("91") && digits.length >= 12) {
    return digits.slice(0, 12);
  }
  if (digits.length >= 10) {
    return "91" + digits.slice(-10);
  }
  return digits;
};

const isValidMobile = (phone) => {
  const normalized = normalizeMobile(phone);
  return /^91[6-9]\d{9}$/.test(normalized);
};

const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!isValidMobile(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 10-digit mobile number",
      });
    }

    const mobile = normalizeMobile(phone);
    const existing = otpStore.get(mobile);
    const now = Date.now();

    // 20-second resend cooldown
    if (existing && now - existing.lastSentAt < 20000) {
      const waitSeconds = Math.ceil((20000 - (now - existing.lastSentAt)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSeconds}s before requesting a new OTP`,
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const authKey = process.env.SMS_AUTH_KEY || DEFAULT_AUTH_KEY;
    const url = `${GATEWAY_URL}?authkey=${encodeURIComponent(authKey)}&mobile=${encodeURIComponent(mobile)}&otp=${encodeURIComponent(otp)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (data.status === "success" || data.status === "SUCCESS") {
      otpStore.set(mobile, {
        otp,
        expiresAt: now + 5 * 60 * 1000, // 5 minutes
        lastSentAt: now,
        attempts: 0,
        verified: false,
      });

      return res.status(200).json({
        success: true,
        message: "OTP sent successfully to your mobile number",
        mobile: `+91 ******${mobile.slice(-4)}`,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: data.message || "Failed to send OTP via SMS gateway",
      });
    }
  } catch (err) {
    console.error("sendOtp error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while sending OTP",
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: "Phone number and OTP are required",
      });
    }

    const mobile = normalizeMobile(phone);
    const record = otpStore.get(mobile);

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "No active OTP found for this number. Please request a new OTP.",
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(mobile);
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (record.attempts >= 5) {
      otpStore.delete(mobile);
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please request a new OTP.",
      });
    }

    if (record.otp !== String(otp).trim()) {
      record.attempts += 1;
      return res.status(400).json({
        success: false,
        message: "Invalid OTP code. Please check and try again.",
      });
    }

    record.verified = true;
    record.verifiedAt = Date.now();

    return res.status(200).json({
      success: true,
      verified: true,
      message: "Mobile number verified successfully",
    });
  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error while verifying OTP",
    });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  normalizeMobile,
  isValidMobile,
  otpStore,
};
