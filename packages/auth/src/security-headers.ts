export interface SecurityHeadersConfig {
  referrerPolicyOverrides?: Array<{ path: string; policy: string }>;
}

export function getSecurityHeaders(config: SecurityHeadersConfig = {}) {
  const baseHeaders = [
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-DNS-Prefetch-Control', value: 'on' },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=31536000; includeSubDomains',
    },
  ];

  const headerGroups: Array<{
    source: string;
    headers: Array<{ key: string; value: string }>;
  }> = [
    {
      source: '/(.*)',
      headers: baseHeaders,
    },
  ];

  if (config.referrerPolicyOverrides) {
    for (const override of config.referrerPolicyOverrides) {
      headerGroups.push({
        source: override.path,
        headers: [{ key: 'Referrer-Policy', value: override.policy }],
      });
    }
  }

  return headerGroups;
}
