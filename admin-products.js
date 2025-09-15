// Admin Products Management
class AdminProducts {
    constructor() {
        this.dataManager = window.adminData;
        this.currentEditingProduct = null;
        this.init();
    }

    init() {
        this.loadProducts();
        this.initEventListeners();
    }

    initEventListeners() {
        // Search and filters
        document.getElementById('product-search').addEventListener('input', () => this.filterProducts());
        document.getElementById('category-filter').addEventListener('change', () => this.filterProducts());
        document.getElementById('stock-filter').addEventListener('change', () => this.filterProducts());

        // Product form
        document.getElementById('product-form').addEventListener('submit', (e) => this.handleProductSubmit(e));
    }

    loadProducts() {
        this.filterProducts();
    }

    filterProducts() {
        const products = this.dataManager.getProducts();
        const searchTerm = document.getElementById('product-search').value;
        const categoryFilter = document.getElementById('category-filter').value;
        const stockFilter = document.getElementById('stock-filter').value;

        let filteredProducts = products;

        // Apply search filter
        if (searchTerm) {
            filteredProducts = this.dataManager.searchItems(
                filteredProducts, 
                searchTerm, 
                ['name', 'description', 'category']
            );
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === categoryFilter);
        }

        // Apply stock filter
        if (stockFilter !== 'all') {
            const inStock = stockFilter === 'in-stock';
            filteredProducts = filteredProducts.filter(product => product.inStock === inStock);
        }

        this.displayProducts(filteredProducts);
    }

    displayProducts(products) {
        const container = document.getElementById('products-table');
        
        if (products.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i data-lucide="package"></i>
                        <h3>No products found</h3>
                        <p>Try adjusting your search or filters</p>
                    </td>
                </tr>
            `;
        } else {
            container.innerHTML = products.map(product => `
                <tr>
                    <td>
                        <div class="product-info">
                            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'">
                            <div class="product-details">
                                <h3>${product.name}</h3>
                                <p>${product.description}</p>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="badge">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                    </td>
                    <td><strong>${this.dataManager.formatCurrency(product.price)}</strong></td>
                    <td>
                        <span class="badge ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                            ${product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </td>
                    <td>
                        <span class="badge ${product.featured ? 'featured' : ''}">
                            ${product.featured ? 'Featured' : 'Regular'}
                        </span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn edit" onclick="adminProducts.editProduct('${product.id}')" title="Edit Product">
                                <i data-lucide="edit-2"></i>
                            </button>
                            <button class="action-btn toggle" onclick="adminProducts.toggleStock('${product.id}')" title="Toggle Stock">
                                <i data-lucide="package"></i>
                            </button>
                            <button class="action-btn delete" onclick="adminProducts.deleteProduct('${product.id}')" title="Delete Product">
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

    showAddProductModal() {
        this.currentEditingProduct = null;
        document.getElementById('modal-title').textContent = 'Add New Product';
        document.getElementById('product-form').reset();
        document.getElementById('product-modal').classList.add('active');
    }

    editProduct(productId) {
        const products = this.dataManager.getProducts();
        const product = products.find(p => p.id === productId);
        
        if (!product) return;

        this.currentEditingProduct = product;
        document.getElementById('modal-title').textContent = 'Edit Product';
        
        // Fill form with product data
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-image').value = product.image;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-stock').checked = product.inStock;
        document.getElementById('product-featured').checked = product.featured || false;
        
        document.getElementById('product-modal').classList.add('active');
    }

    handleProductSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('product-name').value,
            price: parseFloat(document.getElementById('product-price').value),
            category: document.getElementById('product-category').value,
            image: document.getElementById('product-image').value,
            description: document.getElementById('product-description').value,
            inStock: document.getElementById('product-stock').checked,
            featured: document.getElementById('product-featured').checked
        };

        const products = this.dataManager.getProducts();

        if (this.currentEditingProduct) {
            // Update existing product
            const index = products.findIndex(p => p.id === this.currentEditingProduct.id);
            if (index !== -1) {
                products[index] = { ...this.currentEditingProduct, ...formData };
            }
        } else {
            // Add new product
            const newProduct = {
                id: this.dataManager.generateId('PROD-'),
                ...formData,
                createdAt: new Date().toISOString()
            };
            products.push(newProduct);
        }

        this.dataManager.setProducts(products);
        this.closeProductModal();
        this.loadProducts();
        
        // Show success message
        this.showNotification(
            this.currentEditingProduct ? 'Product updated successfully!' : 'Product added successfully!',
            'success'
        );
    }

    toggleStock(productId) {
        const products = this.dataManager.getProducts();
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex !== -1) {
            products[productIndex].inStock = !products[productIndex].inStock;
            this.dataManager.setProducts(products);
            this.loadProducts();
            
            const status = products[productIndex].inStock ? 'in stock' : 'out of stock';
            this.showNotification(`Product marked as ${status}`, 'info');
        }
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            const products = this.dataManager.getProducts();
            const filteredProducts = products.filter(p => p.id !== productId);
            
            this.dataManager.setProducts(filteredProducts);
            this.loadProducts();
            this.showNotification('Product deleted successfully!', 'success');
        }
    }

    closeProductModal() {
        document.getElementById('product-modal').classList.remove('active');
        this.currentEditingProduct = null;
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
function showAddProductModal() {
    window.adminProducts.showAddProductModal();
}

function closeProductModal() {
    window.adminProducts.closeProductModal();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminProducts = new AdminProducts();
});

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);