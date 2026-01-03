// Product Data (Mock)
const products = [
    {
        id: 1,
        name: "Cevizli Pestil (1kg)",
        category: "Klasik",
        price: 600,
        image: "assets/images/product-1.jpg",
        description: "Yerli cevizler ve doğal dut şırası ile geleneksel yöntemlerle güneşte kurutularak hazırlanmıştır."
    },
    {
        id: 2,
        name: "Fındıklı Pestil (1kg)",
        category: "Klasik",
        price: 650,
        image: "assets/images/product-2.jpg",
        description: "Taze Giresun fındıkları ile zenginleştirilmiş, enerji deposu doğal atıştırmalık."
    },
    {
        id: 3,
        name: "Ballı Köme (1kg)",
        category: "Özel",
        price: 700,
        image: "assets/images/product-3.jpg",
        description: "İçi ceviz dolgulu, dışı bal ve dut şırası karışımı ile kaplanmış eşsiz lezzet."
    },
    {
        id: 4,
        name: "Muska Tatlısı (1kg)",
        category: "Geleneksel",
        price: 900,
        image: "assets/images/product-4.jpg",
        description: "İnce pestil katmanları arasına fındık ve ceviz ezmesi konularak muska şeklinde sarılmıştır."
    }
];

// DOM Elements
const productGrid = document.querySelector('.product-grid');
const cartCount = document.querySelector('.cart-count');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
});

// Render Products
function renderProducts(category = 'Tümü') {
    if (!productGrid) return;

    const filteredProducts = category === 'Tümü'
        ? products
        : products.filter(p => p.category === category);

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card" onclick="window.location.href='product-detail.html?id=${product.id}'" style="cursor: pointer;">
            <div class="product-image">
                <!-- Placeholder if image fails -->
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x300?text=${product.name}'">
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} TL</div>
                <div class="product-controls" onclick="event.stopPropagation()" style="margin-top: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <label style="font-size: 0.9rem;">Adet:</label>
                    <input type="number" id="qty-${product.id}" min="1" value="1" style="width: 60px; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">Sepete Ekle</button>
            </div>
        </article>
    `).join('');
}

// Filter Products
window.filterProducts = (category) => {
    // Update active button style
    const buttons = document.querySelectorAll('.category-filter button');
    buttons.forEach(btn => {
        if (btn.innerText === category) {
            btn.classList.add('active-filter');
            btn.style.backgroundColor = 'var(--color-secondary)';
            btn.style.color = 'white';
        } else {
            btn.classList.remove('active-filter');
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }
    });

    renderProducts(category);
};

// Add to Cart
window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

    if (product && quantity > 0) {
        // Check if item already exists
        const existingItemIndex = cart.findIndex(item => item.id === productId);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ ...product, quantity: quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        // Simple feedback
        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = 'Eklendi!';
        btn.style.backgroundColor = 'var(--color-primary)';
        btn.style.color = 'white';

        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }, 1000);
    }
};

// Render Cart Page
window.renderCartPage = () => {
    const container = document.getElementById('cart-container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 2rem;">Sepetiniz boş.</p>';
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let html = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Ürün</th>
                    <th>Fiyat</th>
                    <th>Adet</th>
                    <th>Toplam</th>
                    <th>İşlem</th>
                </tr>
            </thead>
            <tbody>
    `;

    html += cart.map(item => `
        <tr>
            <td>
                <div class="cart-product-info">
                    <img src="${item.image}" class="cart-img" onerror="this.src='https://via.placeholder.com/60?text=${item.name}'">
                    <span>${item.name}</span>
                </div>
            </td>
            <td>${item.price} TL</td>
            <td>${item.quantity}</td>
            <td>${item.price * item.quantity} TL</td>
            <td>
                <button onclick="removeFromCart(${item.id})" style="color: red; background: none; border: none; cursor: pointer;">Kaldır</button>
            </td>
        </tr>
    `).join('');

    html += `
            </tbody>
        </table>
        
        <div class="cart-summary">
            <div class="summary-row">
                <span>Ara Toplam:</span>
                <span>${total} TL</span>
            </div>
            <div class="summary-total">
                <div class="summary-row" style="margin-bottom:0;">
                    <span>Genel Toplam:</span>
                    <span>${total} TL</span>
                </div>
            </div>
            <a href="payment.html" class="btn btn-primary" style="display: block; text-align: center; margin-top: 1.5rem;">Ödeme Yap</a>
        </div>
    `;

    container.innerHTML = html;
};

// Remove from Cart
window.removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartPage();
};

// Update Cart Count
function updateCartCount() {
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalItems;
    }
}

// Mobile Menu Toggle
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        if (navLinks.style.display === 'flex') {
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.backgroundColor = 'white';
            navLinks.style.padding = '1rem';
            navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        }
    });
}

// Render Product Detail
window.renderProductDetail = () => {
    const container = document.getElementById('product-detail-container');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    if (!product) {
        container.innerHTML = '<p style="text-align:center;">Ürün bulunamadı.</p>';
        return;
    }

    container.innerHTML = `
        <div class="product-detail-container">
            <div class="product-detail-left">
                <img src="${product.image}" alt="${product.name}" class="product-detail-image" onerror="this.src='https://via.placeholder.com/600x600?text=${product.name}'">
            </div>
            <div class="product-detail-info">
                <span class="product-category" style="font-size: 1rem; margin-bottom: 1rem;">${product.category}</span>
                <h1>${product.name}</h1>
                <div class="product-detail-price">${product.price} TL</div>
                <p class="product-detail-description">${product.description}</p>
                <p class="product-detail-description">Gümüşhane'nin bereketli topraklarından sofranıza gelen bu eşsiz lezzet, tamamen doğal yöntemlerle ve katkısız olarak üretilmiştir. Serin ve kuru yerde saklayınız.</p>
                
                <div class="detail-actions">
                    <input type="number" id="detail-qty" class="qty-input" value="1" min="1">
                    <button class="btn btn-primary" onclick="addToCartFromDetail(${product.id})">Sepete Ekle</button>
                </div>
            </div>
        </div>
    `;
};

// Add to Cart from Detail Page
window.addToCartFromDetail = (productId) => {
    const qtyInput = document.getElementById('detail-qty');
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;
    const product = products.find(p => p.id === productId);

    if (product && quantity > 0) {
        const existingItemIndex = cart.findIndex(item => item.id === productId);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({ ...product, quantity: quantity });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('Ürün sepete eklendi!');
    }
};
