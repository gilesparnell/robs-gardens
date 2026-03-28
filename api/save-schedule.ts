import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

const BLOB_PATH = 'robs-garden-schedule.json';

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { schedule } = request.body;

    if (!schedule || !schedule.weeks || !schedule.anchorDate) {
        return response.status(400).json({
            error: 'Schedule data is required with weeks array and anchorDate',
        });
    }

    if (!Array.isArray(schedule.weeks) || schedule.weeks.length !== 2) {
        return response.status(400).json({
            error: 'Schedule must have exactly 2 weeks',
        });
    }

    try {
        await put(BLOB_PATH, JSON.stringify(schedule), {
            access: 'private',
            addRandomSuffix: false,
        });

        console.log('Successfully saved rotating schedule to Blob');

        return response.status(200).json({
            success: true,
            message: 'Rotating schedule saved successfully.',
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('Store error:', message);
        return response.status(500).json({
            error: 'Failed to persist schedule',
        });
    }
}
