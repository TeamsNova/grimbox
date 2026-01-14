const crypto = require('crypto');

// IP адреса FreeKassa для проверки
const FREEKASSA_IPS = ['168.119.157.136', '168.119.60.227', '178.154.197.79', '51.250.54.238'];

export default function handler(req, res) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Проверка IP (на Vercel IP в заголовке x-forwarded-for)
        const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                         req.headers['x-real-ip'] || 
                         req.connection?.remoteAddress;
        
        // В продакшене можно включить проверку IP
        // if (!FREEKASSA_IPS.includes(clientIP)) {
        //     console.error('Invalid IP:', clientIP);
        //     return res.status(403).send('Access denied');
        // }

        // FreeKassa отправляет данные через POST или GET
        const data = req.method === 'POST' ? req.body : req.query;
        
        const {
            MERCHANT_ID,
            AMOUNT,
            intid,
            MERCHANT_ORDER_ID,
            SIGN,
            us_nickname,
            us_product
        } = data;

        const SECRET_KEY_2 = process.env.FREEKASSA_SECRET_2;
        
        // Проверяем подпись: md5(merchant_id:amount:secret_word_2:order_id)
        const expectedSign = crypto
            .createHash('md5')
            .update(`${MERCHANT_ID}:${AMOUNT}:${SECRET_KEY_2}:${MERCHANT_ORDER_ID}`)
            .digest('hex');

        if (SIGN !== expectedSign) {
            console.error('Invalid signature');
            return res.status(400).send('Invalid signature');
        }

        // Платёж успешен!
        console.log('Payment successful:', {
            orderId: MERCHANT_ORDER_ID,
            amount: AMOUNT,
            nickname: us_nickname,
            product: us_product,
            transactionId: intid,
            ip: clientIP
        });

        // Здесь можно:
        // 1. Сохранить в базу данных
        // 2. Отправить уведомление в Discord/Telegram
        // 3. Выдать товар на сервере Minecraft через RCON

        // FreeKassa ожидает ответ "YES" при успешной обработке
        return res.status(200).send('YES');

    } catch (error) {
        console.error('Payment notification error:', error);
        return res.status(500).send('Error');
    }
}
