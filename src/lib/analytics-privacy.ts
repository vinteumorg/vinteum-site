/**
 * Runs before the existing Umami tracker. This also protects client-side
 * navigation after the tracker was already loaded on another site page.
 * No donation events, error payloads or token-bearing referrers are collected.
 */
export const analyticsPrivacyScript = `
window.vinteumAnalyticsBeforeSend = function (_type, payload) {
  function sensitive(value) {
    var path = new URL(value, window.location.origin).pathname;
    return path === '/donate' || path.indexOf('/donate/') === 0 ||
      path === '/api/donations' || path.indexOf('/api/donations/') === 0;
  }
  try {
    if (!payload || typeof payload !== 'object' ||
        sensitive(window.location.pathname) || sensitive(payload.url || window.location.pathname)) return null;
    if (payload.referrer && sensitive(payload.referrer)) {
      return Object.assign({}, payload, { referrer: '' });
    }
    return payload;
  } catch (_) {
    return null;
  }
};
`;
