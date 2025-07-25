// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				name: string;
				email: string;
				activated: boolean;
				created_at: string;
				// Optional fields for future expansion
				id?: string;
				first_name?: string;
				last_name?: string;
				role?: string;
			} | null;
			isAuthenticated: boolean;
			isAdmin: boolean;
			isVerified: boolean;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
