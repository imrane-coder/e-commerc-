// Admin Users Management
class AdminUsers {
    constructor() {
        this.dataManager = window.adminData;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUsers();
        this.initEventListeners();
    }

    initEventListeners() {
        // Search and filters
        document.getElementById('user-search').addEventListener('input', () => this.filterUsers());
        document.getElementById('sort-filter').addEventListener('change', () => this.filterUsers());
    }

    loadUsers() {
        this.filterUsers();
    }

    filterUsers() {
        const users = this.dataManager.getUsers();
        const orders = this.dataManager.getOrders();
        const searchTerm = document.getElementById('user-search').value;
        const sortBy = document.getElementById('sort-filter').value;

        let filteredUsers = users;

        // Apply search filter
        if (searchTerm) {
            filteredUsers = this.dataManager.searchItems(
                filteredUsers,
                searchTerm,
                ['name', 'email']
            );
        }

        // Add order statistics to users
        filteredUsers = filteredUsers.map(user => {
            const userOrders = orders.filter(order => order.userId === user.id);
            const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
            
            return {
                ...user,
                orderCount: userOrders.length,
                totalSpent: totalSpent
            };
        });

        // Apply sorting
        switch (sortBy) {
            case 'name':
                filteredUsers.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'email':
                filteredUsers.sort((a, b) => a.email.localeCompare(b.email));
                break;
            case 'orders':
                filteredUsers.sort((a, b) => b.orderCount - a.orderCount);
                break;
            case 'date':
                filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        this.displayUsers(filteredUsers);
    }

    displayUsers(users) {
        const container = document.getElementById('users-table');
        
        if (users.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i data-lucide="users"></i>
                        <h3>No users found</h3>
                        <p>Try adjusting your search</p>
                    </td>
                </tr>
            `;
        } else {
            container.innerHTML = users.map(user => `
                <tr>
                    <td>
                        <div class="user-info">
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
                    <td>
                        <span class="badge">${user.orderCount} orders</span>
                    </td>
                    <td>
                        <strong>${this.dataManager.formatCurrency(user.totalSpent)}</strong>
                    </td>
                    <td>${this.dataManager.formatDate(user.createdAt)}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn view" onclick="adminUsers.viewUser('${user.id}')" title="View User Details">
                                <i data-lucide="eye"></i>
                            </button>
                            <button class="action-btn delete" onclick="adminUsers.deleteUser('${user.id}')" title="Delete User">
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

    viewUser(userId) {
        const users = this.dataManager.getUsers();
        const orders = this.dataManager.getOrders();
        const user = users.find(u => u.id === userId);
        
        if (!user) return;

        const userOrders = orders.filter(order => order.userId === userId);
        const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);

        this.currentUser = user;
        
        document.getElementById('user-modal-title').textContent = `User Details - ${user.name}`;
        document.getElementById('user-details').innerHTML = `
            <div class="user-details-grid">
                <div class="user-section">
                    <h3>User Information</h3>
                    <div class="order-info">
                        <div class="order-info-item">
                            <span>Name:</span>
                            <strong>${user.name}</strong>
                        </div>
                        <div class="order-info-item">
                            <span>Email:</span>
                            <strong>${user.email}</strong>
                        </div>
                        <div class="order-info-item">
                            <span>User ID:</span>
                            <strong>${user.id}</strong>
                        </div>
                        <div class="order-info-item">
                            <span>Join Date:</span>
                            <strong>${this.dataManager.formatDate(user.createdAt)}</strong>
                        </div>
                    </div>
                </div>
                
                <div class="user-section">
                    <h3>Order Statistics</h3>
                    <div class="order-info">
                        <div class="order-info-item">
                            <span>Total Orders:</span>
                            <strong>${userOrders.length}</strong>
                        </div>
                        <div class="order-info-item">
                            <span>Total Spent:</span>
                            <strong>${this.dataManager.formatCurrency(totalSpent)}</strong>
                        </div>
                        <div class="order-info-item">
                            <span>Average Order:</span>
                            <strong>${userOrders.length > 0 ? this.dataManager.formatCurrency(totalSpent / userOrders.length) : '$0.00'}</strong>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="user-section">
                <h3>Order History</h3>
                ${userOrders.length === 0 ? `
                    <div class="empty-state">
                        <i data-lucide="shopping-cart"></i>
                        <p>No orders placed yet</p>
                    </div>
                ` : `
                    <div class="user-orders">
                        ${userOrders.map(order => `
                            <div class="user-order">
                                <div class="user-order-info">
                                    <h4>${order.id}</h4>
                                    <p>${this.dataManager.formatDate(order.createdAt)} • ${order.items.length} items • <span class="badge ${order.status}">${order.status}</span></p>
                                </div>
                                <div class="user-order-total">
                                    ${this.dataManager.formatCurrency(order.total)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;
        
        document.getElementById('user-modal').classList.add('active');
        
        // Recreate icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user? This will also delete all their orders. This action cannot be undone.')) {
            const users = this.dataManager.getUsers();
            const orders = this.dataManager.getOrders();
            
            // Remove user
            const filteredUsers = users.filter(u => u.id !== userId);
            
            // Remove user's orders
            const filteredOrders = orders.filter(o => o.userId !== userId);
            
            this.dataManager.setUsers(filteredUsers);
            this.dataManager.setOrders(filteredOrders);
            
            this.loadUsers();
            this.showNotification('User and their orders deleted successfully!', 'success');
        }
    }

    closeUserModal() {
        document.getElementById('user-modal').classList.remove('active');
        this.currentUser = null;
    }

    exportUsers() {
        const users = this.dataManager.getUsers();
        const orders = this.dataManager.getOrders();
        
        if (users.length === 0) {
            alert('No users to export');
            return;
        }

        // Add order statistics to export data
        const exportData = users.map(user => {
            const userOrders = orders.filter(order => order.userId === user.id);
            const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
            
            return {
                'User ID': user.id,
                'Name': user.name,
                'Email': user.email,
                'Join Date': user.createdAt,
                'Total Orders': userOrders.length,
                'Total Spent': totalSpent,
                'Average Order Value': userOrders.length > 0 ? (totalSpent / userOrders.length).toFixed(2) : '0.00'
            };
        });

        this.dataManager.exportToCSV(exportData, `users_${new Date().toISOString().split('T')[0]}.csv`);
        this.showNotification('Users exported successfully!', 'success');
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
function closeUserModal() {
    window.adminUsers.closeUserModal();
}

function exportUsers() {
    window.adminUsers.exportUsers();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminUsers = new AdminUsers();
});