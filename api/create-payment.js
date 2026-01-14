const crypto = require('crypto');

// Промокоды (можно потом вынести в базу данных)
const PROMO_CODES = {
    'OPEN15': 15,
};

export default function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { productId, productName, price, quantity = 1, promoCode, nickname } = req.body;

        if (!productId || !price || !nickname) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Применяем промокод
        let finalPrice = price * quantity;
        let discount = 0;
        
        if (promoCode && PROMO_CODES[promoCode.toUpperCase()]) {
            discount = PROMO_CODES[promoCode.toUpperCase()];
            finalPrice = Math.round(finalPrice * (1 - discount / 100));
        }

        // Минимальная сумма FreeKassa - 1 рубль
        if (finalPrice < 1) finalPrice = 1;

        const MERCHANT_ID = process.env.FREEKASSA_MERCHANT_ID;
        const SECRET_KEY_1 = process.env.FREEKASSA_SECRET_1;
        
        // Генерируем уникальный ID заказа
        const orderId = `${Date.now()}_${productId}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Формируем подпись: md5(merchant_id:amount:secret_word_1:currency:order_id)
        const signString = `${MERCHANT_ID}:${finalPrice}:${SECRET_KEY_1}:RUB:${orderId}`;
        const sign = crypto.createHash('md5').update(signString).digest('hex');

        // Формируем URL для оплаты
        const paymentUrl = new URL('https://pay.freekassa.com/');
        paymentUrl.searchParams.set('m', MERCHANT_ID);
        paymentUrl.searchParams.set('oa', finalPrice);
        paymentUrl.searchParams.set('currency', 'RUB');
        paymentUrl.searchParams.set('o', orderId);
        paymentUrl.searchParams.set('s', sign);
        paymentUrl.searchParams.set('us_nickname', nickname);
        paymentUrl.searchParams.set('us_product', productId);
        paymentUrl.searchParams.set('us_productname', productName || productId);

        return res.status(200).json({
            success: true,
            paymentUrl: paymentUrl.toString(),
            orderId,
            finalPrice,
            discount,
            originalPrice: price * quantity
        });

    } catch (error) {
        console.error('Payment creation error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
