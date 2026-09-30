import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, Smartphone, Edit2, RotateCw, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatMobileDisplay } from "../../../services/otpService";

const OtpVerificationStep = ({
  phone,
  onVerify,
  onResend,
  onBack,
  loading = false,
  error = null,
  title = "Verify Mobile Number",
  subtitle = null,
  submitLabel = "Verify & Confirm",
}) => {
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState(null);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  // 30s Countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleDigitChange = (index, value) => {
    // Only accept numbers
    const cleanValue = value.replace(/\D/g, "");

    // Handle paste of full 4-digit code
    if (cleanValue.length >= 4) {
      const newDigits = cleanValue.slice(0, 4).split("");
      setOtpDigits(newDigits);
      if (inputRefs[3].current) {
        inputRefs[3].current.focus();
      }
      onVerify(newDigits.join(""));
      return;
    }

    const singleDigit = cleanValue.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = singleDigit;
    setOtpDigits(newDigits);

    // Auto advance to next input box
    if (singleDigit && index < 3 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current.focus();
    }

    // Auto trigger verify if all 4 digits entered
    if (singleDigit && index === 3) {
      const fullCode = newDigits.join("");
      if (fullCode.length === 4) {
        onVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0 && inputRefs[index - 1].current) {
        inputRefs[index - 1].current.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs[index - 1].current.focus();
    } else if (e.key === "ArrowRight" && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasteData) return;

    const newDigits = ["", "", "", ""];
    for (let i = 0; i < 4 && i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setOtpDigits(newDigits);

    const targetFocus = Math.min(pasteData.length, 3);
    if (inputRefs[targetFocus].current) {
      inputRefs[targetFocus].current.focus();
    }

    if (pasteData.length >= 4) {
      onVerify(newDigits.join(""));
    }
  };

  const handleResendClick = async () => {
    if (resendCooldown > 0 || resending || loading) return;
    setResending(true);
    setResendNotice(null);
    try {
      await onResend();
      setResendCooldown(30);
      setOtpDigits(["", "", "", ""]);
      setResendNotice("A new 4-digit OTP has been sent via SMS.");
      if (inputRefs[0].current) {
        inputRefs[0].current.focus();
      }
      setTimeout(() => setResendNotice(null), 5000);
    } catch (err) {
      // Error is handled by parent or displayed via error prop
    } finally {
      setResending(false);
    }
  };

  const isComplete = otpDigits.every((d) => d !== "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComplete && !loading) {
      onVerify(otpDigits.join(""));
    }
  };

  return (
    <div className="py-2 animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center">
        {/* Verification Icon Badge */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-xs border border-blue-100">
          <ShieldCheck size={28} className="animate-pulse" />
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h3>
        <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
          {subtitle || "We sent a 4-digit SMS verification code to:"}
        </p>

        {/* Display phone number with edit option */}
        <div className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-semibold text-slate-800 border border-slate-200">
          <Smartphone size={14} className="text-blue-600" />
          <span>{formatMobileDisplay(phone)}</span>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              className="ml-1 text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer font-bold underline"
              title="Edit mobile number"
            >
              <Edit2 size={11} />
              <span>Change</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-5 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 flex items-start gap-2 animate-shake">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Resend Success Banner */}
      {resendNotice && (
        <div className="mt-5 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-700 flex items-start gap-2">
          <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
          <span>{resendNotice}</span>
        </div>
      )}

      {/* 4-Digit Inputs */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label className="block text-center text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Enter 4-Digit Verification Code
          </label>
          <div className="flex justify-center gap-3 sm:gap-4" onPaste={handlePaste}>
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                disabled={loading}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`h-14 w-12 sm:h-16 sm:w-14 rounded-2xl border-2 text-center text-2xl font-extrabold text-gray-900 transition-all focus:outline-none ${
                  digit
                    ? "border-blue-600 bg-blue-50/40 shadow-xs ring-2 ring-blue-100"
                    : "border-gray-200 bg-white hover:border-gray-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                } ${error ? "border-rose-400 bg-rose-50/20" : ""}`}
              />
            ))}
          </div>
        </div>

        {/* Resend Section */}
        <div className="text-center text-xs text-gray-500">
          {resendCooldown > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-gray-500 font-medium">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-600 animate-ping" />
              Resend OTP in <strong className="text-gray-800">00:{resendCooldown < 10 ? `0${resendCooldown}` : resendCooldown}</strong>
            </span>
          ) : (
            <div className="flex items-center justify-center gap-1.5">
              <span>Didn&apos;t receive the code?</span>
              <button
                type="button"
                onClick={handleResendClick}
                disabled={resending || loading}
                className="font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RotateCw size={12} className={resending ? "animate-spin" : ""} />
                <span>{resending ? "Sending..." : "Resend OTP"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-1">
          <button
            type="submit"
            disabled={!isComplete || loading}
            className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RotateCw size={16} className="animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <span>{submitLabel}</span>
            )}
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={loading}
              className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Edit Details</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OtpVerificationStep;
