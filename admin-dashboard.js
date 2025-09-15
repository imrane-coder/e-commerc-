// Admin Dashboard Controller
class AdminDashboard {
    constructor() {
        this.dataManager = window.adminData;
        this.init();
    }

    init() {
        this.loadStats();
        this.loadRecentOrders();
        this.loadStockAlerts();
    }

    loadStats() {
        const products = this.dataManager.getProducts();
        const orders = this.dataManager.getOrders();
        const messages = this.dataManager.getMessages();
        const users = this.dataManager.getUsers();

        // Update stat cards
        document.getElementById('total-products').textContent = products.length;
        document.getElementById('total-orders').textContent = orders.length;
        document.getElementById('total-messages').textContent = 
            messages.filter(msg => msg.status === 'unread').length;
        document.getElementById('total-users').textContent = users.length;

        // Animate numbers
        this.animateNumbers();
    }

    loadRecentOrders() {
        const orders = this.dataManager.getOrders();
        const recentOrders = orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        const container = document.getElementById('recent-orders');
        
        if (recentOrders.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i data-lucide="inbox"></i>
                        <p>No orders yet</p>
                    </td>
                </tr>
            `;
        } else {
            container.innerHTML = recentOrders.map(order => `
                <tr>
                    <td><strong>${order.id}</strong></td>
                    <td>
                        <div class="customer-info">
                            <h3>${order.customerInfo.name}</h3>
                            <p>${order.customerInfo.email}</p>
                        </div>
                    </td>
                    <td><strong>${this.dataManager.formatCurrency(order.total)}</strong></td>
                    <td>
                        <span class="badge ${order.paymentMethod}">
                            ${order.paymentMethod === 'card' ? 'Card' : 'Cash'}
                        </span>
                    </td>
                    <td>
                        <span class="badge ${order.status}">
                            ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </td>
                    <td>${this.dataManager.formatDate(order.createdAt)}</td>
                </tr>
            `).join('');
        }

        // Recreate icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    loadStockAlerts() {
        const products = this.dataManager.getProducts();
        const outOfStockProducts = products.filter(product => !product.inStock);

        const container = document.getElementById('stock-alerts');
        
        if (outOfStockProducts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="check-circle"></i>
                    <h3>All products in stock!</h3>
                    <p>No stock alerts at this time</p>
                </div>
            `;
        } else {
            container.innerHTML = outOfStockProducts.map(product => `
                <div class="stock-alert">
                    <i data-lucide="alert-triangle"></i>
                    <div class="stock-alert-info">
                        <h4>${product.name}</h4>
                        <p>This product is currently out of stock</p>
                    </div>
                </div>
            `).join('');
        }

        // Recreate icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-info h3');
        
        statNumbers.forEach(element => {
            const finalValue = parseInt(element.textContent);
            let currentValue = 0;
            const increment = Math.ceil(finalValue / 20);
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    currentValue = finalValue;
                    clearInterval(timer);
                }
                element.textContent = currentValue;
            }, 50);
        });
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminDashboard();
});