const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const HolidayEmail = require("../models/HolidayEmail");
const Student = require("../models/Student");
const PlatformSetting = require("../models/PlatformSetting");
const { sendSmtpMail, DEFAULT_SETTINGS } = require("./settingController");

let cachedLogoAttachment = null;
const getLogoAttachment = () => {
  if (cachedLogoAttachment) return cachedLogoAttachment;
  try {
    const candidatePaths = [
      path.resolve(__dirname, "../../../client/src/assets/apnavidya.png"),
      path.resolve(__dirname, "../../uploads/logo.png"),
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) {
        const buf = fs.readFileSync(p);
        const base64 = buf.toString("base64");
        const chunked = base64.match(/.{1,76}/g).join("\r\n");
        cachedLogoAttachment = {
          filename: "apnavidya-logo.png",
          contentType: "image/png",
          cid: "apnavidya-logo",
          content: chunked,
        };
        return cachedLogoAttachment;
      }
    }
  } catch (e) {
    console.error("Error reading logo file for email:", e.message);
  }
  return null;
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

// Generate attractive, responsive HTML email template for students (Header has ONLY LOGO - NO TEXT)
const buildHolidayEmailHtml = ({ holidayName, date, subject, content, studentName, fromName, generalSettings }) => {
  const institutionName = fromName || generalSettings?.siteName || "ApnaVidya Academy";
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "Upcoming Holiday";

  let logoUrl = generalSettings?.logoUrl;
  if (!logoUrl || logoUrl === "/images/logo.png" || !logoUrl.startsWith("http")) {
    logoUrl = "https://apnavidya.co.in/images/logo.png";
  }

  const safeContent = (content || "")
    .split("\n")
    .map((line) => line.trim())
    .map((line) => (line ? `<p style="margin: 0 0 14px 0; line-height: 1.7;">${line}</p>` : `<div style="height: 10px;"></div>`))
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject || holidayName}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px 12px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);">
    
    <!-- Top Header - CLEAN WHITE, NO BLUE, LARGER LOGO -->
    <div style="background-color: #ffffff; padding: 28px 24px 20px 24px; text-align: center; border-bottom: 1px solid #e2e8f0;">
      <a href="https://apnavidya.co.in" target="_blank" style="text-decoration: none; display: inline-block;">
        <img src="${logoUrl}" alt="${institutionName}" style="height: 64px; width: auto; max-width: 280px; object-fit: contain; display: block; margin: 0 auto; border: 0;" />
      </a>
    </div>

    <!-- Main Content Area -->
    <div style="padding: 32px 30px;">
      
      <!-- Greeting Badge -->
      <div style="display: inline-flex; align-items: center; background-color: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; padding: 6px 14px; border-radius: 10px; font-size: 13px; font-weight: 700; margin-bottom: 22px;">
        🎉 Holiday Notice: ${holidayName}
      </div>

      <p style="font-size: 16px; color: #0f172a; margin-top: 0; margin-bottom: 18px; font-weight: 700;">
        Dear ${studentName || "Student"},
      </p>

      <!-- Key Details Card -->
      <div style="background: linear-gradient(to right, #f8fafc, #f1f5f9); border: 1px solid #e2e8f0; border-left: 4px solid #2563eb; border-radius: 10px; padding: 18px 20px; margin: 20px 0 24px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="color: #64748b; padding-bottom: 8px; width: 140px; font-weight: 600;">Occasion / Festival:</td>
            <td style="color: #0f172a; font-weight: 800; padding-bottom: 8px;">${holidayName}</td>
          </tr>
          <tr>
            <td style="color: #64748b; font-weight: 600;">Holiday Date:</td>
            <td style="color: #2563eb; font-weight: 800;">${formattedDate}</td>
          </tr>
        </table>
      </div>

      <!-- Message Text -->
      <div style="font-size: 14px; color: #334155; line-height: 1.75;">
        ${safeContent}
      </div>

      <!-- Support Notice -->
      <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #64748b;">
        <p style="margin: 0;">For urgent academic queries or batch rescheduling questions, please connect through your student portal or helpline.</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 24px 30px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; text-align: center;">
      <p style="margin: 0 0 6px 0; font-weight: 700; color: #1e293b; font-size: 13px;">${institutionName}</p>
      <p style="margin: 0 0 10px 0; font-size: 12px; color: #64748b;">Empowering students with industry-ready skills & mentorship</p>
      <p style="margin: 0; font-size: 11px; color: #94a3b8;">
        This official notification was transmitted to enrolled learners of ${institutionName}.
      </p>
    </div>

  </div>
</body>
</html>`;
};

// Dispatch campaign emails to student list using SMTP credentials from Settings
const executeHolidayBroadcast = async (campaign, students) => {
  const setting = await PlatformSetting.findOne({
    where: { key: "platform_settings" },
  });

  if (!setting || !setting.email) {
    throw new Error(
      "Email configuration not found. Please navigate to Settings > Email Configuration and save your Gmail SMTP credentials."
    );
  }

  const emailConf = sanitizeObject(setting.email, DEFAULT_SETTINGS.email);
  const generalConf = sanitizeObject(setting.general, DEFAULT_SETTINGS.general);

  const cleanPass = (emailConf.gmailAppPassword || "").replace(/\s+/g, "");
  if (!cleanPass) {
    throw new Error(
      "Gmail App Password is not configured. Please open Settings > Email Configuration, enter your 16-character Google App Password, and click Save."
    );
  }

  const fromEmail = emailConf.fromEmail;
  if (!fromEmail || !fromEmail.includes("@")) {
    throw new Error(
      "Sender Gmail Address is not configured. Please open Settings > Email Configuration and set your Sender Gmail Address."
    );
  }

  const smtpHost = emailConf.smtpHost || "smtp.gmail.com";
  const smtpPort = Number(emailConf.smtpPort) || 465;
  const fromName = emailConf.fromName || generalConf?.siteName || "ApnaVidya Academy";

  // Filter students with valid emails
  const validStudents = (students || []).filter(
    (s) => s.email && s.email.trim().includes("@")
  );

  if (validStudents.length === 0) {
    throw new Error(
      "No eligible students with valid email addresses found to receive this broadcast."
    );
  }

  // Update status to Sending
  campaign.status = "Sending";
  campaign.recipientCount = validStudents.length;
  await campaign.save();

  let sentCount = 0;
  let failedCount = 0;
  const sentLogs = [];
  const errorLogs = [];

  const logoAttachment = getLogoAttachment();
  const attachments = logoAttachment ? [logoAttachment] : [];

  // Dispatch emails sequentially or in small paced intervals to avoid SMTP throttling
  for (const student of validStudents) {
    try {
      const studentEmail = student.email.trim();
      const studentName = student.name || "Student";

      const htmlContent = buildHolidayEmailHtml({
        holidayName: campaign.holidayName,
        date: campaign.date,
        subject: campaign.subject,
        content: campaign.content,
        studentName,
        fromName,
        generalSettings: generalConf,
      });

      const textFallback = [
        `Dear ${studentName},`,
        ``,
        `HOLIDAY NOTICE: ${campaign.holidayName}`,
        `Date: ${campaign.date}`,
        ``,
        campaign.content,
        ``,
        `--`,
        `${fromName}`,
      ].join("\r\n");

      await sendSmtpMail({
        host: smtpHost,
        port: smtpPort,
        user: fromEmail,
        pass: cleanPass,
        from: fromEmail,
        fromName: fromName,
        to: studentEmail,
        subject: campaign.subject,
        text: textFallback,
        html: htmlContent,
        attachments,
      });

      sentCount++;
      sentLogs.push({ email: studentEmail, name: studentName, sentAt: new Date() });
    } catch (err) {
      failedCount++;
      errorLogs.push({
        email: student.email,
        name: student.name,
        error: err.message,
      });
    }

    // Small delay between socket dispatches
    await new Promise((r) => setTimeout(r, 250));
  }

  campaign.sentCount = sentCount;
  campaign.failedCount = failedCount;
  campaign.sentAt = new Date();
  campaign.status = sentCount > 0 ? "Sent" : "Failed";
  campaign.deliveryLogs = {
    totalTargeted: validStudents.length,
    sentCount,
    failedCount,
    senderEmail: fromEmail,
    errors: errorLogs.slice(0, 10), // keep top errors for debugging
  };
  await campaign.save();

  return {
    success: true,
    totalTargeted: validStudents.length,
    sentCount,
    failedCount,
    campaign,
  };
};

// 1. Get All Holiday Broadcast Campaigns
const getHolidayEmails = async (req, res) => {
  try {
    const emails = await HolidayEmail.findAll({
      order: [["createdAt", "DESC"]],
    });

    const scheduled = emails.filter((e) => e.status === "Scheduled").length;
    const sent = emails.filter((e) => e.status === "Sent").length;
    const draft = emails.filter((e) => e.status === "Draft").length;
    const failed = emails.filter((e) => e.status === "Failed").length;

    return res.status(200).json({
      success: true,
      data: {
        emails,
        stats: {
          scheduled,
          sent,
          draft,
          failed,
          total: emails.length,
        },
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch holiday email broadcasts",
    });
  }
};

// 2. Get Single Campaign By ID
const getHolidayEmailById = async (req, res) => {
  try {
    const { id } = req.params;
    const email = await HolidayEmail.findByPk(id);
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Holiday email broadcast not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: email,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch holiday email broadcast",
    });
  }
};

// 3. Compose & Optionally Dispatch Holiday Email
const createHolidayEmail = async (req, res) => {
  try {
    const {
      holidayName,
      date,
      subject,
      recipients = "All Active Students",
      content,
      action = "draft", // "draft" | "schedule" | "send"
    } = req.body;

    if (!holidayName || !holidayName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Holiday / Occasion name is required.",
      });
    }
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Holiday date is required.",
      });
    }
    if (!subject || !subject.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email subject line is required.",
      });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email body message content is required.",
      });
    }

    // Determine target students
    const studentQuery = {};
    if (recipients.toLowerCase().includes("active")) {
      studentQuery.status = "Active";
    }

    const students = await Student.findAll({
      where: studentQuery,
      attributes: ["id", "name", "email", "status"],
    });

    let initialStatus = "Draft";
    if (action === "schedule") {
      initialStatus = "Scheduled";
    } else if (action === "send") {
      initialStatus = "Sending";
    }

    const campaign = await HolidayEmail.create({
      holidayName: holidayName.trim(),
      date,
      subject: subject.trim(),
      recipients,
      recipientCount: students.length,
      content: content.trim(),
      status: initialStatus,
    });

    // If Send Now requested, immediately dispatch via SMTP
    if (action === "send") {
      try {
        const dispatchResult = await executeHolidayBroadcast(campaign, students);
        return res.status(200).json({
          success: true,
          message: `Holiday broadcast dispatched successfully in real-time to ${dispatchResult.sentCount} student(s)!`,
          data: dispatchResult.campaign,
        });
      } catch (sendErr) {
        campaign.status = "Failed";
        campaign.deliveryLogs = { error: sendErr.message };
        await campaign.save();

        return res.status(400).json({
          success: false,
          message: sendErr.message || "Failed to dispatch emails via SMTP relay.",
          data: campaign,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message:
        action === "schedule"
          ? "Holiday broadcast successfully scheduled!"
          : "Holiday broadcast saved as draft.",
      data: campaign,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to create holiday broadcast",
    });
  }
};

// 4. Send an Existing Campaign in Real Time
const sendHolidayEmailNow = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await HolidayEmail.findByPk(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Holiday broadcast campaign not found.",
      });
    }

    if (campaign.status === "Sending") {
      return res.status(400).json({
        success: false,
        message: "Campaign is currently in the process of sending. Please wait.",
      });
    }

    const studentQuery = {};
    if (campaign.recipients && campaign.recipients.toLowerCase().includes("active")) {
      studentQuery.status = "Active";
    }

    const students = await Student.findAll({
      where: studentQuery,
      attributes: ["id", "name", "email", "status"],
    });

    if (students.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No students found in the selected audience group.",
      });
    }

    const result = await executeHolidayBroadcast(campaign, students);

    return res.status(200).json({
      success: true,
      message: `Holiday broadcast dispatched in real time to ${result.sentCount} of ${result.totalTargeted} student(s)!`,
      data: result.campaign,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "Failed to send holiday broadcast emails.",
    });
  }
};

// 5. Delete Campaign
const deleteHolidayEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const email = await HolidayEmail.findByPk(id);
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Holiday email broadcast not found",
      });
    }
    await email.destroy();
    return res.status(200).json({
      success: true,
      message: "Holiday email campaign deleted successfully.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete holiday email campaign",
    });
  }
};

// 6. Bulk Delete Campaigns
const bulkDeleteHolidayEmails = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Array of campaign IDs is required.",
      });
    }
    await HolidayEmail.destroy({
      where: { id: { [Op.in]: ids } },
    });
    return res.status(200).json({
      success: true,
      message: `Deleted ${ids.length} holiday email campaigns.`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete campaigns.",
    });
  }
};

// 7. Audience Count Helper
const getAudienceStats = async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const activeStudents = await Student.count({ where: { status: "Active" } });

    return res.status(200).json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch student audience stats",
    });
  }
};

module.exports = {
  getHolidayEmails,
  getHolidayEmailById,
  createHolidayEmail,
  sendHolidayEmailNow,
  deleteHolidayEmail,
  bulkDeleteHolidayEmails,
  getAudienceStats,
};

