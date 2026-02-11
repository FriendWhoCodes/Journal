export async function sendWisdomFeedbackEmail(
  email: string,
  userName: string | null,
): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return { success: false, error: 'Email service not configured' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://goals.manofwisdom.co';
  const feedbackUrl = `${baseUrl}/priority/feedback`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Man of Wisdom <noreply@manofwisdom.co>',
      to: email,
      subject: 'Your Wisdom Feedback is Ready',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #065f46; font-size: 24px; margin-bottom: 16px;">
            Your Wisdom Feedback is Ready
          </h1>
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Hi ${userName || 'there'},
          </p>
          <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            The Man of Wisdom has reviewed your 2026 Blueprint and prepared personalized
            feedback for you. This includes analysis of your priorities, goal feedback,
            suggestions, and wisdom to guide your year.
          </p>
          <a href="${feedbackUrl}" style="display: inline-block; background-color: #059669; color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; padding: 14px 28px; border-radius: 8px; margin-bottom: 24px;">
            View Your Feedback
          </a>
          <p style="color: #6a6a6a; font-size: 14px; line-height: 1.5; margin-top: 32px;">
            Your priorities matter. This feedback is our way of investing in your success.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
          <p style="color: #9a9a9a; font-size: 12px;">
            Man of Wisdom - Goal Setter
          </p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return { success: false, error };
  }

  return { success: true };
}
