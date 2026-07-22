import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// ======================================
// VERIFY EMAIL
// ======================================
export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: '"Prism Finance" <no-reply@prismfinance.com>',
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1E3A5F;">Welcome to Prism Finance</h2>
        <p>Click the button below to verify your email address. This link expires in 24 hours.</p>
        <a href="${verificationUrl}"
          style="display:inline-block;padding:12px 24px;background:#06B6D4;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">
          Verify email
        </a>
        <p style="color:#888;font-size:12px;">If you didn't create a Prism Finance account, ignore this email.</p>
      </div>
    `,
  });
};

// ======================================
// RESET PASSWORD
// ======================================
export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: '"Prism Finance" <no-reply@prismfinance.com>',
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1E3A5F;">Password reset</h2>
        <p>Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}"
          style="display:inline-block;padding:12px 24px;background:#06B6D4;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">
          Reset password
        </a>
        <p style="color:#888;font-size:12px;">If you didn't request a password reset, ignore this email.</p>
      </div>
    `,
  });
};

// ======================================
// 2FA CODE
// ======================================
export const send2FACode = async (email, code) => {
  await transporter.sendMail({
    from: '"Prism Finance" <no-reply@prismfinance.com>',
    to: email,
    subject: "Your login code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1E3A5F;">Your login code</h2>
        <p>Use the code below to complete your login. It expires in 10 minutes.</p>
        <div style="font-size:32px;font-weight:700;letter-spacing:8px;color:#06B6D4;margin:24px 0;">
          ${code}
        </div>
        <p style="color:#888;font-size:12px;">If you didn't attempt to log in, secure your account immediately.</p>
      </div>
    `,
  });
};

// ======================================
// SECURITY — PASSWORD CHANGED
// ======================================
export const sendPasswordChangedEmail = async (email) => {
  await transporter.sendMail({
    from: '"Prism Finance" <no-reply@prismfinance.com>',
    to: email,
    subject: "Your password was changed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1E3A5F;">Password changed</h2>
        <p>Your Prism Finance password was just changed.</p>
        <p>If this was you, no action is needed.</p>
        <p>If you did not make this change, reset your password immediately.</p>
        <a href="${process.env.CLIENT_URL}/forgot-password"
          style="display:inline-block;padding:12px 24px;background:#06B6D4;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">
          Reset password
        </a>
        <p style="color:#888;font-size:12px;">Prism Finance Security Team</p>
      </div>
    `,
  });
};

// ======================================
// SECURITY — NEW LOGIN
// ======================================
export const sendNewLoginEmail = async (email, firstName) => {
  const time = new Date().toUTCString();

  await transporter.sendMail({
    from: '"Prism Finance" <no-reply@prismfinance.com>',
    to: email,
    subject: "New login to your account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1E3A5F;">New login detected</h2>
        <p>Hi ${firstName}, a new login to your Prism Finance account was detected.</p>
        <div style="background:#f3f8fb;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="margin:0;color:#475569;font-size:14px;">Time: <strong>${time}</strong></p>
        </div>
        <p>If this was you, no action is needed.</p>
        <p>If you did not log in, reset your password immediately.</p>
        <a href="${process.env.CLIENT_URL}/forgot-password"
          style="display:inline-block;padding:12px 24px;background:#06B6D4;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0;">
          Reset password
        </a>
        <p style="color:#888;font-size:12px;">Prism Finance Security Team</p>
      </div>
    `,
  });
};

// ======================================
// TRANSACTION NOTIFICATION
// ======================================
export const sendTransactionEmail = async (email, firstName, transaction) => {
  const { title, amount, type, category, date } = transaction;
  const formattedDate = new Date(date).toDateString();
  const formattedAmount = `BWP ${Number(amount).toLocaleString()}`;
  const typeColor = type === "income" ? "#16a34a" : "#dc2626";
  const typeLabel = type === "income" ? "Income" : "Expense";

  await transporter.sendMail({
    from: '"Prism Finance" <no-reply@prismfinance.com>',
    to: email,
    subject: `New ${typeLabel} transaction recorded`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1E3A5F;">New transaction recorded</h2>
        <p>Hi ${firstName}, a new transaction has been added to your account.</p>
        <div style="background:#f3f8fb;border-radius:8px;padding:16px;margin:16px 0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;color:#475569;font-size:14px;">Title</td>
              <td style="padding:6px 0;font-weight:600;font-size:14px;">${title}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#475569;font-size:14px;">Amount</td>
              <td style="padding:6px 0;font-weight:600;font-size:14px;color:${typeColor};">${formattedAmount}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#475569;font-size:14px;">Type</td>
              <td style="padding:6px 0;font-weight:600;font-size:14px;color:${typeColor};">${typeLabel}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#475569;font-size:14px;">Category</td>
              <td style="padding:6px 0;font-weight:600;font-size:14px;">${category || "Uncategorized"}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#475569;font-size:14px;">Date</td>
              <td style="padding:6px 0;font-weight:600;font-size:14px;">${formattedDate}</td>
            </tr>
          </table>
        </div>
        <p style="color:#888;font-size:12px;">Prism Finance — your personal finance workspace</p>
      </div>
    `,
  });
};

// ======================================
// WEEKLY REPORT
// ======================================
export const sendWeeklyReportEmail = async (email, firstName, report) => {
  const { totalIncome, totalExpenses, netBalance, topCategory, transactionCount } = report;

  const formattedIncome = `BWP ${Number(totalIncome).toLocaleString()}`;
  const formattedExpenses = `BWP ${Number(totalExpenses).toLocaleString()}`;
  const formattedBalance = `BWP ${Number(netBalance).toLocaleString()}`;
  const balanceColor = netBalance >= 0 ? "#16a34a" : "#dc2626";

  await transporter.sendMail({
    from: '"Prism Finance" <no-reply@prismfinance.com>',
    to: email,
    subject: "Your weekly finance report",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1E3A5F;">Your weekly report</h2>
        <p>Hi ${firstName}, here's a summary of your finances for the past 7 days.</p>

        <div style="background:#f3f8fb;border-radius:8px;padding:16px;margin:16px 0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;color:#475569;font-size:14px;">Total Income</td>
              <td style="padding:6px 0;font-weight:600;font-size:14px;color:#16a34a;">${formattedIncome}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#475569;font-size:14px;">Total Expenses</td>
              <td style="padding:6px 0;font-weight:600;font-size:14px;color:#dc2626;">${formattedExpenses}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#475569;font-size:14px;">Net Balance</td>
              <td style="padding:6px 0;font-weight:600;font-size:14px;color:${balanceColor};">${formattedBalance}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#475569;font-size:14px;">Transactions</td>
              <td style="padding:6px 0;font-weight:600;font-size:14px;">${transactionCount}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#475569;font-size:14px;">Top Category</td>
              <td style="padding:6px 0;font-weight:600;font-size:14px;">${topCategory || "N/A"}</td>
            </tr>
          </table>
        </div>

        <p style="color:#888;font-size:12px;">Prism Finance — your personal finance workspace</p>
      </div>
    `,
  });
};

// ======================================
// BUDGET ALERT
// ======================================
export const sendBudgetAlertEmail = async (email, firstName, alert) => {
  const { category, spent, limit, percentage } = alert;
  const formattedSpent = `BWP ${Number(spent).toLocaleString()}`;
  const formattedLimit = `BWP ${Number(limit).toLocaleString()}`;
  const isExceeded = percentage >= 100;
  const alertColor = isExceeded ? "#dc2626" : "#f59e0b";
  const alertTitle = isExceeded
    ? `You've exceeded your ${category} budget`
    : `You've used 50% of your ${category} budget`;

  await transporter.sendMail({
    from: '"Prism Finance" <no-reply@prismfinance.com>',
    to: email,
    subject: alertTitle,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1E3A5F;">${alertTitle}</h2>
        <p>Hi ${firstName}, here's an update on your ${category} budget for this month.</p>

        <div style="background:#f3f8fb;border-radius:8px;padding:16px;margin:16px 0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0;color:#475569;font-size:14px;">Category</td>
              <td style="padding:6px 0;font-weight:600;font-size:14px;">${category}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#475569;font-size:14px;">Budget Limit</td>
              <td style="padding:6px 0;font-weight:600;font-size:14px;">${formattedLimit}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#475569;font-size:14px;">Amount Spent</td>
              <td style="padding:6px 0;font-weight:600;font-size:14px;color:${alertColor};">${formattedSpent}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#475569;font-size:14px;">Usage</td>
              <td style="padding:6px 0;font-weight:600;font-size:14px;color:${alertColor};">${percentage}%</td>
            </tr>
          </table>

          <!-- PROGRESS BAR -->
          <div style="margin-top:12px;background:#e2e8f0;border-radius:99px;height:8px;">
            <div style="width:${Math.min(percentage, 100)}%;background:${alertColor};border-radius:99px;height:8px;"></div>
          </div>
        </div>

        <p style="color:#888;font-size:12px;">Prism Finance — your personal finance workspace</p>
      </div>
    `,
  });
};