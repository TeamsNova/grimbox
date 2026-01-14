const crypto = require('crypto');
const PROMO_CODES = { 'OPEN15': 15 };

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { productId, price, quantity = 1, promoCode, nickname } = req.body;
        if (!productId || !price || !nickname) return res.status(400).json({ error: 'Missing required fields' });

        let finalPrice = price * quantity;
        let discount = 0;
        
        if (promoCode && PROMO_CODES[promoCode.toUpperCase()]) {
            discount = PROMO_CODES[promoCode.toUpperCase()];
            finalPrice = Math.round(finalPrice * (1 - discount / 100));
        }
        if (finalPrice < 1) finalPrice = 1;

        const MERCHANT_ID = process.env.FREEKASSA_MERCHANT_ID;
        const API_KEY = process.env.FREEKASSA_API_KEY;
        const orderId = Date.now().toString();
        const nonce = Date.now();

        const sign = crypto.createHash('md5').update(MERCHANT_ID + '|' + nonce + '|' + API_KEY).digest('hex');

        const apiResponse = await fetch('https://api.freekassa.com/v1/orders/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                shopId: parseInt(MERCHANT_ID),
                nonce: nonce,
                signature: sign,
                paymentId: orderId,
                i: 36,
                email: 'customer@grimbox.pw',
                ip: req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : '127.0.0.1',
                amount: finalPrice,
                currency: 'RUB',
                success_url: 'https://grimbox.pw/success.html',
                failure_url: 'https://grimbox.pw/fail.html',
                notification_url: 'https://grimbox.pw/api/payment-notification',
                us_nickname: nickname,
                us_product: productId.toString()
            })
        });

        const apiData = await apiResponse.json();

        if (apiData.type === 'success' && apiData.location) {
            return res.status(200).json({
                success: true,
                paymentUrl: apiData.location,
                orderId,
                finalPrice,
                discount,
                originalPrice: price * quantity
            });
        } else {
            console.error('FreeKassa API error:', apiData);
            return res.status(400).json({ error: apiData.msg || 'Payment creation failed' });
        }
    } catch (error) {
        console.error('Payment creation error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
