interface BlueprintPriority {
  name: string;
  why?: string;
  goals?: { what: string; byWhen?: string }[];
}

export async function sendBlueprintSummaryEmail(
  email: string,
  userName: string | null,
  priorities: BlueprintPriority[],
  identityStatement: string | null,
  year: number,
): Promise<{ success: boolean; error?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return { success: false, error: 'Email service not configured' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://goals.manofwisdom.co';
  const blueprintUrl = `${baseUrl}/priority/complete`;

  const validPriorities = priorities.filter(p => p.name?.trim());
  const totalGoals = validPriorities.reduce(
    (sum, p) => sum + (p.goals?.filter(g => g.what?.trim()).length || 0),
    0,
  );

  // Build priorities HTML
  const prioritiesHtml = validPriorities.map((p, i) => {
    const goalsHtml = (p.goals || [])
      .filter(g => g.what?.trim())
      .map(g => `
        <li style="color: #374151; font-size: 14px; line-height: 1.6; margin-bottom: 4px;">
          ${g.what}${g.byWhen ? ` <span style="color: #9ca3af;">— ${g.byWhen}</span>` : ''}
        </li>
      `)
      .join('');

    return `
      <div style="margin-bottom: 20px; padding-left: 16px; border-left: 3px solid #4f46e5;">
        <div style="font-size: 16px; font-weight: 600; color: #1f2937; margin-bottom: 4px;">
          ${i + 1}. ${p.name}
        </div>
        ${p.why ? `<div style="font-size: 13px; color: #6b7280; font-style: italic; margin-bottom: 8px;">"${p.why}"</div>` : ''}
        ${goalsHtml ? `<ul style="margin: 0; padding-left: 20px;">${goalsHtml}</ul>` : ''}
      </div>
    `;
  }).join('');

  // Build identity HTML
  const identityHtml = identityStatement ? `
    <div style="background-color: #eef2ff; padding: 20px; border-radius: 8px; margin: 24px 0;">
      <div style="font-size: 12px; font-weight: 600; color: #4f46e5; margin-bottom: 8px; text-transform: uppercase;">
        I Am Someone Who...
      </div>
      <div style="font-size: 16px; color: #1f2937; font-style: italic; line-height: 1.6;">
        "${identityStatement}"
      </div>
    </div>
  ` : '';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Man of Wisdom <noreply@manofwisdom.co>',
        to: email,
        subject: `Your ${year} Blueprint is Ready`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #1f2937; font-size: 28px; margin-bottom: 8px; text-align: center;">
              Your ${year} Blueprint
            </h1>
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-bottom: 32px;">
              ${validPriorities.length} Priorities &bull; ${totalGoals} Goals
            </p>

            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Hi ${userName || 'there'},
            </p>
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Congratulations on finalizing your ${year} Blueprint! Here's a summary of what you've committed to.
            </p>

            ${identityHtml}

            <h2 style="color: #4f46e5; font-size: 18px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">
              Your Priorities
            </h2>

            ${prioritiesHtml}

            <div style="text-align: center; margin: 32px 0;">
              <a href="${blueprintUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; padding: 14px 28px; border-radius: 8px;">
                View Your Blueprint
              </a>
            </div>

            <p style="color: #6a6a6a; font-size: 14px; line-height: 1.5; text-align: center;">
              Goals don't achieve themselves. Show up every day.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />
            <p style="color: #9a9a9a; font-size: 12px; text-align: center;">
              Man of Wisdom - Goal Setter
            </p>
          </div>
        `,
        text: `Your ${year} Blueprint\n\nHi ${userName || 'there'},\n\nCongratulations on finalizing your ${year} Blueprint!\n\n${validPriorities.map((p, i) => `${i + 1}. ${p.name}${p.goals?.filter(g => g.what?.trim()).map(g => `\n   - ${g.what}`).join('') || ''}`).join('\n')}\n\n${identityStatement ? `I Am Someone Who: "${identityStatement}"\n\n` : ''}View your blueprint: ${blueprintUrl}\n\nGoals don't achieve themselves. Show up every day.\n\nMan of Wisdom - Goal Setter`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending blueprint summary email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

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
