export const load = async ({ fetch }) => {
	try {
		// Use the API endpoint for health data
		const response = await fetch('/api/health');
		const result = await response.json();

		return {
			success: result.success,
			healthData: result.healthData,
			error: result.error
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to fetch health data',
			healthData: null
		};
	}
};
