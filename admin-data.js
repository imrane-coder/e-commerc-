// Admin Data Management System
class AdminDataManager {
    constructor() {
        this.initializeData();
    }

    // Initialize sample data if not exists
    initializeData() {
        // Initialize products
        if (!localStorage.getItem('ecommerce_products')) {
            const sampleProducts = [
                {
                    id: '1',
                    name: 'Premium Wireless Headphones',
                    price: 299.99,
                    category: 'electronics',
                    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
                    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
                    inStock: true,
                    featured: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '2',
                    name: 'Smart Watch Pro',
                    price: 399.99,
                    category: 'electronics',
                    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
                    description: 'Advanced smartwatch with health monitoring, GPS, and long battery life.',
                    inStock: true,
                    featured: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '3',
                    name: 'Designer Leather Jacket',
                    price: 249.99,
                    category: 'clothing',
                    image: 'https://images.pexels.com/photos/1055691/pexels-photo-1055691.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
                    description: 'Premium leather jacket with modern design and superior craftsmanship.',
                    inStock: true,
                    featured: true,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '4',
                    name: 'Minimalist Desk Lamp',
                    price: 89.99,
                    category: 'home',
                    image: 'https://images.pexels.com/photos/1484759/pexels-photo-1484759.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
                    description: 'Modern LED desk lamp with adjustable brightness and sleek design.',
                    inStock: false,
                    featured: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '5',
                    name: 'Wireless Bluetooth Speaker',
                    price: 129.99,
                    category: 'electronics',
                    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
                    description: 'Portable speaker with premium sound quality and long battery life.',
                    inStock: true,
                    featured: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: '6',
                    name: 'Organic Cotton T-Shirt',
                    price: 29.99,
                    category: 'clothing',
                    image: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1',
                    description: 'Sustainable and comfortable cotton t-shirt made from organic materials.',
                    inStock: true,
                    featured: false,
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('ecommerce_products', JSON.stringify(sampleProducts));
        }

        // Initialize sample orders
        if (!localStorage.getItem('ecommerce_orders')) {
            const sampleOrders = [
                {
                    id: 'ORD-001',
                    userId: 'user1',
                    customerInfo: {
                        name: 'John Doe',
                        email: 'john@example.com',
                        phone: '+1-555-0123',
                        address: '123 Main St, City, State 12345',
                        postalCode: '12345'
                    },
                    items: [
                        {
                            id: '1',
                            name: 'Premium Wireless Headphones',
                            price: 299.99,
                            quantity: 1,
                            image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1'
                        }
                    ],
                    total: 299.99,
                    paymentMethod: 'card',
                    status: 'pending',
                    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
                },
                {
                    id: 'ORD-002',
                    userId: 'user2',
                    customerInfo: {
                        name: 'Jane Smith',
                        email: 'jane@example.com',
                        phone: '+1-555-0124',
                        address: '456 Oak Ave, City, State 12346',
                        postalCode: '12346'
                    },
                    items: [
                        {
                            id: '2',
                            name: 'Smart Watch Pro',
                            price: 399.99,
                            quantity: 1,
                            image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1'
                        },
                        {
                            id: '5',
                            name: 'Wireless Bluetooth Speaker',
                            price: 129.99,
                            quantity: 1,
                            image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&dpr=1'
                        }
                    ],
                    total: 529.98,
                    paymentMethod: 'cash',
                    status: 'processed',
                    createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
                }
            ];
            localStorage.setItem('ecommerce_orders', JSON.stringify(sampleOrders));
        }

        // Initialize sample messages
        if (!localStorage.getItem('ecommerce_messages')) {
            const sampleMessages = [
                {
                    id: 'MSG-001',
                    name: 'Alice Johnson',
                    email: 'alice@example.com',
                    message: 'Hi, I have a question about the return policy for electronics. Can you please provide more details?',
                    status: 'unread',
                    createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
                },
                {
                    id: 'MSG-002',
                    name: 'Bob Wilson',
                    email: 'bob@example.com',
                    message: 'I received my order but one item was damaged. How can I get a replacement?',
                    status: 'unread',
                    createdAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
                },
                {
                    id: 'MSG-003',
                    name: 'Carol Brown',
                    email: 'carol@example.com',
                    message: 'Great service! My order arrived quickly and everything was perfect. Thank you!',
                    status: 'replied',
                    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
                }
            ];
            localStorage.setItem('ecommerce_messages', JSON.stringify(sampleMessages));
        }

        // Initialize sample users
        if (!localStorage.getItem('ecommerce_users')) {
            const sampleUsers = [
                {
                    id: 'user1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123',
                    createdAt: new Date(Date.now() - 2592000000).toISOString() // 30 days ago
                },
                {
                    id: 'user2',
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    password: 'password123',
                    createdAt: new Date(Date.now() - 1296000000).toISOString() // 15 days ago
                },
                {
                    id: 'user3',
                    name: 'Alice Johnson',
                    email: 'alice@example.com',
                    password: 'password123',
                    createdAt: new Date(Date.now() - 604800000).toISOString() // 7 days ago
                }
            ];
            localStorage.setItem('ecommerce_users', JSON.stringify(sampleUsers));
        }
    }

    // Data access methods
    getProducts() {
        return JSON.parse(localStorage.getItem('ecommerce_products') || '[]');
    }

    setProducts(products) {
        localStorage.setItem('ecommerce_products', JSON.stringify(products));
    }

    getOrders() {
        return JSON.parse(localStorage.getItem('ecommerce_orders') || '[]');
    }

    setOrders(orders) {
        localStorage.setItem('ecommerce_orders', JSON.stringify(orders));
    }

    getMessages() {
        return JSON.parse(localStorage.getItem('ecommerce_messages') || '[]');
    }

    setMessages(messages) {
        localStorage.setItem('ecommerce_messages', JSON.stringify(messages));
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('ecommerce_users') || '[]');
    }

    setUsers(users) {
        localStorage.setItem('ecommerce_users', JSON.stringify(users));
    }

    // Utility methods
    generateId(prefix = '') {
        return prefix + Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    // Export data to CSV
    exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => 
                headers.map(header => {
                    const value = row[header];
                    if (typeof value === 'object' && value !== null) {
                        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                    }
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Search and filter utilities
    searchItems(items, searchTerm, fields) {
        if (!searchTerm) return items;
        
        const term = searchTerm.toLowerCase();
        return items.filter(item => 
            fields.some(field => {
                const value = this.getNestedValue(item, field);
                return String(value).toLowerCase().includes(term);
            })
        );
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    sortItems(items, sortBy, direction = 'asc') {
        return [...items].sort((a, b) => {
            const aVal = this.getNestedValue(a, sortBy);
            const bVal = this.getNestedValue(b, sortBy);
            
            if (direction === 'desc') {
                return bVal > aVal ? 1 : -1;
            }
            return aVal > bVal ? 1 : -1;
        });
    }
}

// Global instance
window.adminData = new AdminDataManager();