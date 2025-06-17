import { z } from 'zod';

// Signup schema matching the expected JSON structure
export const signupSchema = z.object({
	name: z
		.string()
		.min(2, 'Name must be at least 2 characters')
		.max(100, 'Name must be less than 100 characters')
		.regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
	email: z
		.string()
		.email('Please enter a valid email address')
		.max(255, 'Email must be less than 255 characters')
		.toLowerCase(),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.max(128, 'Password must be less than 128 characters')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
			'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
		)
});

// Type inference from schema
export type SignupSchema = typeof signupSchema;
export type SignupData = z.infer<typeof signupSchema>;

// Interface for the signup response
export interface SignupResponse {
	success: boolean;
	message: string;
	data?: {
		id: string;
		name: string;
		email: string;
		created_at: string;
	};
	error?: string;
}
