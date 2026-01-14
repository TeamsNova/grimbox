const crypto = require('crypto');

const PROMO_CODES = { 'OPEN15': 15 };

export default function handler(req, res) {
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
        const SECRET_KEY_1 = process.env.FREEKASSA_SECRET_1;
        const orderId = Date.now().toString();
        const currency = 'RUB';
        
        const signString = MERCHANT_ID + ':' + finalPrice + ':' + SECRET_KEY_1 + ':' + currency + ':' + orderId;
        const sign = crypto.createHash('md5').update(signString).digest('hex');

        const paymentUrl = 'https://pay.freekassa.com/?m=' + MERCHANT_ID + '&oa=' + finalPrice + '&currency=' + currency + '&o=' + orderId + '&s=' + sign + '&us_nickname=' + encodeURIComponent(nickname) + '&us_product=' + productId + '&lang=ru';

        return res.status(200).json({ success: true, paymentUrl, orderId, finalPrice, discount, originalPrice: price * quantity });
    } catch (error) {
        console.error('Payment creation error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
