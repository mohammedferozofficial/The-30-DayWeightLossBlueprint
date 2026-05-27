// netlify/functions/get-ebook-download.js
// This function generates secure download links for purchased ebooks

const crypto = require('crypto');
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ ok: true })
        };
    }

    try {
        // Only allow POST requests
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({ error: 'Method not allowed' })
            };
        }

        const { orderId } = JSON.parse(event.body);

        if (!orderId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Order ID is required' 
                })
            };
        }

        // Step 1: Verify the order is valid (call verify-payment if needed)
        const verifyResponse = await fetch(
            `${process.env.URL}/.netlify/functions/verify-payment`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId: orderId })
            }
        );

        const verifyData = await verifyResponse.json();

        if (!verifyData.success) {
            console.log(`Order verification failed for ${orderId}`);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    message: 'Order not verified. Please complete payment first.'
                })
            };
        }

        // Step 2: Generate secure download token
        // Token includes order ID and timestamp, encrypted for security
        const timestamp = Date.now();
        const token = crypto
            .createHash('sha256')
            .update(`${orderId}-${timestamp}-${process.env.DOWNLOAD_SECRET || 'default'}`)
            .digest('hex');

        // Step 3: Create download URL
        // You can use Netlify's built-in redirects or a custom service
        const downloadUrl = `${process.env.URL}/downloads/ebook?token=${token}&order=${orderId}`;

        console.log(`✅ Download link generated for order ${orderId}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                message: 'Download link generated',
                downloadUrl: downloadUrl,
                fileName: '30-Day-Weight-Loss-Blueprint.pdf'
            })
        };

    } catch (error) {
        console.error('Error generating download link:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                message: 'An error occurred while preparing your download',
                error: error.message 
            })
        };
    }
};
