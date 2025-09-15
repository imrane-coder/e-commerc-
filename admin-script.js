// Global variables
let currentTab = 'overview';
let editingProductId = null;

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Check if admin is already logged in
    const adminToken = sessionStorage.getItem('adminToken');
    if (adminToken) {
        showDashboard();
    }
});

// Admin authentication
function adminLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    if (email === 'admin@shop.com' && password === 'admin123') {
        sessionStorage.setItem('adminToken', 'admin-logged-in');
        showDashboard();
        showToast('Welcome to Admin Dashboard!');
    } else {
        showToast('Invalid admin credentials', 'error');
    }
}

function adminLogout() {
    sessionStorage.removeItem('adminToken');
    document.getElementById('adminLoginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
    showToast('Logged out successfully');
}

function showDashboard() {
    document.getElementById('adminLoginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
    loadDashboardData();
}

// Tab navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    
    // Add active class to nav item
    event.target.closest('.nav-item').classList.add('active');
    
    // Update page title
    const titles = {
        overview: 'Dashboard Overview',
        orders: 'Orders Management',
        products: 'Products Management',
        messages: 'Customer Messages',
        users: 'Users Management'
    };
    
    document.getElementById('pageTitle').textContent = titles[tabName];
    currentTab = tabName;
    
    // Load tab-specific data
    switch(tabName) {
        case 'overview':
            loadOverviewData();
            break;
        case 'orders':
            loadOrdersData();
            break;
        case 'products':
            loadProductsData();
            break;
        case 'messages':
            loadMessagesData();
            break;
        case 'users':
            loadUsersData();
            break;
    }
}

// Load dashboard data
function loadDashboardData() {
    loadOverviewData();
    updateBadges();
}

function updateBadges() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    document.getElementById('ordersBadge').textContent = orders.length;
    document.getElementById('messagesBadge').textContent = messages.length;
}

// Overview tab
function loadOverviewData() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Calculate stats
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalUsers = users.filter(u => u.role === 'user').length;
    
    // Update stats
    document.getElementById('totalRevenue').textContent = formatPrice(totalRevenue);
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalUsers').textContent = totalUsers;
    
    // Load recent orders
    loadRecentOrders();
}

function loadRecentOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const recentOrders = orders.slice(-5).reverse();
    
    const tbody = document.querySelector('#recentOrdersTable tbody');
    
    if (recentOrders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No orders found</td></tr>';
        return;
    }
    
    tbody.innerHTML = recentOrders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>${order.userInfo.name}</td>
            <td>${formatPrice(order.total)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>${formatDate(order.createdAt)}</td>
        </tr>
    `).join('');
}

// Orders tab
function loadOrdersData() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    displayOrders(orders);
}

function displayOrders(orders) {
    const tbody = document.querySelector('#ordersTable tbody');
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No orders found</td></tr>';
        return;
    }
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order.id}</td>
            <td>
                <div>
                    <div style="font-weight: 600;">${order.userInfo.name}</div>
                    <div style="font-size: 0.8rem; color: #64748b;">${order.userInfo.email}</div>
                </div>
            </td>
            <td>${order.items.length} items</td>
            <td>${formatPrice(order.total)}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-${order.paymentMethod === 'cash' ? 'truck' : 'credit-card'}"></i>
                    ${order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Credit Card'}
                </div>
            </td>
            <td>
                <select onchange="updateOrderStatus('${order.id}', this.value)" class="status-badge status-${order.status}" style="border: none; background: transparent;">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                </select>
            </td>
            <td>${formatDate(order.createdAt)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

function filterOrders() {
    const status = document.getElementById('orderStatusFilter').value;
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    const filtered = status === 'all' ? orders : orders.filter(order => order.status === status);
    displayOrders(filtered);
}

function updateOrderStatus(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        showToast('Order status updated successfully!');
        loadOrdersData();
    }
}

function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    const content = document.getElementById('orderDetailsContent');
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
            <div>
                <h3 style="margin-bottom: 1rem; color: #1e293b;">Order Information</h3>
                <div style="space-y: 0.5rem;">
                    <p><strong>Order ID:</strong> #${order.id}</p>
                    <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
                    <p><strong>Payment:</strong> ${order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Credit Card'}</p>
                    <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
                </div>
            </div>
            <div>
                <h3 style="margin-bottom: 1rem; color: #1e293b;">Customer Information</h3>
                <div style="space-y: 0.5rem;">
                    <p><strong>Name:</strong> ${order.userInfo.name}</p>
                    <p><strong>Email:</strong> ${order.userInfo.email}</p>
                    <p><strong>Phone:</strong> ${order.userInfo.phone}</p>
                    <p><strong>Address:</strong> ${order.userInfo.address}</p>
                    <p><strong>Postal Code:</strong> ${order.userInfo.postalCode}</p>
                </div>
            </div>
        </div>
        
        <div>
            <h3 style="margin-bottom: 1rem; color: #1e293b;">Order Items</h3>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.productName}</td>
                                <td>${item.quantity}</td>
                                <td>${formatPrice(item.price)}</td>
                                <td>${formatPrice(item.price * item.quantity)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    document.getElementById('orderDetailsModal').style.display = 'block';
}

// Products tab
function loadProductsData() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    displayAdminProducts(products);
}

function displayAdminProducts(products) {
    const grid = document.getElementById('adminProductsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-box"></i><h3>No products found</h3><p>Add your first product to get started</p></div>';
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="admin-product-card">
            <img src="${product.image}" alt="${product.name}" class="admin-product-image">
            <div class="admin-product-info">
                <div class="admin-product-name">${product.name}</div>
                <div class="admin-product-category">${product.category}</div>
                <div class="admin-product-description">${product.description}</div>
                <div class="admin-product-price">${formatPrice(product.price)}</div>
                <div class="admin-product-stock ${product.stock > 0 ? 'stock-in' : 'stock-out'}">
                    ${product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </div>
                <div class="admin-product-actions">
                    <button class="btn btn-sm btn-primary" onclick="editProduct('${product.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="toggleProductStock('${product.id}')">
                        <i class="fas fa-box"></i> ${product.stock > 0 ? 'Out' : 'In'}
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct('${product.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function showAddProductModal() {
    editingProductId = null;
    document.getElementById('productModalTitle').textContent = 'Add New Product';
    document.getElementById('productForm').reset();
    document.getElementById('addProductModal').style.display = 'block';
}

function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    editingProductId = productId;
    document.getElementById('productModalTitle').textContent = 'Edit Product';
    
    // Fill form with product data
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productDescription').value = product.description;
    
    document.getElementById('addProductModal').style.display = 'block';
}

function saveProduct(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        category: document.getElementById('productCategory').value,
        stock: parseInt(document.getElementById('productStock').value),
        image: document.getElementById('productImage').value || 'https://images.pexels.com/photos/1667088/pexels-photo-1667088.jpeg?auto=compress&cs=tinysrgb&w=500',
        description: document.getElementById('productDescription').value
    };
    
    let products = JSON.parse(localStorage.getItem('products') || '[]');
    
    if (editingProductId) {
        // Update existing product
        const productIndex = products.findIndex(p => p.id === editingProductId);
        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...productData };
            showToast('Product updated successfully!');
        }
    } else {
        // Add new product
        const newProduct = {
            id: generateId(),
            ...productData,
            createdAt: new Date().toISOString()
        };
        products.push(newProduct);
        showToast('Product added successfully!');
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    closeProductModal();
    loadProductsData();
}

function toggleProductStock(productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
        products[productIndex].stock = products[productIndex].stock > 0 ? 0 : 10;
        localStorage.setItem('products', JSON.stringify(products));
        showToast('Product stock updated!');
        loadProductsData();
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = JSON.parse(localStorage.getItem('products') || '[]');
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        showToast('Product deleted successfully!');
        loadProductsData();
    }
}

function closeProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
    editingProductId = null;
}

// Messages tab
function loadMessagesData() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    displayMessages(messages);
}

function displayMessages(messages) {
    const container = document.getElementById('messagesContainer');
    
    if (messages.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-envelope"></i><h3>No messages</h3><p>No customer messages have been received yet</p></div>';
        return;
    }
    
    container.innerHTML = messages.map(message => `
        <div class="message-card">
            <div class="message-header">
                <div>
                    <div class="message-sender">${message.name}</div>
                    <div class="message-email">${message.email}</div>
                </div>
                <div class="message-date">${formatDate(message.createdAt)}</div>
            </div>
            <div class="message-content">${message.content}</div>
            <div class="message-actions">
                <button class="btn btn-sm btn-primary" onclick="replyToMessage('${message.id}')">
                    <i class="fas fa-reply"></i> Reply
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteMessage('${message.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function replyToMessage(messageId) {
    // In a real application, this would open an email client or send an email
    // For this demo, we'll just remove the message after "replying"
    if (confirm('Reply sent! Remove this message from the list?')) {
        deleteMessage(messageId);
    }
}

function deleteMessage(messageId) {
    if (confirm('Are you sure you want to delete this message?')) {
        let messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages = messages.filter(m => m.id !== messageId);
        localStorage.setItem('messages', JSON.stringify(messages));
        showToast('Message deleted successfully!');
        loadMessagesData();
        updateBadges();
    }
}

// Users tab
function loadUsersData() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const adminUsers = users.filter(u => u.role === 'admin');
    const customerUsers = users.filter(u => u.role === 'user');
    
    displayUsers('adminUsers', adminUsers);
    displayUsers('customerUsers', customerUsers);
}

function displayUsers(containerId, users) {
    const container = document.getElementById(containerId);
    
    if (users.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-user"></i><h3>No users</h3></div>';
        return;
    }
    
    container.innerHTML = users.map(user => `
        <div class="user-item">
            <div class="user-info">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-details">
                    <h4>${user.name}</h4>
                    <p>${user.email}</p>
                    <p style="font-size: 0.8rem; color: #9ca3af;">Joined ${formatDate(user.createdAt)}</p>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span class="user-role role-${user.role}">${user.role}</span>
                ${user.role === 'user' ? `<button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')"><i class="fas fa-trash"></i></button>` : ''}
            </div>
        </div>
    `).join('');
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user account?')) {
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        users = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        showToast('User deleted successfully!');
        loadUsersData();
        loadOverviewData(); // Update stats
    }
}

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('adminToast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Event listeners for modal close
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});