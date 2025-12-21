import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export class EmailUtil {
  private static readonly FROM_EMAIL = 'onboarding@resend.dev'; // Resend test email
  private static readonly APP_NAME = 'ApniSec';

  static async sendWelcomeEmail(toEmail: string, userName: string): Promise<void> {
    try {
      await resend.emails.send({
        from: this.FROM_EMAIL,
        to: toEmail,
        subject: `Welcome to ${this.APP_NAME}!`,
        html: this.getWelcomeEmailTemplate(userName),
      });
      
      console.log(`Welcome email sent to ${toEmail}`);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      
    }
  }

  static async sendIssueCreatedEmail(
    toEmail: string,
    issueData: { type: string; title: string; description: string }
  ): Promise<void> {
    try {
      await resend.emails.send({
        from: this.FROM_EMAIL,
        to: toEmail,
        subject: `New Issue Created: ${issueData.title}`,
        html: this.getIssueCreatedTemplate(issueData),
      });
      
      console.log(`Issue notification email sent to ${toEmail}`);
    } catch (error) {
      console.error('Error sending issue notification email:', error);
      
    }
  }

  private static getWelcomeEmailTemplate(userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
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
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔐 Welcome to ApniSec!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName || 'there'}!</h2>
            <p>Thank you for joining ApniSec - your trusted cybersecurity partner.</p>
            <p>We're excited to have you on board! With ApniSec, you can:</p>
            <ul>
              <li>🛡️ Manage Cloud Security issues</li>
              <li>📊 Track Reteam Assessments</li>
              <li>🔍 Monitor VAPT (Vulnerability Assessment & Penetration Testing)</li>
            </ul>
            <p>Get started by creating your first issue and exploring our platform.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
          </div>
          <div class="footer">
            <p>© 2024 ApniSec. All rights reserved.</p>
            <p>Professional Cybersecurity Solutions</p>
          </div>
        </body>
      </html>
    `;
  }

  private static getIssueCreatedTemplate(issueData: {
    type: string;
    title: string;
    description: string;
  }): string {
    const typeEmoji = {
      'cloud-security': '☁️',
      'reteam-assessment': '📊',
      'vapt': '🔍',
    }[issueData.type] || '📋';

    const typeLabel = {
      'cloud-security': 'Cloud Security',
      'reteam-assessment': 'Reteam Assessment',
      'vapt': 'VAPT',
    }[issueData.type] || issueData.type;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
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
            .issue-card {
              background: white;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #667eea;
              margin: 20px 0;
            }
            .label {
              display: inline-block;
              padding: 5px 15px;
              background: #667eea;
              color: white;
              border-radius: 20px;
              font-size: 12px;
              margin-bottom: 10px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background: #667eea;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${typeEmoji} New Issue Created</h1>
          </div>
          <div class="content">
            <p>A new issue has been created in your ApniSec dashboard:</p>
            
            <div class="issue-card">
              <span class="label">${typeLabel}</span>
              <h2>${issueData.title}</h2>
              <p><strong>Description:</strong></p>
              <p>${issueData.description}</p>
            </div>

            <p>You can view and manage this issue in your dashboard.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">View Issue</a>
          </div>
          <div class="footer">
            <p>© 2024 ApniSec. All rights reserved.</p>
            <p>Professional Cybersecurity Solutions</p>
          </div>
        </body>
      </html>
    `;
  }
}