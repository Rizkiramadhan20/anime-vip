import nodemailer from "nodemailer";

// Email template untuk OTP dengan styling modern
const createOTPEmailTemplate = (otp: string, displayName: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Email Verification - AniHuaVerse</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333;">
    <!-- Main Container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <!-- Email Content Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header Section -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                                🎬 AniHuaVerse
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                                Email Verification
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content Section -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: 600;">
                                Hello ${displayName}! 👋
                            </h2>
                            
                            <p style="margin: 0 0 25px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                                Thank you for registering with <strong>AniHuaVerse</strong>. To complete your registration and start exploring our amazing anime collection, please use the verification code below:
                            </p>
                            
                            <!-- OTP Code Container -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                                <tr>
                                    <td align="center" style="background: linear-gradient(135deg, #f8f9ff 0%, #e8f0ff 100%); border: 2px solid #667eea; border-radius: 12px; padding: 30px 20px;">
                                        <div style="font-size: 36px; font-weight: 700; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; text-align: center;">
                                            ${otp}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 25px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                                ⏰ This code will expire in <strong style="color: #e74c3c;">10 minutes</strong> for security reasons.
                            </p>
                            
                            <!-- Security Warning -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 25px 0;">
                                <tr>
                                    <td style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; border-radius: 8px;">
                                        <div style="display: flex; align-items: flex-start;">
                                            <span style="font-size: 20px; margin-right: 12px;">⚠️</span>
                                            <div>
                                                <strong style="color: #856404; font-size: 16px;">Security Notice:</strong><br>
                                                <span style="color: #856404; font-size: 14px; line-height: 1.5;">
                                                    Never share this code with anyone. AniHuaVerse will never ask for this code via phone, email, or any other method.
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 25px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                                If you didn't create an account with AniHuaVerse, please ignore this email.
                            </p>
                            
                            <p style="margin: 0; color: #555555; font-size: 16px; line-height: 1.6;">
                                Best regards,<br>
                                <strong style="color: #667eea;">The AniHuaVerse Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer Section -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">
                                © 2025 AniHuaVerse. All rights reserved.
                            </p>
                            <p style="margin: 0; color: #6c757d; font-size: 12px;">
                                This is an automated email, please do not reply.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

// Email template untuk reset password OTP
const createResetOTPEmailTemplate = (otp: string, displayName: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset - AniHuaVerse</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .otp-code {
            background: #fff;
            border: 2px dashed #667eea;
            padding: 20px;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            margin: 20px 0;
            border-radius: 8px;
            letter-spacing: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 14px;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .danger {
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔐 AniHuaVerse</h1>
        <p>Password Reset</p>
    </div>
    
    <div class="content">
        <h2>Hello ${displayName}!</h2>
        
        <p>We received a request to reset your password. Use the verification code below to complete the process:</p>
        
        <div class="otp-code">${otp}</div>
        
        <p>This code will expire in <strong>10 minutes</strong> for security reasons.</p>
        
        <div class="warning">
            <strong>⚠️ Security Notice:</strong><br>
            Never share this code with anyone. AniHuaVerse will never ask for this code via phone, email, or any other method.
        </div>
        
        <div class="danger">
            <strong>🚨 Important:</strong><br>
            If you didn't request a password reset, please ignore this email and your password will remain unchanged.
        </div>
        
        <p>Best regards,<br>
        The AniHuaVerse Team</p>
    </div>
    
    <div class="footer">
        <p>© 2024 AniHuaVerse. All rights reserved.</p>
        <p>This is an automated email, please do not reply.</p>
    </div>
</body>
</html>
`;

// Konfigurasi transporter email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail", // gmail, outlook, yahoo, etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Fungsi untuk mengirim email OTP
export const sendOTPEmail = async (
  email: string,
  otp: string,
  displayName: string
) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"AniHuaVerse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Verify Your Email - AniHuaVerse",
      html: createOTPEmailTemplate(otp, displayName),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};

// Fungsi untuk mengirim email welcome setelah verifikasi
export const sendWelcomeEmail = async (email: string, displayName: string) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"AniHuaVerse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to AniHuaVerse!",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <title>Welcome to AniHuaVerse</title>
            <!--[if mso]>
            <noscript>
                <xml>
                    <o:OfficeDocumentSettings>
                        <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                </xml>
            </noscript>
            <![endif]-->
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333333;">
            <!-- Main Container -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f4f4;">
                <tr>
                    <td align="center" style="padding: 20px 0;">
                        <!-- Email Content Container -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                            
                            <!-- Header Section -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                                        🎬 AniHuaVerse
                                    </h1>
                                    <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                                        Welcome to the Community!
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Content Section -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 24px; font-weight: 600;">
                                        Welcome ${displayName}! 🎉
                                    </h2>
                                    
                                    <p style="margin: 0 0 25px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                                        Congratulations! Your email has been successfully verified. You're now a proud member of the <strong>AniHuaVerse</strong> community!
                                    </p>
                                    
                                    <!-- Success Message -->
                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 30px 0;">
                                        <tr>
                                            <td align="center" style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border: 2px solid #28a745; border-radius: 12px; padding: 30px 20px;">
                                                <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
                                                <div style="font-size: 18px; font-weight: 600; color: #155724;">
                                                    Email Verified Successfully!
                                                </div>
                                            </td>
                                        </tr>
                                    </table>
                                    
                                    <p style="margin: 0 0 25px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                                        🚀 You can now access all features of AniHuaVerse and start exploring our amazing anime collection!
                                    </p>
                                    
                                    <p style="margin: 0 0 25px 0; color: #555555; font-size: 16px; line-height: 1.6;">
                                        Here's what you can do now:
                                    </p>
                                    
                                    <ul style="margin: 0 0 25px 0; padding-left: 20px; color: #555555; font-size: 16px; line-height: 1.6;">
                                        <li style="margin-bottom: 8px;">🎬 Browse our extensive anime library</li>
                                        <li style="margin-bottom: 8px;">⭐ Rate and review your favorite shows</li>
                                        <li style="margin-bottom: 8px;">📱 Access your account from any device</li>
                                        <li style="margin-bottom: 8px;">🔔 Get notified about new releases</li>
                                    </ul>
                                    
                                    <p style="margin: 0; color: #555555; font-size: 16px; line-height: 1.6;">
                                        Happy watching!<br>
                                        <strong style="color: #667eea;">The AniHuaVerse Team</strong>
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer Section -->
                            <tr>
                                <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                    <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 14px;">
                                        © 2025 AniHuaVerse. All rights reserved.
                                    </p>
                                    <p style="margin: 0; color: #6c757d; font-size: 12px;">
                                        This is an automated email, please do not reply.
                                    </p>
                                </td>
                            </tr>
                            
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent: %s", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Don't throw error for welcome email as it's not critical
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Fungsi untuk mengirim email OTP reset password
export const sendResetOTPEmail = async (
  email: string,
  otp: string,
  displayName: string
) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"AniHuaVerse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 Reset Your Password - AniHuaVerse",
      html: createResetOTPEmailTemplate(otp, displayName),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Reset OTP email sent: %s", info.messageId);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending reset OTP email:", error);
    throw new Error("Failed to send reset OTP email");
  }
};
