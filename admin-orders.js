// Admin Orders Management
class AdminOrders {
    constructor() {
        this.dataManager = window.adminData;
        this.currentOrder = null;
        this.init();
    }

    init() {
        this.loadOrders();
        this.initEventListeners();
    }

    initEventListeners() {
        // Search and filters
        document.getElementById('order-search').addEventListener('input', () => this.filterOrders());
        document.getElementById('status-filter').addEventListener('change', () => this.filterOrders());
        document.getElementById('payment-filter').addEventListener('change', () => this.filterOrders());
    }

    loadOrders() {
        this.filterOrders();
    }

    filterOrders() {
        const orders = this.dataManager.getOrders();
        const searchTerm = document.getElementById('order-search').value;
        const statusFilter = document.getElementById('status-filter').value;
        const paymentFilter = document.getElementById('payment-filter').value;

        let filteredOrders = orders;

        // Apply search filter
        if (searchTerm) {
            filteredOrders = this.dataManager.searchItems(
                filteredOrders,
                searchTerm,
                ['id', 'customerInfo.name', 'customerInfo.email']
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
        }

        // Apply payment filter
        if (paymentFilter !== 'all') {
            filteredOrders = filteredOrders.filter(order => order.paymentMethod === paymentFilter);
        }

        // Sort by creation date (newest first)
        filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        this.displayOrders(filteredOrders);
    }

    displayOrders(orders) {
        const container = document.getElementById('orders-table');
        
        if (orders.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="8" class="empty-state">
                        <i data-lucide="shopping-cart"></i>
                        <h3>No orders found</h3>
                        <p>Try adjusting your search or filters</p>
                    </td>
                </tr>
            `;
        } else {
            container.innerHTML = orders.map(order => `
                <tr>
                    <td><strong>${order.id}</strong></td>
                    <td>
                        <div class="customer-info">
                            <h3>${order.customerInfo.name}</h3>
                            <p>${order.customerInfo.email}</p>
                        </div>
                    </td>
                    <td>
                        <div class="order-products">
                            ${order.items.slice(0, 2).map(item => `
                                <span class="product-name">${item.name} (${item.quantity})</span>
                            `).join('')}
                            ${order.items.length > 2 ? `<span class="more-items">+${order.items.length - 2} more</span>` : ''}
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
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn view" onclick="adminOrders.viewOrder('${order.id}')" title="View Details">
                                <i data-lucide="eye"></i>
                            </button>
                            ${order.status === 'pending' ? `
                                <button class="action-btn process" onclick="adminOrders.updateOrderStatus('${order.id}', 'processed')" title="Mark as Processed">
                                    <i data-lucide="check"></i>
                                </button>
                            ` : ''}
                            ${order.status === 'processed' ? `
                                <button class="action-btn process" onclick="adminOrders.updateOrderStatus('${order.id}', 'shipped')" title="Mark as Shipped">
                                    <i data-lucide="truck"></i>
                                </button>
                            ` : ''}
                            <button class="action-btn delete" onclick="adminOrders.deleteOrder('${order.id}')" title="Delete Order">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }

        // Recreate icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    viewOrder(orderId) {
        const orders = this.dataManager.getOrders();
        const order = orders.find(o => o.id === orderId);
        
        if (!order) return;

        this.currentOrder = order;
        
        document.getElementById('order-modal-title').textContent = `Order Details - ${order.id}`;
        document.getElementById('order-details').innerHTML = `
            <div class="order-details-grid">
                <div class="order-section">
                    <h3>Customer Information</h3>
                    <div class="order-info">
                        <div class="order-info-item">
                            <span>Name:</span>
                            <strong>${order.customerInfo.name}</strong>
                        </div>
                        <div class="order-info-item">
                            <span>Email:</span>
                            <strong>${order.customerInfo.email}</strong>
                        </div>
                        <div class="order-info-item">
                            <span>Phone:</span>
                            <strong>${order.customerInfo.phone}</strong>
                        </div>
                        <div class="order-info-item">
                            <span>Address:</span>
                            <strong>${order.customerInfo.address}</strong>
                        </div>
                        <div class="order-info-item">
                            <span>Postal Code:</span>
                            <strong>${order.customerInfo.postalCode}</strong>
                        </div>
                    </div>
                </div>
                
                <div class="order-section">
                    <h3>Order Information</h3>
                    <div class="order-info">
                        <div class="order-info-item">
                            <span>Order ID:</span>
                            <strong>${order.id}</strong>
                        </div>
                        <div class="order-info-item">
                            <span>Date:</span>
                            <strong>${this.dataManager.formatDate(order.createdAt)}</strong>
                        </div>
                        <div class="order-info-item">
                            <span>Status:</span>
                            <span class="badge ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                        </div>
                        <div class="order-info-item">
                            <span>Payment:</span>
                            <span class="badge ${order.paymentMethod}">${order.paymentMethod === 'card' ? 'Card' : 'Cash'}</span>
                        </div>
                        <div class="order-info-item">
                            <span>Total:</span>
                            <strong>${this.dataManager.formatCurrency(order.total)}</strong>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="order-section">
                <h3>Ordered Items</h3>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'">
                            <div class="order-item-info">
                                <h4>${item.name}</h4>
                                <p>Quantity: ${item.quantity} × ${this.dataManager.formatCurrency(item.price)}</p>
                            </div>
                            <div class="order-item-price">
                                ${this.dataManager.formatCurrency(item.price * item.quantity)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.getElementById('order-modal').classList.add('active');
    }

    updateOrderStatus(orderId, newStatus) {
        const orders = this.dataManager.getOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = newStatus;
            this.dataManager.setOrders(orders);
            this.loadOrders();
            
            this.showNotification(`Order ${orderId} marked as ${newStatus}`, 'success');
        }
    }

    deleteOrder(orderId) {
        if (confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            const orders = this.dataManager.getOrders();
            const filteredOrders = orders.filter(o => o.id !== orderId);
            
            this.dataManager.setOrders(filteredOrders);
            this.loadOrders();
            this.showNotification('Order deleted successfully!', 'success');
        }
    }

    closeOrderModal() {
        document.getElementById('order-modal').classList.remove('active');
        this.currentOrder = null;
    }

    exportOrders() {
        const orders = this.dataManager.getOrders();
        
        if (orders.length === 0) {
            alert('No orders to export');
            return;
        }

        // Flatten order data for CSV export
        const exportData = orders.map(order => ({
            'Order ID': order.id,
            'Customer Name': order.customerInfo.name,
            'Customer Email': order.customerInfo.email,
            'Customer Phone': order.customerInfo.phone,
            'Address': order.customerInfo.address,
            'Postal Code': order.customerInfo.postalCode,
            'Total Amount': order.total,
            'Payment Method': order.paymentMethod,
            'Status': order.status,
            'Order Date': order.createdAt,
            'Items': order.items.map(item => `${item.name} (${item.quantity})`).join('; ')
        }));

        this.dataManager.exportToCSV(exportData, `orders_${new Date().toISOString().split('T')[0]}.csv`);
        this.showNotification('Orders exported successfully!', 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Recreate icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Global functions for onclick handlers
function closeOrderModal() {
    window.adminOrders.closeOrderModal();
}

function exportOrders() {
    window.adminOrders.exportOrders();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminOrders = new AdminOrders();
});