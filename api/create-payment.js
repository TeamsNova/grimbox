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

        const MERCHANT_ID = 69001;
        const SECRET_1 = 'pW=V!3{qAti]5R0';
        const API_KEY = 'b5112256c1f3ebc24160b9ef6d0b67b2';
        const orderId = Date.now().toString();

        if (finalPrice >= 100) {
            const nonce = Date.now();
            const clientIp = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : '127.0.0.1';

            const data = {
                amount: finalPrice,
                currency: 'RUB',
                email: 'customer@grimbox.pw',
                i: 13,
                ip: clientIp,
                nonce: nonce,
                paymentId: orderId,
                shopId: MERCHANT_ID
            };

            const sortedKeys = Object.keys(data).sort();
            const signString = sortedKeys.map(key => data[key]).join('|');
            const signature = crypto.createHmac('sha256', API_KEY).update(signString).digest('hex');

            const requestBody = { ...data, signature };

            const apiResponse = await fetch('https://api.fk.life/v1/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
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
            }
        }

        const sign = crypto.createHash('md5').update(MERCHANT_ID + ':' + finalPrice + ':' + SECRET_1 + ':RUB:' + orderId).digest('hex');
        const paymentUrl = 'https://pay.fk.money/?m=' + MERCHANT_ID + '&oa=' + finalPrice + '&o=' + orderId + '&s=' + sign + '&currency=RUB&us_nickname=' + encodeURIComponent(nickname) + '&us_product=' + productId;

        return res.status(200).json({
            success: true,
            paymentUrl: paymentUrl,
            orderId,
            finalPrice,
            discount,
            originalPrice: price * quantity
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
