// GrimBox - Product Page JavaScript

// Products data (same as main.js)
const products = [
    // Виртуальные статусы
    { id: 1, name: "Winter", desc: "Виртуальный статус с сезонным оформлением и расширенными возможностями", price: 209, oldPrice: 1500, category: "privilege", categoryName: "Виртуальный статус", image: "./assets/images/donate/winter.png" },
    { id: 2, name: "Custom", desc: "Индивидуальный виртуальный статус с персональными настройками", price: 174, oldPrice: 999, category: "privilege", categoryName: "Виртуальный статус", image: "./assets/images/donate/custom.png" },
    { id: 3, name: "Grim", desc: "Премиальный виртуальный статус с максимальным набором функций", price: 160, oldPrice: 749, category: "privilege", categoryName: "Виртуальный статус", image: "./assets/images/donate/grim.png" },
    { id: 4, name: "Legend", desc: "Виртуальный статус с расширенными возможностями", price: 104, oldPrice: 549, category: "privilege", categoryName: "Виртуальный статус", image: "./assets/images/donate/legend.png" },
    { id: 5, name: "Elite", desc: "Виртуальный статус с базовым набором функций", price: 69, oldPrice: 389, category: "privilege", categoryName: "Виртуальный статус", image: "./assets/images/donate/elite.png" },
    { id: 6, name: "Phantom", desc: "Виртуальный статус с уникальными визуальными эффектами", price: 39, oldPrice: 199, category: "privilege", categoryName: "Виртуальный статус", image: "./assets/images/donate/phantom.png" },
    { id: 7, name: "Master", desc: "Виртуальный статус с продвинутым набором команд", price: 27, oldPrice: 149, category: "privilege", categoryName: "Виртуальный статус", image: "./assets/images/donate/master.png" },
    { id: 8, name: "Hero", desc: "Виртуальный статус начального уровня", price: 13, oldPrice: 59, category: "privilege", categoryName: "Виртуальный статус", image: "./assets/images/donate/hero.png" },
    // Виртуальные наборы
    { id: 9, name: "Кейс с Донатом", desc: "Виртуальный набор с случайным содержимым", price: 79, oldPrice: null, category: "keys", categoryName: "Виртуальный набор", image: "./assets/images/keys/donate.png" },
    { id: 10, name: "Кейс с Супер Донатом", desc: "Виртуальный набор с улучшенным содержимым", price: 209, oldPrice: null, category: "keys", categoryName: "Виртуальный набор", image: "./assets/images/keys/superdonate.png" },
    { id: 11, name: "Кейс с Гримами", desc: "Виртуальный набор с гарантированным содержимым", price: 104, oldPrice: 149, category: "keys", categoryName: "Виртуальный набор", image: "./assets/images/keys/grimkeys.png" },
    { id: 12, name: "Кейс Всё или Ничего", desc: "Виртуальный набор с повышенной ценностью", price: 30, oldPrice: 69, category: "keys", categoryName: "Виртуальный набор", image: "./assets/images/keys/all or nothing.png" },
    { id: 15, name: "Кейс с Китами", desc: "Виртуальный набор с китовым содержимым", price: 69, oldPrice: 119, category: "keys", categoryName: "Виртуальный набор", image: "./assets/images/keys/kits.png" },
    // Виртуальные товары
    { id: 13, name: "Игровая валюта", desc: "Виртуальная валюта для использования на сервере", price: 1, oldPrice: null, category: "other", categoryName: "Виртуальный товар", image: "./assets/images/other/grims.png", hasQuantity: true },
    { id: 14, name: "Кейс с Титулами", desc: "Виртуальный набор с именными префиксами", price: 39, oldPrice: null, category: "other", categoryName: "Виртуальный набор", image: "./assets/images/keys/tituls.png" },
    { id: 16, name: "Разбан", desc: "Снятие бана с аккаунта на сервере", price: 83, oldPrice: 119, category: "other", categoryName: "Услуга", image: "./assets/images/other/unban.png" },
    { id: 17, name: "Размут", desc: "Снятие мута с аккаунта на сервере", price: 34, oldPrice: 49, category: "other", categoryName: "Услуга", image: "./assets/images/other/unmute.png" }
];

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id'));

// Current product
let currentProduct = null;
let currentQuantity = 1;
let promoDiscount = 0;

// Load product
function loadProduct() {
    currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) {
        window.location.href = './index.html#shop';
        return;
    }
    
    // Update page title
    document.title = `GrimBox - ${currentProduct.name}`;
    
    // Update product info
    document.getElementById('product-title').textContent = currentProduct.name;
    document.getElementById('product-description').textContent = currentProduct.desc;
    
    // Update image
    const img = document.getElementById('product-img');
    if (currentProduct.image) {
        img.src = currentProduct.image;
        img.alt = currentProduct.name;
    }
    
    // Update pricing
    document.getElementById('product-price').textContent = `${currentProduct.price} ₽`;
    const oldPriceEl = document.getElementById('product-old-price');
    if (currentProduct.oldPrice) {
        oldPriceEl.textContent = `${currentProduct.oldPrice} ₽`;
    } else {
        oldPriceEl.style.display = 'none';
    }
    
    // Show quantity selector for items that support it
    if (currentProduct.hasQuantity) {
        document.getElementById('quantity-section').style.display = 'block';
    }
    
    // Hide features block
    document.getElementById('product-features').style.display = 'none';
    
    updateTotal();
}

// Change quantity
function changeQty(delta) {
    const input = document.getElementById('quantity');
    let newVal = parseInt(input.value) + delta;
    if (newVal < 1) newVal = 1;
    if (newVal > 1000) newVal = 1000;
    input.value = newVal;
    currentQuantity = newVal;
    updateTotal();
}

// Handle quantity input change
document.getElementById('quantity')?.addEventListener('change', function() {
    let val = parseInt(this.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > 1000) val = 1000;
    this.value = val;
    currentQuantity = val;
    updateTotal();
});

// Apply promo code via API
async function applyPromo() {
    const code = document.getElementById('promo-code').value.trim();
    const messageEl = document.getElementById('promo-message');
    
    if (!code) {
        messageEl.textContent = '';
        promoDiscount = 0;
        updateTotal();
        return;
    }
    
    try {
        const response = await fetch('/api/check-promo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ promoCode: code })
        });
        
        const data = await response.json();
        
        if (data.valid) {
            promoDiscount = data.discount;
            messageEl.textContent = data.message;
            messageEl.className = 'promo-message success';
        } else {
            promoDiscount = 0;
            messageEl.textContent = data.error;
            messageEl.className = 'promo-message error';
        }
    } catch (error) {
        // Fallback to local promo codes if API fails
        const promoCodes = { 'OPEN15': 15 };
        const upperCode = code.toUpperCase();
        
        if (promoCodes[upperCode]) {
            promoDiscount = promoCodes[upperCode];
            messageEl.textContent = `Скидка ${promoDiscount}% применена!`;
            messageEl.className = 'promo-message success';
        } else {
            promoDiscount = 0;
            messageEl.textContent = 'Промокод не найден';
            messageEl.className = 'promo-message error';
        }
    }
    
    updateTotal();
}

// Update total price
function updateTotal() {
    if (!currentProduct) return;
    
    let total = currentProduct.price * currentQuantity;
    
    if (promoDiscount > 0) {
        total = total * (1 - promoDiscount / 100);
    }
    
    total = Math.round(total);
    document.getElementById('total-price').textContent = `${total} ₽`;
}

// Toast notification system
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
        error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>'
    };
    
    toast.innerHTML = `${icons[type] || icons.info}<span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Purchase function via FreeKassa API
async function purchase() {
    if (!currentProduct) return;
    
    const nicknameInput = document.getElementById('nickname');
    const nickname = nicknameInput.value.trim();
    
    if (!nickname) {
        nicknameInput.classList.add('error');
        showToast('Введите никнейм на сервере!', 'error');
        nicknameInput.focus();
        setTimeout(() => nicknameInput.classList.remove('error'), 400);
        return;
    }
    
    const promoCode = document.getElementById('promo-code').value.trim();
    
    showToast('Создаём платёж...', 'info');
    
    try {
        const response = await fetch('/api/create-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: currentProduct.id,
                productName: currentProduct.name,
                price: currentProduct.price,
                quantity: currentQuantity,
                promoCode: promoCode,
                nickname: nickname
            })
        });
        
        const data = await response.json();
        
        if (data.success && data.paymentUrl) {
            showToast('Перенаправляем на оплату...', 'success');
            setTimeout(() => {
                window.location.href = data.paymentUrl;
            }, 500);
        } else {
            showToast(data.error || 'Ошибка создания платежа', 'error');
        }
    } catch (error) {
        console.error('Payment error:', error);
        showToast('Ошибка соединения. Попробуйте позже.', 'error');
    }
}

// Snow Effect
let snowEnabled = true;
const snowContainer = document.getElementById('snow-container');

function createSnowflake() {
    if (!snowEnabled) return;
    
    const snowflake = document.createElement('div');
    snowflake.className = 'snowflake';
    snowflake.innerHTML = '❄';
    snowflake.style.left = Math.random() * 100 + '%';
    snowflake.style.fontSize = (Math.random() * 10 + 8) + 'px';
    snowflake.style.opacity = Math.random() * 0.6 + 0.2;
    snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's';
    
    snowContainer.appendChild(snowflake);
    setTimeout(() => snowflake.remove(), 10000);
}

setInterval(createSnowflake, 150);

function toggleWeather() {
    snowEnabled = !snowEnabled;
    document.getElementById('snow-icon').style.display = snowEnabled ? 'block' : 'none';
    document.getElementById('sun-icon').style.display = snowEnabled ? 'none' : 'block';
    if (!snowEnabled) snowContainer.innerHTML = '';
}

// Init
loadProduct();