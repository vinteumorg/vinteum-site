import { adminGetProfileAvatar, adminListMessages, adminListProfiles, adminModerateProfile } from '@/lib/donations/admin.mjs';
import { rateLimit } from '@/lib/donations/db.mjs';
import { createLoginLimiter } from './rate.mjs';
import { createAdminHandler } from './handler';

// Only the server route imports this composition root. There is no browser token.
export const handleAdminRequest = createAdminHandler({
  consumeLogin: createLoginLimiter(rateLimit),
  list: adminListProfiles,
  getAvatar: adminGetProfileAvatar,
  listMessages: adminListMessages,
  moderate: input => adminModerateProfile({...input,reason:input.reason}),
});
