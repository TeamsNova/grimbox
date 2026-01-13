// GrimBox - Main JavaScript

// Products data - sorted by importance (best first, worst last)
const products = [
    // Виртуальные статусы
    { id: 1, name: "Winter", desc: "Виртуальный статус с сезонным оформлением и расширенными возможностями", price: 209, oldPrice: 1500, category: "privilege", image: "./assets/images/donate/winter.png" },
    { id: 2, name: "Custom", desc: "Индивидуальный виртуальный статус с персональными настройками", price: 174, oldPrice: 999, category: "privilege", image: "./assets/images/donate/custom.png" },
    { id: 3, name: "Grim", desc: "Премиальный виртуальный статус с максимальным набором функций", price: 160, oldPrice: 749, category: "privilege", image: "./assets/images/donate/grim.png" },
    { id: 4, name: "Legend", desc: "Виртуальный статус с расширенными возможностями", price: 104, oldPrice: 549, category: "privilege", image: "./assets/images/donate/legend.png" },
    { id: 5, name: "Elite", desc: "Виртуальный статус с базовым набором функций", price: 69, oldPrice: 389, category: "privilege", image: "./assets/images/donate/elite.png" },
    { id: 6, name: "Phantom", desc: "Виртуальный статус с уникальными визуальными эффектами", price: 39, oldPrice: 199, category: "privilege", image: "./assets/images/donate/phantom.png" },
    { id: 7, name: "Master", desc: "Виртуальный статус с продвинутым набором команд", price: 27, oldPrice: 149, category: "privilege", image: "./assets/images/donate/master.png" },
    { id: 8, name: "Hero", desc: "Виртуальный статус начального уровня", price: 13, oldPrice: 59, category: "privilege", image: "./assets/images/donate/hero.png" },
    // Виртуальные наборы
    { id: 9, name: "Кейс с Донатом", desc: "Виртуальный набор с случайным содержимым", price: 79, oldPrice: null, category: "keys", image: "./assets/images/keys/donate.png" },
    { id: 10, name: "Кейс с Супер Донатом", desc: "Виртуальный набор с улучшенным содержимым", price: 209, oldPrice: null, category: "keys", image: "./assets/images/keys/superdonate.png" },
    { id: 11, name: "Кейс с Гримами", desc: "Виртуальный набор с гарантированным содержимым", price: 104, oldPrice: 149, category: "keys", image: "./assets/images/keys/grimkeys.png" },
    { id: 12, name: "Кейс Всё или Ничего", desc: "Виртуальный набор с повышенной ценностью", price: 90, oldPrice: 129, category: "keys", image: "./assets/images/keys/all or nothing.png" },
    // Виртуальные товары
    { id: 13, name: "Игровая валюта", desc: "Виртуальная валюта для использования на сервере", price: 1, oldPrice: null, category: "other", image: "./assets/images/other/grims.png" },
    { id: 14, name: "Кейс с Титулами", desc: "Виртуальный набор с именными префиксами", price: 39, oldPrice: null, category: "other", image: "./assets/images/keys/tituls.png" }
];

// Render products with animation delay
function renderProducts(filter = 'all') {
    const grid = document.getElementById('products');
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    grid.innerHTML = filtered.map((p, i) => `
        <div class="product-card" style="animation-delay: ${i * 0.05}s">
            <div class="product-image">
                ${p.image ? `<img src="${p.image}" alt="${p.name}">` : `<div style="font-size:40px;opacity:0.3">🎁</div>`}
            </div>
            <div class="product-info">
                <h3 class="product-name">${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                <div class="product-footer">
                    <div class="product-price-wrapper">
                        <div class="product-price">от ${p.price} <span>₽</span></div>
                        ${p.oldPrice ? `<div class="product-old-price">${p.oldPrice} ₽ <span class="discount">-30%</span></div>` : ''}
                    </div>
                    <button class="btn btn-primary btn-buy" onclick="buy(${p.id})">Купить</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Category filter
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
    });
});

// Buy function - redirect to product page
function buy(id) {
    window.location.href = `./product.html?id=${id}`;
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
    });
});

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

// Create snowflakes
setInterval(createSnowflake, 150);

// Weather toggle
function toggleWeather() {
    snowEnabled = !snowEnabled;
    document.getElementById('snow-icon').style.display = snowEnabled ? 'block' : 'none';
    document.getElementById('sun-icon').style.display = snowEnabled ? 'none' : 'block';
    
    if (!snowEnabled) {
        snowContainer.innerHTML = '';
    }
}

// Init
renderProducts();
