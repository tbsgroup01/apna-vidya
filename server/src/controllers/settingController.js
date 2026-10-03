const tls = require("tls");
const PlatformSetting = require("../models/PlatformSetting");
const User = require("../models/User");

const DEFAULT_SETTINGS = {
  key: "platform_settings",
  general: {
    siteName: "ApnaVidya",
    tagline: "Learn • Grow • Succeed",
    logoUrl: "/images/logo.png",
    faviconUrl: "/favicon.ico",
  },
  seo: {
    metaTitle: "ApnaVidya - Learn • Grow • Succeed | Leading Tech Education",
    metaDescription: "Master Full Stack Development, Data Science, Python, and DSA with live 1-on-1 mentoring, verified certifications, and guaranteed career support.",
    keywords: "coding bootcamp, web development, data science, ApnaVidya, full stack course, learn react, python dsa",
    ogImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  },
  customTags: [],
  contact: {
    phone: "+91 98765 43210",
    alternatePhone: "+91 98111 22334",
    email: "admissions@apnavidya.com",
    supportEmail: "support@apnavidya.com",
    whatsapp: "+91 98765 43210",
    address: "ApnaVidya Tower, 4th Floor, Sector 62, Noida, UP - 201301",
    workingHours: "Mon - Sat: 9:00 AM - 7:00 PM",
    googleMapsUrl: "https://maps.google.com/?q=Noida+Sector+62",
    social: {
      facebook: "https://facebook.com/apnavidya",
      instagram: "https://instagram.com/apnavidya_official",
      linkedin: "https://linkedin.com/company/apna-vidya",
      youtube: "https://youtube.com/@apnavidya",
      twitter: "https://twitter.com/apnavidya",
    },
  },
  email: {
    smtpHost: "smtp.gmail.com",
    smtpPort: 465,
    encryption: "SSL",
    fromEmail: "notifications@apnavidya.com",
    fromName: "ApnaVidya Academy",
    gmailAppPassword: "",
  },
};

const sanitizeObject = (obj, fallback = {}) => {
  if (!obj || typeof obj !== "object") return fallback;
  const cleaned = {};
  for (const key of Object.keys(obj)) {
    if (!/^\d+$/.test(key)) {
      cleaned[key] = obj[key];
    }
  }
  return Object.keys(cleaned).length > 0 ? cleaned : fallback;
};

const formatSettings = (setting) => {
  if (!setting) return DEFAULT_SETTINGS;
  const raw = typeof setting.toJSON === "function" ? setting.toJSON() : setting;
  const general = sanitizeObject(raw.general, DEFAULT_SETTINGS.general);
  const seo = sanitizeObject(raw.seo, DEFAULT_SETTINGS.seo);
  const contact = sanitizeObject(raw.contact, DEFAULT_SETTINGS.contact);
  const email = sanitizeObject(raw.email, DEFAULT_SETTINGS.email);
  const social = sanitizeObject(contact?.social, DEFAULT_SETTINGS.contact.social);
  const customTags = Array.isArray(raw.customTags) ? raw.customTags : DEFAULT_SETTINGS.customTags;

  const enforceHttps = (url) => {
    if (!url || typeof url !== "string") return url;
    if (url.startsWith("http://apna-vidya.towsindia.com") || url.startsWith("http://towsindia.com")) {
      return url.replace(/^http:\/\//i, "https://");
    }
    return url;
  };

  const genSettings = { ...DEFAULT_SETTINGS.general, ...general };
  if (genSettings.faviconUrl) genSettings.faviconUrl = enforceHttps(genSettings.faviconUrl);
  if (genSettings.logoUrl) genSettings.logoUrl = enforceHttps(genSettings.logoUrl);

  const seoSettings = { ...DEFAULT_SETTINGS.seo, ...seo };
  if (seoSettings.ogImage) seoSettings.ogImage = enforceHttps(seoSettings.ogImage);

  return {
    id: raw.id,
    key: raw.key || "platform_settings",
    general: genSettings,
    seo: seoSettings,
    customTags: customTags,
    contact: {
      ...DEFAULT_SETTINGS.contact,
      ...contact,
      social: { ...DEFAULT_SETTINGS.contact.social, ...social },
    },
    email: { ...DEFAULT_SETTINGS.email, ...email },
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
};

const sendSmtpMail = ({ host, port, user, pass, from, fromName, to, subject, text, html, attachments }) => {
  return new Promise((resolve, reject) => {
    const cleanPass = (pass || "").replace(/\s+/g, "");
    if (!cleanPass) {
      return reject(new Error("Gmail App Password is required to send test email."));
    }
    if (!user) {
      return reject(new Error("Sender email (Gmail address) is required."));
    }

    const socketPort = parseInt(port, 10) || 465;
    const socketHost = host || "smtp.gmail.com";
    let step = 0;
    let timer = null;

    const socket = tls.connect(
      {
        host: socketHost,
        port: socketPort,
        rejectUnauthorized: false,
        timeout: 12000,
      },
      () => { }
    );

    const cleanup = () => {
      if (timer) clearTimeout(timer);
      try {
        socket.end();
        socket.destroy();
      } catch (err) { }
    };

    timer = setTimeout(() => {
      cleanup();
      reject(new Error("SMTP connection timed out after 12 seconds."));
    }, 12000);

    socket.setEncoding("utf8");

    socket.on("data", (data) => {
      const line = data.toString();
      const code = parseInt(line.substring(0, 3), 10);

      if (code >= 400 && code <= 599) {
        cleanup();
        let message = `SMTP Error (${code}): ${line.trim()}`;
        if (code === 535) {
          message = "Authentication failed (535): Invalid Gmail username or App Password. Ensure 2-Step Verification is active on your Google account and you are using an authorized 16-character App Password.";
        }
        return reject(new Error(message));
      }

      if (step === 0 && (code === 220 || code === 250)) {
        step = 1;
        socket.write("EHLO localhost\r\n");
      } else if (step === 1 && code === 250) {
        step = 2;
        socket.write("AUTH LOGIN\r\n");
      } else if (step === 2 && code === 334) {
        step = 3;
        socket.write(Buffer.from(user).toString("base64") + "\r\n");
      } else if (step === 3 && code === 334) {
        step = 4;
        socket.write(Buffer.from(cleanPass).toString("base64") + "\r\n");
      } else if (step === 4 && code === 235) {
        step = 5;
        socket.write(`MAIL FROM:<${from || user}>\r\n`);
      } else if (step === 5 && code === 250) {
        step = 6;
        socket.write(`RCPT TO:<${to}>\r\n`);
      } else if (step === 6 && code === 250) {
        step = 7;
        socket.write("DATA\r\n");
      } else if (step === 7 && code === 354) {
        step = 8;
        const senderHeader = fromName ? `"${fromName}" <${from || user}>` : `<${from || user}>`;
        const mailSubject = subject || "ApnaVidya - SMTP Configuration Test Verified";
        const defaultBody = [
          `Congratulations!`,
          ``,
          `Your Gmail App SMTP relay on ApnaVidya is correctly configured and operational.`,
          ``,
          `Configuration Details:`,
          `- SMTP Server: ${socketHost}:${socketPort}`,
          `- Sender: ${from || user}`,
          `- Verified Recipient: ${to}`,
          `- Timestamp: ${new Date().toLocaleString("en-IN")}`,
          ``,
          `--`,
          `ApnaVidya Platform Automation Engine`,
        ].join("\r\n");

        const bodyContent = html || text || defaultBody;
        let emailContent = "";

        if (attachments && attachments.length > 0) {
          const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).substring(2)}`;
          const parts = [
            `From: ${senderHeader}`,
            `To: <${to}>`,
            `Subject: ${mailSubject}`,
            `Date: ${new Date().toUTCString()}`,
            `MIME-Version: 1.0`,
            `Content-Type: multipart/related; boundary="${boundary}"`,
            ``,
            `--${boundary}`,
            `Content-Type: text/html; charset=UTF-8`,
            `Content-Transfer-Encoding: 8bit`,
            ``,
            bodyContent,
            ``,
          ];

          for (const att of attachments) {
            parts.push(`--${boundary}`);
            parts.push(`Content-Type: ${att.contentType || "image/png"}; name="${att.filename || "image.png"}"`);
            parts.push(`Content-Transfer-Encoding: base64`);
            parts.push(`Content-ID: <${att.cid}>`);
            parts.push(`Content-Disposition: inline; filename="${att.filename || "image.png"}"`);
            parts.push(``);
            parts.push(att.content);
            parts.push(``);
          }

          parts.push(`--${boundary}--`);
          parts.push(`.`);
          parts.push(``);
          emailContent = parts.join("\r\n");
        } else {
          const contentType = html ? "text/html; charset=UTF-8" : "text/plain; charset=UTF-8";
          emailContent = [
            `From: ${senderHeader}`,
            `To: <${to}>`,
            `Subject: ${mailSubject}`,
            `Date: ${new Date().toUTCString()}`,
            `MIME-Version: 1.0`,
            `Content-Type: ${contentType}`,
            ``,
            bodyContent,
            `.`,
            ``,
          ].join("\r\n");
        }

        socket.write(emailContent);
      } else if (step === 8 && code === 250) {
        step = 9;
        socket.write("QUIT\r\n");
        cleanup();
        resolve({
          success: true,
          message: `Verification test email sent successfully to ${to}!`,
        });
      }
    });

    socket.on("error", (err) => {
      cleanup();
      reject(new Error(`SMTP Connection Error: ${err.message}`));
    });

    socket.on("timeout", () => {
      cleanup();
      reject(new Error("SMTP socket connection timed out."));
    });
  });
};

const getSettings = async (req, res) => {
  try {
    let setting = await PlatformSetting.findOne({
      where: { key: "platform_settings" },
    });
    if (!setting) {
      setting = await PlatformSetting.create(DEFAULT_SETTINGS);
    }
    const formatted = formatSettings(setting);
    if (setting.contact && Object.keys(setting.contact).some((k) => /^\d+$/.test(k))) {
      setting.contact = formatted.contact;
      setting.general = formatted.general;
      setting.seo = formatted.seo;
      setting.email = formatted.email;
      await setting.save();
    }
    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch platform settings",
    });
  }
};

const updateSettings = async (req, res) => {
  try {
    let setting = await PlatformSetting.findOne({
      where: { key: "platform_settings" },
    });
    if (!setting) {
      setting = await PlatformSetting.create(DEFAULT_SETTINGS);
    }

    const { general, seo, customTags, contact, email } = req.body;

    if (general !== undefined) setting.general = general;
    if (seo !== undefined) setting.seo = seo;
    if (customTags !== undefined) setting.customTags = customTags;
    if (contact !== undefined) setting.contact = contact;
    if (email !== undefined) setting.email = email;

    await setting.save();

    return res.status(200).json({
      success: true,
      message: "Platform settings updated successfully",
      data: formatSettings(setting),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update platform settings",
    });
  }
};

const sendTestEmail = async (req, res) => {
  try {
    const { toEmail, smtpHost, smtpPort, fromEmail, fromName, gmailAppPassword } = req.body;

    if (!toEmail || !toEmail.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "A valid recipient test email address is required.",
      });
    }

    let config = {
      host: smtpHost,
      port: smtpPort,
      user: fromEmail,
      pass: gmailAppPassword,
      from: fromEmail,
      fromName: fromName,
      to: toEmail,
    };

    if (!config.pass || !config.user) {
      const setting = await PlatformSetting.findOne({
        where: { key: "platform_settings" },
      });
      if (setting && setting.email) {
        const emailConf = sanitizeObject(setting.email, DEFAULT_SETTINGS.email);
        config.host = config.host || emailConf.smtpHost || "smtp.gmail.com";
        config.port = config.port || emailConf.smtpPort || 465;
        config.user = config.user || emailConf.fromEmail;
        config.pass = config.pass || emailConf.gmailAppPassword;
        config.from = config.from || emailConf.fromEmail;
        config.fromName = config.fromName || emailConf.fromName;
      }
    }

    if (!config.pass) {
      return res.status(400).json({
        success: false,
        message: "Gmail App Password is required. Please enter your 16-character App Password in Email Configuration.",
      });
    }

    const result = await sendSmtpMail(config);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to send test email.",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password, new password, and confirmation are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirmation password do not match.",
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required to change password.",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Administrator user account not found.",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password does not match our records.",
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Administrator password updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update password.",
    });
  }
};

const sendEmailFromSettings = async ({ to, subject, text, html }) => {
  try {
    const setting = await PlatformSetting.findOne({
      where: { key: "platform_settings" },
    });
    if (!setting || !setting.email) {
      return { success: false, skipped: true, message: "Email configuration not found." };
    }
    const emailConf = sanitizeObject(setting.email, DEFAULT_SETTINGS.email);
    const pass = (emailConf.gmailAppPassword || "").replace(/\s+/g, "");
    if (!pass) {
      return { success: false, skipped: true, message: "Gmail App Password not configured." };
    }
    const host = emailConf.smtpHost || "smtp.gmail.com";
    const port = emailConf.smtpPort || 465;
    const user = emailConf.fromEmail;
    const from = emailConf.fromEmail;
    const fromName = emailConf.fromName || "ApnaVidya";

    return await sendSmtpMail({
      host,
      port,
      user,
      pass,
      from,
      fromName,
      to,
      subject,
      text,
      html,
    });
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const getPublicSettings = async (req, res) => {
  try {
    let setting = await PlatformSetting.findOne({
      where: { key: "platform_settings" },
    });
    if (!setting) {
      setting = await PlatformSetting.create(DEFAULT_SETTINGS);
    }
    const formatted = formatSettings(setting);
    return res.status(200).json({
      success: true,
      data: {
        general: {
          siteName: formatted.general?.siteName || DEFAULT_SETTINGS.general.siteName,
          tagline: formatted.general?.tagline || DEFAULT_SETTINGS.general.tagline,
          logoUrl: formatted.general?.logoUrl || DEFAULT_SETTINGS.general.logoUrl,
          faviconUrl: formatted.general?.faviconUrl || DEFAULT_SETTINGS.general.faviconUrl,
        },
        seo: {
          metaTitle: formatted.seo?.metaTitle || DEFAULT_SETTINGS.seo.metaTitle,
          metaDescription: formatted.seo?.metaDescription || DEFAULT_SETTINGS.seo.metaDescription,
          keywords: formatted.seo?.keywords || DEFAULT_SETTINGS.seo.keywords,
          ogImage: formatted.seo?.ogImage || DEFAULT_SETTINGS.seo.ogImage,
        },
        customTags: (formatted.customTags || []).filter((t) => t.active !== false),
        contact: formatted.contact,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch platform settings",
    });
  }
};

const getPublicContactSettings = getPublicSettings;

module.exports = {
  DEFAULT_SETTINGS,
  formatSettings,
  getSettings,
  updateSettings,
  sendTestEmail,
  changePassword,
  getPublicSettings,
  getPublicContactSettings,
  sendSmtpMail,
  sendEmailFromSettings,
};
