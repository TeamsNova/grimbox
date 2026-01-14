// Промокоды
const PROMO_CODES = {
    'OPEN15': 15,
};

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { promoCode } = req.body;
    
    if (!promoCode) {
        return res.status(400).json({ valid: false, error: 'No promo code provided' });
    }

    const code = promoCode.toUpperCase().trim();
    const discount = PROMO_CODES[code];

    if (discount) {
        return res.status(200).json({ 
            valid: true, 
            discount,
            message: `Скидка ${discount}% применена!`
        });
    }

    return res.status(200).json({ 
        valid: false, 
        error: 'Промокод не найден'
    });
}
