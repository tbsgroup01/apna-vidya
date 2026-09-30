import api from "./api";

const SMS_AUTH_KEY = "h5DpCOAGoMlCM-Sw9BdayFbSiVNIi_ODoxyR1y703gk";
const GATEWAY_URL = "https://apitxt.com/api/sendOTP";

// In-memory active session for client-side resiliency
let activeSession = {
  mobile: null,
  otp: null,
  expiresAt: 0,
  lastSentAt: 0,
  attempts: 0,
};

/**
 * Normalizes an Indian phone number to 12 digits: "91" + 10-digit mobile number
 */
export const normalizeMobile = (phone) => {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");

  // Exactly 10 digits (standard Indian number, e.g. 6203949100)
  if (digits.length === 10) {
    return "91" + digits;
  }

  // 11 digits starting with 0 (e.g. 06203949100)
  if (digits.length === 11 && digits.startsWith("0")) {
    return "91" + digits.slice(1);
  }

  // 12 digits starting with 91 (e.g. 916203949100)
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits;
  }

  // More than 10 digits starting with 91
  if (digits.length > 10 && digits.startsWith("91")) {
    return digits.slice(0, 12);
  }

  // Fallback: take last 10 digits and prepend 91
  if (digits.length >= 10) {
    return "91" + digits.slice(-10);
  }

  return digits;
};

/**
 * Validates that phone resolves to a 10-digit Indian mobile number
 */
export const isValidMobile = (phone) => {
  const normalized = normalizeMobile(phone);
  // Must be 12 digits: "91" followed by 10 digits starting with 6, 7, 8, or 9
  return /^91[6-9]\d{9}$/.test(normalized);
};

/**
 * Formats mobile number for clean user display, e.g. "+91 62039 49100"
 */
export const formatMobileDisplay = (phone) => {
  const norm = normalizeMobile(phone);
  if (norm.length === 12) {
    const raw10 = norm.slice(2);
    return `+91 ${raw10.slice(0, 5)} ${raw10.slice(5)}`;
  }
  return phone;
};

/**
 * Dispatches a 4-digit OTP via the apitxt gateway
 */
export const sendOtp = async (phone) => {
  if (!phone) {
    throw new Error("Mobile number is required");
  }

  if (!isValidMobile(phone)) {
    throw new Error("Please enter a valid 10-digit mobile number");
  }

  const mobile = normalizeMobile(phone);
  const now = Date.now();

  // Enforce 15s cooldown
  if (activeSession.mobile === mobile && now - activeSession.lastSentAt < 15000) {
    const remaining = Math.ceil((15000 - (now - activeSession.lastSentAt)) / 1000);
    throw new Error(`Please wait ${remaining}s before requesting a new OTP.`);
  }

  // Generate 4-digit numeric code
  const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();

  // 1. First attempt through backend endpoint
  try {
    const res = await api.post("/public/otp/send", { phone: mobile });
    if (res.data?.success) {
      activeSession = {
        mobile,
        otp: generatedCode, // also kept locally as backup
        expiresAt: now + 5 * 60 * 1000,
        lastSentAt: now,
        attempts: 0,
      };
      return {
        success: true,
        mobile,
        display: formatMobileDisplay(mobile),
        message: res.data.message || "OTP sent successfully!",
      };
    }
  } catch (backendErr) {
    // If backend returned a specific validation or rate limit error (not a 404 or connection failure)
    if (backendErr.response && backendErr.response.status !== 404) {
      throw new Error(backendErr.response.data?.message || "Failed to send OTP.");
    }
    // If backend route does not exist yet (404), fall through to direct gateway request
  }

  // 2. Direct gateway fallback
  try {
    const url = `${GATEWAY_URL}?authkey=${encodeURIComponent(SMS_AUTH_KEY)}&mobile=${encodeURIComponent(mobile)}&otp=${encodeURIComponent(generatedCode)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (data.status === "success" || data.status === "SUCCESS") {
      activeSession = {
        mobile,
        otp: generatedCode,
        expiresAt: now + 5 * 60 * 1000, // 5 minutes
        lastSentAt: now,
        attempts: 0,
      };

      return {
        success: true,
        mobile,
        display: formatMobileDisplay(mobile),
        message: data.message || "OTP sent successfully to your mobile number!",
      };
    } else {
      throw new Error(data.message || "Failed to send SMS OTP. Please check mobile number.");
    }
  } catch (gatewayErr) {
    console.error("Direct SMS Gateway Error:", gatewayErr);
    throw new Error(gatewayErr.message || "Could not deliver OTP SMS. Please try again.");
  }
};

/**
 * Verifies entered 4-digit OTP code against the active session
 */
export const verifyOtp = async (phone, enteredCode) => {
  const mobile = normalizeMobile(phone);
  const cleanCode = String(enteredCode || "").trim();

  if (!cleanCode || cleanCode.length !== 4) {
    throw new Error("Please enter all 4 digits of the OTP code.");
  }

  // 1. Try verifying with backend if available
  try {
    const res = await api.post("/public/otp/verify", {
      phone: mobile,
      otp: cleanCode,
    });
    if (res.data?.success) {
      return {
        success: true,
        verified: true,
        mobile,
      };
    }
  } catch (backendErr) {
    if (backendErr.response && backendErr.response.status !== 404) {
      throw new Error(backendErr.response.data?.message || "Invalid OTP code.");
    }
    // 404 fallback: verify against local active session
  }

  // 2. Local active session validation
  if (!activeSession.otp || activeSession.mobile !== mobile) {
    throw new Error("No active OTP found. Please request a new OTP.");
  }

  if (Date.now() > activeSession.expiresAt) {
    activeSession = { mobile: null, otp: null, expiresAt: 0, lastSentAt: 0, attempts: 0 };
    throw new Error("OTP has expired. Please click 'Resend OTP' to receive a new code.");
  }

  if (activeSession.attempts >= 5) {
    activeSession = { mobile: null, otp: null, expiresAt: 0, lastSentAt: 0, attempts: 0 };
    throw new Error("Too many failed attempts. Please request a new OTP.");
  }

  if (activeSession.otp !== cleanCode) {
    activeSession.attempts += 1;
    throw new Error("Incorrect OTP. Please enter the 4-digit code sent to your phone.");
  }

  // Verification succeeded
  return {
    success: true,
    verified: true,
    mobile,
  };
};
