// netlify/functions/verify-payment.js
// This function verifies PayPal orders and returns payment status

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

        // Get PayPal credentials from environment variables
        const clientId = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            console.error('PayPal credentials not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Payment verification service temporarily unavailable' 
                })
            };
        }

        // Step 1: Get PayPal access token
        const authResponse = await fetch(
            'https://api-m.sandbox.paypal.com/v1/oauth2/token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                auth: {
                    username: clientId,
                    password: clientSecret
                },
                body: 'grant_type=client_credentials'
            }
        );

        if (!authResponse.ok) {
            console.error('Failed to get PayPal access token');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Authentication failed' 
                })
            };
        }

        const authData = await authResponse.json();
        const accessToken = authData.access_token;

        // Step 2: Get order details from PayPal
        const orderResponse = await fetch(
            `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );

        if (!orderResponse.ok) {
            console.error(`Order ${orderId} not found or invalid`);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false, 
                    message: 'Order not found' 
                })
            };
        }

        const orderData = await orderResponse.json();

        // Step 3: Check if payment was successful
        if (orderData.status === 'COMPLETED') {
            // Get payer email
            const payerEmail = orderData.payer?.email_address;
            const amount = orderData.purchase_units[0]?.amount?.value;

            console.log(`✅ Payment verified for order ${orderId}, email: ${payerEmail}, amount: $${amount}`);

            // Step 4: Save order to database (optional)
            // You can save to a database here if needed
            // Example: await saveOrderToDatabase({ orderId, payerEmail, amount, timestamp: new Date() });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true,
                    message: 'Payment verified successfully',
                    orderId: orderId,
                    email: payerEmail,
                    amount: amount
                })
            };
        } else {
            console.log(`Order ${orderId} status: ${orderData.status}`);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    message: `Payment not completed. Status: ${orderData.status}`
                })
            };
        }

    } catch (error) {
        console.error('Error verifying payment:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                message: 'An error occurred during payment verification',
                error: error.message 
            })
        };
    }
};
