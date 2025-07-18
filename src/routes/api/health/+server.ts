import { json } from '@sveltejs/kit';
import { MUSIC_API_HEALTH_URL, APP_NAME, APP_VERSION, APP_ENV } from '$env/static/private';

export async function GET() {
	const startTime = Date.now();

	try {
		// Check frontend health
		const frontendHealth = {
			status: 'healthy',
			timestamp: new Date().toISOString(),
			service: APP_NAME || 'Musical Zoe Frontend',
			version: APP_VERSION || '1.0.0',
			environment: APP_ENV || 'development',
			responseTime: Date.now() - startTime
		};

		// Check music API health
		const musicApiHealth = await checkMusicApiHealth();

		// Determine overall status
		const overallStatus = musicApiHealth.status === 'healthy' ? 'healthy' : 'degraded';

		const healthData = {
			frontend: frontendHealth,
			musicApi: musicApiHealth,
			overall: {
				status: overallStatus,
				timestamp: new Date().toISOString()
			}
		};

		return json(
			{
				success: true,
				status: overallStatus,
				healthData,
				error: null
			},
			{
				status: overallStatus === 'healthy' ? 200 : 503
			}
		);
	} catch (error) {
		return json(
			{
				success: false,
				status: 'unhealthy',
				error: error instanceof Error ? error.message : 'Unknown error occurred',
				healthData: null
			},
			{
				status: 503
			}
		);
	}
}

// Helper function to check music API health
async function checkMusicApiHealth() {
	const startTime = Date.now();

	try {
		if (!MUSIC_API_HEALTH_URL) {
			return {
				status: 'degraded',
				message: 'Music API health URL not configured',
				responseTime: null
			};
		}

		const response = await fetch(MUSIC_API_HEALTH_URL, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'User-Agent': 'Musical-Zoe-Frontend/1.0.0'
			},
			// Timeout after 5 seconds
			signal: AbortSignal.timeout(5000)
		});

		const responseTime = Date.now() - startTime;

		if (response.ok) {
			return {
				status: 'healthy',
				message: 'Music API is responding',
				responseTime
			};
		} else {
			return {
				status: 'degraded',
				message: `Music API returned ${response.status}: ${response.statusText}`,
				responseTime
			};
		}
	} catch (error) {
		const responseTime = Date.now() - startTime;
		return {
			status: 'unhealthy',
			message: error instanceof Error ? error.message : 'Unknown error',
			responseTime
		};
	}
}
