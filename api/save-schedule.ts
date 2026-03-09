import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { schedule } = request.body;

    if (!schedule) {
        return response.status(400).json({ error: 'Schedule data is required' });
    }

    try {
        // SAVE TO STORAGE (Vercel KV)
        await kv.set('robs-garden-schedule', { schedule });

        console.log('Successfully saved schedule to KV:', schedule);

        return response.status(200).json({
            success: true,
            message: 'Schedule saved to database successfully.'
        });
    } catch (error: any) {
        console.error('Store error:', error);
        return response.status(500).json({
            error: 'Failed to persist schedule',
            details: error.message
        });
    }
}
