// Data Storage
const storage = {
    getProducts: () => JSON.parse(localStorage.getItem('ecommerce_products') || '[]'),
    setProducts: (products) => localStorage.setItem('ecommerce_products', JSON.stringify(products)),
    getUsers: () => JSON.parse(localStorage.getItem('ecommerce_users') || '[]'),
    setUsers: (users) => localStorage.setItem('ecommerce_users', JSON.stringify(users)),
    getOrders: () => JSON.parse(localStorage.getItem('ecommerce_orders') || '[]'),
    setOrders: (orders) => localStorage.setItem('ecommerce_orders', JSON.stringify(orders)),
    getMessages: () => JSON.parse(localStorage.getItem('ecommerce_messages') || '[]'),
    setMessages: (messages) => localStorage.setItem('ecommerce_messages', JSON.stringify(messages)),
    getCart: () => JSON.parse(localStorage.getItem('ecommerce_cart') || '[]'),
    setCart: (cart) => localStorage.setItem('ecommerce_cart', JSON.stringify(cart)),
    getCurrentUser: () => JSON.parse(localStorage.getItem('ecommerce_current_user') || 'null'),
    setCurrentUser: (user) => localStorage.setItem('ecommerce_current_user', JSON.stringify(user)),
    getAdminSession: () => localStorage.getItem('ecommerce_admin_session') === 'true',
    setAdminSession: (isAdmin) => localStorage.setItem('ecommerce_admin_session', isAdmin.toString())
};

// Initial Products Data
const initialProducts = [
    {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 299.99,
        category: 'electronics',
        image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
        description: 'High-quality wireless headphones with noise cancellation',
        inStock: true,
        featured: true
    },
    {
        id: '2',
        name: 'Smart Watch Pro',
        price: 399.99,
        category: 'electronics',
        image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
        description: 'Advanced smartwatch with health monitoring features',
        inStock: true,
        featured: true
    },
    {
        id: '3',
        name: 'Designer Leather Jacket',
        price: 249.99,
        category: 'clothing',
        image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
        description: 'Premium leather jacket with modern design',
        inStock: true,
        featured: true
    },
    {
        id: '4',
        name: 'Minimalist Desk Lamp',
        price: 89.99,
        category: 'home',
        image: 'https://images.pexels.com/photos/1484759/pexels-photo-1484759.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
        description: 'Modern LED desk lamp with adjustable brightness',
        inStock: true
    },
    {
        id: '5',
        name: 'Wireless Bluetooth Speaker',
        price: 129.99,
        category: 'electronics',
        image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
        description: 'Portable speaker with premium sound quality',
        inStock: true
    },
    {
        id: '6',
        name: 'Organic Cotton T-Shirt',
        price: 29.99,
        category: 'clothing',
        image: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
        description: 'Sustainable and comfortable cotton t-shirt',
        inStock: false
    },
    {
        id: '7',
        name: 'Professional Camera',
        price: 899.99,
        category: 'electronics',
        image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
        description: 'High-resolution camera for professional photography',
        inStock: true
    },
    {
        id: '8',
        name: 'Ergonomic Office Chair',
        price: 199.99,
        category: 'home',
        image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
        description: 'Comfortable office chair with lumbar support',
        inStock: true
    }
];

// Global State
let currentPage = 'home';
let currentUser = null;
let isAdmin = false;
let cart = [];
let products = [];
let users = [];
let orders = [];
let messages = [];
let editingProduct = null;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeData();
    initializeEventListeners();
    updateUI();
    lucide.createIcons();
});

function initializeData() {
    // Initialize products if empty
    if (storage.getProducts().length === 0) {
        storage.setProducts(initialProducts);
    }
    
    products = storage.getProducts();
    users = storage.getUsers();
    orders = storage.getOrders();
    messages = storage.getMessages();
    cart = storage.getCart();
    currentUser = storage.getCurrentUser();
    isAdmin = storage.getAdminSession();
}

function initializeEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    // Login form toggle
    const loginSwitchBtn = document.getElementById('login-switch-btn');
    if (loginSwitchBtn) {
        loginSwitchBtn.addEventListener('click', toggleLoginForm);
    }

    // Password toggle
    const passwordToggle = document.getElementById('password-toggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', togglePassword);
    }

    // Forms
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletter);
    }

    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', handleProductForm);
    }

    // Search and filters
    const productSearch = document.getElementById('product-search');
    if (productSearch) {
        productSearch.addEventListener('input', filterProducts);
    }

    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }

    const sortProducts = document.getElementById('sort-products');
    if (sortProducts) {
        sortProducts.addEventListener('change', filterProducts);
    }

    // Admin search and filters
    const adminProductSearch = document.getElementById('admin-product-search');
    if (adminProductSearch) {
        adminProductSearch.addEventListener('input', filterAdminProducts);
    }

    const adminCategoryFilter = document.getElementById('admin-category-filter');
    if (adminCategoryFilter) {
        adminCategoryFilter.addEventListener('change', filterAdminProducts);
    }

    const adminOrderSearch = document.getElementById('admin-order-search');
    if (adminOrderSearch) {
        adminOrderSearch.addEventListener('input', filterAdminOrders);
    }

    const adminStatusFilter = document.getElementById('admin-status-filter');
    if (adminStatusFilter) {
        adminStatusFilter.addEventListener('change', filterAdminOrders);
    }

    const adminMessageSearch = document.getElementById('admin-message-search');
    if (adminMessageSearch) {
        adminMessageSearch.addEventListener('input', filterAdminMessages);
    }

    const adminUserSearch = document.getElementById('admin-user-search');
    if (adminUserSearch) {
        adminUserSearch.addEventListener('input', filterAdminUsers);
    }
}

// Navigation
function showPage(page) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.style.display = 'none');

    // Show selected page
    const targetPage = document.getElementById(`${page}-page`);
    if (targetPage) {
        targetPage.style.display = 'block';
        currentPage = page;
    }

    // Update navigation
    updateNavigation();

    // Load page content
    switch (page) {
        case 'home':
            loadFeaturedProducts();
            break;
        case 'products':
            loadProducts();
            break;
        case 'cart':
            loadCart();
            break;
        case 'checkout':
            loadCheckout();
            break;
        case 'account':
            if (!currentUser) {
                showPage('login');
                return;
            }
            loadAccount();
            break;
        case 'admin-dashboard':
            if (!isAdmin) {
                showPage('admin-login');
                return;
            }
            loadAdminDashboard();
            break;
        case 'admin-products':
            if (!isAdmin) {
                showPage('admin-login');
                return;
            }
            loadAdminProducts();
            break;
        case 'admin-orders':
            if (!isAdmin) {
                showPage('admin-login');
                return;
            }
            loadAdminOrders();
            break;
        case 'admin-messages':
            if (!isAdmin) {
                showPage('admin-login');
                return;
            }
            loadAdminMessages();
            break;
        case 'admin-users':
            if (!isAdmin) {
                showPage('admin-login');
                return;
            }
            loadAdminUsers();
            break;
    }

    // Close mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.remove('active');

    // Scroll to top
    window.scrollTo(0, 0);

    // Recreate icons
    setTimeout(() => lucide.createIcons(), 100);
}

function showAdminPage(page) {
    showPage(`admin-${page}`);
}

function updateNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === currentPage) {
            link.classList.add('active');
        }
    });
}

function updateUI() {
    updateCartCount();
    updateUserMenu();
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

function updateUserMenu() {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');

    if (currentUser) {
        loginBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        userName.textContent = currentUser.name;
    } else {
        loginBtn.style.display = 'block';
        userInfo.style.display = 'none';
    }
}

// Authentication
function toggleLoginForm() {
    const isLogin = document.getElementById('login-title').textContent.includes('Sign in');
    const title = document.getElementById('login-title');
    const switchText = document.getElementById('login-switch-text');
    const switchBtn = document.getElementById('login-switch-btn');
    const submitBtn = document.getElementById('login-submit');
    const nameGroup = document.getElementById('name-group');
    const nameInput = document.getElementById('register-name');
    const errorDiv = document.getElementById('login-error');

    if (isLogin) {
        // Switch to register
        title.textContent = 'Create your account';
        switchText.textContent = 'Already have an account?';
        switchBtn.textContent = 'Sign in';
        submitBtn.textContent = 'Create Account';
        nameGroup.style.display = 'block';
        nameInput.required = true;
    } else {
        // Switch to login
        title.textContent = 'Sign in to your account';
        switchText.textContent = "Don't have an account?";
        switchBtn.textContent = 'Sign up';
        submitBtn.textContent = 'Sign In';
        nameGroup.style.display = 'none';
        nameInput.required = false;
    }

    errorDiv.style.display = 'none';
    document.getElementById('login-form').reset();
}

function togglePassword() {
    const passwordInput = document.getElementById('login-password');
    const passwordToggle = document.getElementById('password-toggle');
    const icon = passwordToggle.querySelector('i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
    } else {
        passwordInput.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
    }

    lucide.createIcons();
}

function handleLogin(e) {
    e.preventDefault();
    
    const isLogin = document.getElementById('login-title').textContent.includes('Sign in');
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const name = document.getElementById('register-name').value;
    const errorDiv = document.getElementById('login-error');

    errorDiv.style.display = 'none';

    if (isLogin) {
        // Login
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            currentUser = user;
            storage.setCurrentUser(currentUser);
            showPage('account');
        } else {
            showError('login-error', 'Invalid email or password');
        }
    } else {
        // Register
        if (users.find(u => u.email === email)) {
            showError('login-error', 'Email already exists');
            return;
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password
        };

        users.push(newUser);
        storage.setUsers(users);
        currentUser = newUser;
        storage.setCurrentUser(currentUser);
        showPage('account');
    }

    updateUI();
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    if (email === 'admin@eliteshop.com' && password === 'admin123') {
        isAdmin = true;
        storage.setAdminSession(true);
        showPage('admin-dashboard');
    } else {
        showError('admin-login-error', 'Invalid admin credentials');
    }
}

function logout() {
    currentUser = null;
    storage.setCurrentUser(null);
    updateUI();
    showPage('home');
}

function adminLogout() {
    isAdmin = false;
    storage.setAdminSession(false);
    showPage('admin-login');
}

function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        users = users.filter(user => user.id !== currentUser.id);
        storage.setUsers(users);
        logout();
    }
}

// Products
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    const featuredProducts = products.filter(product => product.featured);

    container.innerHTML = featuredProducts.map(product => `
        <div class="featured-card">
            <div class="featured-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="featured-badge">Featured</div>
            </div>
            <div class="featured-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="featured-footer">
                    <span class="featured-price">$${product.price}</span>
                    <div class="featured-rating">
                        ${Array(5).fill('<i data-lucide="star" class="star"></i>').join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

function loadProducts() {
    loadCategoryFilter();
    filterProducts();
}

function loadCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    const categories = [...new Set(products.map(p => p.category))];
    
    categoryFilter.innerHTML = `
        <option value="all">All Categories</option>
        ${categories.map(category => 
            `<option value="${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</option>`
        ).join('')}
    `;
}

function filterProducts() {
    const searchTerm = document.getElementById('product-search')?.value.toLowerCase() || '';
    const selectedCategory = document.getElementById('category-filter')?.value || 'all';
    const sortBy = document.getElementById('sort-products')?.value || 'name';

    let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });

    displayProducts(filtered);
}

function displayProducts(productsToShow) {
    const container = document.getElementById('products-grid');
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="grid-column: 1 / -1; padding: 3rem;">
                <p style="font-size: 1.25rem; color: var(--gray-600);">No products found matching your criteria.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                    ${product.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
                ${product.featured ? '<div class="product-badge featured">Featured</div>' : ''}
            </div>
            <div class="product-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price}</span>
                    <div class="product-rating">
                        ${Array(5).fill('<i data-lucide="star" class="star"></i>').join('')}
                    </div>
                </div>
                <button 
                    class="add-to-cart-btn ${product.inStock ? 'available' : 'unavailable'}"
                    onclick="addToCart('${product.id}')"
                    ${!product.inStock ? 'disabled' : ''}
                >
                    <i data-lucide="shopping-cart"></i>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            product,
            quantity: 1
        });
    }

    storage.setCart(cart);
    updateCartCount();
}

// Cart
function loadCart() {
    const container = document.getElementById('cart-content');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <i data-lucide="shopping-bag" style="width: 4rem; height: 4rem;"></i>
                <h2>Your Cart is Empty</h2>
                <p>Add some products to get started!</p>
                <button class="btn-primary" onclick="showPage('products')">
                    Continue Shopping
                </button>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    const totalPrice = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    container.innerHTML = `
        <div class="cart-content">
            ${cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-content">
                        <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image">
                        <div class="cart-item-details">
                            <h3>${item.product.name}</h3>
                            <p>${item.product.description}</p>
                            <div class="cart-item-price">$${item.product.price}</div>
                        </div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                                <i data-lucide="minus"></i>
                            </button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                                <i data-lucide="plus"></i>
                            </button>
                        </div>
                        <div class="cart-item-total">
                            <div class="price">$${(item.product.price * item.quantity).toFixed(2)}</div>
                            <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
            <div class="cart-summary">
                <div class="cart-total">
                    <span>Total:</span>
                    <span>$${totalPrice.toFixed(2)}</span>
                </div>
                <div class="cart-actions">
                    <button class="btn-outline" onclick="showPage('products')">
                        Continue Shopping
                    </button>
                    <button class="btn-primary" onclick="showPage('checkout')">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    `;

    lucide.createIcons();
}

function updateQuantity(itemId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }

    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        storage.setCart(cart);
        updateCartCount();
        loadCart();
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    storage.setCart(cart);
    updateCartCount();
    loadCart();
}

// Checkout
function loadCheckout() {
    if (cart.length === 0) {
        showPage('cart');
        return;
    }

    const itemsContainer = document.getElementById('checkout-items');
    const totalContainer = document.getElementById('checkout-total');
    
    const totalPrice = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    itemsContainer.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <img src="${item.product.image}" alt="${item.product.name}">
            <div class="checkout-item-details">
                <h3>${item.product.name}</h3>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="checkout-item-price">$${(item.product.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    totalContainer.textContent = `$${totalPrice.toFixed(2)}`;

    // Pre-fill user info if logged in
    if (currentUser) {
        document.getElementById('customer-name').value = currentUser.name;
        document.getElementById('customer-email').value = currentUser.email;
    }
}

function handleCheckout(e) {
    e.preventDefault();
    
    const customerInfo = {
        name: document.getElementById('customer-name').value,
        email: document.getElementById('customer-email').value,
        phone: document.getElementById('customer-phone').value,
        address: document.getElementById('customer-address').value,
        postalCode: document.getElementById('customer-postal').value
    };

    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const totalPrice = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    const newOrder = {
        id: Date.now().toString(),
        userId: currentUser?.id || 'guest',
        items: [...cart],
        total: totalPrice,
        customerInfo,
        paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    orders.push(newOrder);
    storage.setOrders(orders);
    
    cart = [];
    storage.setCart(cart);
    updateCartCount();

    // Show success page
    document.getElementById('success-order-id').textContent = newOrder.id;
    showPage('order-success');
}

// Contact
function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const message = document.getElementById('contact-message').value;

    const newMessage = {
        id: Date.now().toString(),
        name,
        email,
        message,
        createdAt: new Date().toISOString()
    };

    messages.push(newMessage);
    storage.setMessages(messages);

    document.getElementById('contact-form').reset();
    showSuccess('contact-success', 'Thank you for your message! We\'ll get back to you soon.');
}

// Newsletter
function handleNewsletter(e) {
    e.preventDefault();
    
    const email = document.getElementById('newsletter-email').value;
    
    // Simulate newsletter subscription
    document.getElementById('newsletter-form').reset();
    showSuccess('newsletter-success', 'Thanks for subscribing! 🎉');
}

// Account
function loadAccount() {
    if (!currentUser) {
        showPage('login');
        return;
    }

    document.getElementById('account-name').textContent = `Welcome, ${currentUser.name}`;
    document.getElementById('account-email').textContent = currentUser.email;

    const userOrders = orders.filter(order => order.userId === currentUser.id);
    const ordersContainer = document.getElementById('user-orders');

    if (userOrders.length === 0) {
        ordersContainer.innerHTML = '<p style="color: var(--gray-600);">You haven\'t placed any orders yet.</p>';
        return;
    }

    ordersContainer.innerHTML = userOrders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <div>
                    <h3>Order #${order.id}</h3>
                    <p>${new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div class="order-total">
                    <div class="price">$${order.total.toFixed(2)}</div>
                    <div class="order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</div>
                </div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item-detail">
                        <img src="${item.product.image}" alt="${item.product.name}">
                        <div class="order-item-info">
                            <p>${item.product.name}</p>
                            <p>Quantity: ${item.quantity}</p>
                        </div>
                        <div class="order-item-price">$${(item.product.price * item.quantity).toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Admin Functions
function loadAdminDashboard() {
    // Update stats
    document.getElementById('total-products').textContent = products.length;
    document.getElementById('total-orders').textContent = orders.length;
    document.getElementById('total-messages').textContent = messages.length;
    document.getElementById('total-users').textContent = users.length;

    // Load recent orders
    const recentOrders = orders.slice(-5).reverse();
    const container = document.getElementById('recent-orders');

    if (recentOrders.length === 0) {
        container.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--gray-600);">No orders yet.</td></tr>';
        return;
    }

    container.innerHTML = recentOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.customerInfo.name}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

function loadAdminProducts() {
    loadAdminCategoryFilter();
    filterAdminProducts();
}

function loadAdminCategoryFilter() {
    const categoryFilter = document.getElementById('admin-category-filter');
    const categories = [...new Set(products.map(p => p.category))];
    
    categoryFilter.innerHTML = `
        <option value="all">All Categories</option>
        ${categories.map(category => 
            `<option value="${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</option>`
        ).join('')}
    `;
}

function filterAdminProducts() {
    const searchTerm = document.getElementById('admin-product-search')?.value.toLowerCase() || '';
    const selectedCategory = document.getElementById('admin-category-filter')?.value || 'all';

    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    displayAdminProducts(filtered);
}

function displayAdminProducts(productsToShow) {
    const container = document.getElementById('admin-products-table');
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--gray-600);">No products found.</td></tr>';
        return;
    }

    container.innerHTML = productsToShow.map(product => `
        <tr>
            <td>
                <div class="product-info">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-details">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                    </div>
                </div>
            </td>
            <td><span class="category-badge">${product.category}</span></td>
            <td>$${product.price}</td>
            <td>
                <button class="stock-toggle ${product.inStock ? 'in-stock' : 'out-of-stock'}" onclick="toggleStock('${product.id}')">
                    ${product.inStock ? 'In Stock' : 'Out of Stock'}
                </button>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editProduct('${product.id}')" title="Edit">
                        <i data-lucide="edit-2"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct('${product.id}')" title="Delete">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    lucide.createIcons();
}

function showAddProductModal() {
    editingProduct = null;
    document.getElementById('product-modal-title').textContent = 'Add New Product';
    document.getElementById('product-form').reset();
    document.getElementById('product-modal').classList.add('active');
}

function editProduct(productId) {
    editingProduct = products.find(p => p.id === productId);
    if (!editingProduct) return;

    document.getElementById('product-modal-title').textContent = 'Edit Product';
    document.getElementById('product-name').value = editingProduct.name;
    document.getElementById('product-price').value = editingProduct.price;
    document.getElementById('product-category').value = editingProduct.category;
    document.getElementById('product-image').value = editingProduct.image;
    document.getElementById('product-description').value = editingProduct.description;
    document.getElementById('product-stock').checked = editingProduct.inStock;
    
    document.getElementById('product-modal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
    editingProduct = null;
}

function handleProductForm(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        image: document.getElementById('product-image').value,
        description: document.getElementById('product-description').value,
        inStock: document.getElementById('product-stock').checked,
        id: editingProduct?.id || Date.now().toString()
    };

    if (editingProduct) {
        const index = products.findIndex(p => p.id === editingProduct.id);
        products[index] = productData;
    } else {
        products.push(productData);
    }

    storage.setProducts(products);
    closeProductModal();
    filterAdminProducts();
}

function toggleStock(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.inStock = !product.inStock;
        storage.setProducts(products);
        filterAdminProducts();
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        storage.setProducts(products);
        filterAdminProducts();
    }
}

function loadAdminOrders() {
    filterAdminOrders();
}

function filterAdminOrders() {
    const searchTerm = document.getElementById('admin-order-search')?.value.toLowerCase() || '';
    const selectedStatus = document.getElementById('admin-status-filter')?.value || 'all';

    const filtered = orders.filter(order => {
        const matchesSearch = order.customerInfo.name.toLowerCase().includes(searchTerm) ||
                            order.customerInfo.email.toLowerCase().includes(searchTerm) ||
                            order.id.includes(searchTerm);
        const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    displayAdminOrders(filtered);
}

function displayAdminOrders(ordersToShow) {
    const container = document.getElementById('admin-orders-table');
    
    if (ordersToShow.length === 0) {
        container.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--gray-600);">No orders found.</td></tr>';
        return;
    }

    container.innerHTML = ordersToShow.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>
                <div class="customer-info">
                    <h3>${order.customerInfo.name}</h3>
                    <p>${order.customerInfo.email}</p>
                </div>
            </td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="payment-badge ${order.paymentMethod}">${order.paymentMethod === 'card' ? 'Card' : 'Cash'}</span></td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewOrder('${order.id}')" title="View Details">
                        <i data-lucide="eye"></i>
                    </button>
                    ${order.status === 'pending' ? `
                        <button class="action-btn fulfill" onclick="fulfillOrder('${order.id}')" title="Mark as Fulfilled">
                            <i data-lucide="check"></i>
                        </button>
                    ` : ''}
                    <button class="action-btn delete" onclick="deleteOrder('${order.id}')" title="Delete Order">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    lucide.createIcons();
}

function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    document.getElementById('order-modal-title').textContent = `Order Details #${order.id}`;
    document.getElementById('order-modal-content').innerHTML = `
        <div class="order-details-grid">
            <div class="order-details-section">
                <h3>Customer Information</h3>
                <div class="order-details-info">
                    <p><strong>Name:</strong> ${order.customerInfo.name}</p>
                    <p><strong>Email:</strong> ${order.customerInfo.email}</p>
                    <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
                    <p><strong>Address:</strong> ${order.customerInfo.address}</p>
                    <p><strong>Postal Code:</strong> ${order.customerInfo.postalCode}</p>
                </div>
            </div>
            <div class="order-details-section">
                <h3>Order Information</h3>
                <div class="order-details-info">
                    <p><strong>Order ID:</strong> #${order.id}</p>
                    <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                    <p><strong>Payment:</strong> ${order.paymentMethod}</p>
                    <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                </div>
            </div>
        </div>
        <div class="order-details-section">
            <h3>Items</h3>
            <div class="order-items-list">
                ${order.items.map(item => `
                    <div class="order-item-row">
                        <img src="${item.product.image}" alt="${item.product.name}">
                        <div class="item-info">
                            <h4>${item.product.name}</h4>
                            <p>Quantity: ${item.quantity} × $${item.product.price} = $${(item.quantity * item.product.price).toFixed(2)}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.getElementById('order-modal').classList.add('active');
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.remove('active');
}

function fulfillOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'fulfilled';
        storage.setOrders(orders);
        filterAdminOrders();
        loadAdminDashboard();
    }
}

function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        orders = orders.filter(o => o.id !== orderId);
        storage.setOrders(orders);
        filterAdminOrders();
        loadAdminDashboard();
    }
}

function loadAdminMessages() {
    filterAdminMessages();
}

function filterAdminMessages() {
    const searchTerm = document.getElementById('admin-message-search')?.value.toLowerCase() || '';

    const filtered = messages.filter(message =>
        message.name.toLowerCase().includes(searchTerm) ||
        message.email.toLowerCase().includes(searchTerm) ||
        message.message.toLowerCase().includes(searchTerm)
    );

    displayAdminMessages(filtered);
}

function displayAdminMessages(messagesToShow) {
    const container = document.getElementById('admin-messages-list');
    
    if (messagesToShow.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i data-lucide="mail" style="width: 3rem; height: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
                <p style="color: var(--gray-600);">No messages found.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    container.innerHTML = messagesToShow.map(message => `
        <div class="message-card">
            <div class="message-header">
                <div class="message-info">
                    <div class="message-meta">
                        <i data-lucide="mail"></i>
                        <h3>${message.name}</h3>
                        <span>${message.email}</span>
                        <span>${new Date(message.createdAt).toLocaleDateString()}</span>
                        ${message.replied ? '<span class="replied-badge">Replied</span>' : ''}
                    </div>
                </div>
                <div class="action-buttons">
                    ${!message.replied ? `
                        <button class="action-btn reply" onclick="replyMessage('${message.id}')" title="Mark as Replied">
                            <i data-lucide="reply"></i>
                        </button>
                    ` : ''}
                    <button class="action-btn delete" onclick="deleteMessage('${message.id}')" title="Delete Message">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
            <div class="message-content">
                <p>${message.message}</p>
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

function replyMessage(messageId) {
    const message = messages.find(m => m.id === messageId);
    if (message) {
        message.replied = true;
        storage.setMessages(messages);
        filterAdminMessages();
        loadAdminDashboard();
    }
}

function deleteMessage(messageId) {
    if (confirm('Are you sure you want to delete this message?')) {
        messages = messages.filter(m => m.id !== messageId);
        storage.setMessages(messages);
        filterAdminMessages();
        loadAdminDashboard();
    }
}

function loadAdminUsers() {
    filterAdminUsers();
}

function filterAdminUsers() {
    const searchTerm = document.getElementById('admin-user-search')?.value.toLowerCase() || '';

    const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );

    displayAdminUsers(filtered);
}

function displayAdminUsers(usersToShow) {
    const container = document.getElementById('admin-users-table');
    
    if (usersToShow.length === 0) {
        container.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--gray-600);">No users found.</td></tr>';
        return;
    }

    container.innerHTML = usersToShow.map(user => {
        const userOrderCount = orders.filter(order => order.userId === user.id).length;
        
        return `
            <tr>
                <td>
                    <div class="user-info-admin">
                        <div class="user-avatar">
                            <i data-lucide="user"></i>
                        </div>
                        <div class="user-details">
                            <h3>${user.name}</h3>
                            <p>ID: ${user.id}</p>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td><span class="orders-count">${userOrderCount} orders</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn delete" onclick="deleteUser('${user.id}')" title="Delete User">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    lucide.createIcons();
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        users = users.filter(user => user.id !== userId);
        storage.setUsers(users);
        filterAdminUsers();
        loadAdminDashboard();
    }
}

// Utility Functions
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<p>${message}</p>`;
    element.style.display = 'block';
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<p>${message}</p>`;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// Admin access from URL
if (window.location.hash === '#admin') {
    showPage('admin-login');
}