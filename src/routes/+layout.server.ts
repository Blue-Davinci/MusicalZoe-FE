import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		user: locals.user,
		isAuthenticated: locals.isAuthenticated,
		isAdmin: locals.isAdmin,
		isVerified: locals.isVerified
	};
};
