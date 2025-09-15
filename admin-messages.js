// Admin Messages Management
class AdminMessages {
    constructor() {
        this.dataManager = window.adminData;
        this.currentMessage = null;
        this.init();
    }

    init() {
        this.loadMessages();
        this.initEventListeners();
        this.updateUnreadCount();
    }

    initEventListeners() {
        // Search and filters
        document.getElementById('message-search').addEventListener('input', () => this.filterMessages());
        document.getElementById('status-filter').addEventListener('change', () => this.filterMessages());

        // Reply form
        const replyForm = document.getElementById('reply-form');
        if (replyForm) {
            replyForm.addEventListener('submit', (e) => this.handleReplySubmit(e));
        }
    }

    loadMessages() {
        this.filterMessages();
        this.updateUnreadCount();
    }

    filterMessages() {
        const messages = this.dataManager.getMessages();
        const searchTerm = document.getElementById('message-search').value;
        const statusFilter = document.getElementById('status-filter').value;

        let filteredMessages = messages;

        // Apply search filter
        if (searchTerm) {
            filteredMessages = this.dataManager.searchItems(
                filteredMessages,
                searchTerm,
                ['name', 'email', 'message']
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filteredMessages = filteredMessages.filter(message => message.status === statusFilter);
        }

        // Sort by creation date (newest first)
        filteredMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        this.displayMessages(filteredMessages);
    }

    displayMessages(messages) {
        const container = document.getElementById('messages-container');
        
        if (messages.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="mail"></i>
                    <h3>No messages found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
        } else {
            container.innerHTML = messages.map(message => `
                <div class="message-card ${message.status === 'unread' ? 'unread' : ''}">
                    <div class="message-header">
                        <div class="message-info">
                            <h3>${message.name}</h3>
                            <div class="message-meta">
                                <i data-lucide="mail"></i>
                                <span>${message.email}</span>
                                <span>•</span>
                                <span>${this.dataManager.formatDate(message.createdAt)}</span>
                                ${message.status === 'replied' ? '<span class="badge">Replied</span>' : '<span class="badge pending">New</span>'}
                            </div>
                        </div>
                        <div class="message-actions">
                            ${message.status === 'unread' ? `
                                <button class="action-btn reply" onclick="adminMessages.replyToMessage('${message.id}')" title="Reply to Message">
                                    <i data-lucide="reply"></i>
                                </button>
                                <button class="action-btn edit" onclick="adminMessages.markAsRead('${message.id}')" title="Mark as Read">
                                    <i data-lucide="check"></i>
                                </button>
                            ` : ''}
                            <button class="action-btn delete" onclick="adminMessages.deleteMessage('${message.id}')" title="Delete Message">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </div>
                    <div class="message-content">
                        <p>${message.message}</p>
                    </div>
                </div>
            `).join('');
        }

        // Recreate icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    replyToMessage(messageId) {
        const messages = this.dataManager.getMessages();
        const message = messages.find(m => m.id === messageId);
        
        if (!message) return;

        this.currentMessage = message;
        
        document.getElementById('original-message').innerHTML = `
            <div class="original-message">
                <h3>Original Message</h3>
                <div class="message-info">
                    <p><strong>From:</strong> ${message.name} (${message.email})</p>
                    <p><strong>Date:</strong> ${this.dataManager.formatDate(message.createdAt)}</p>
                </div>
                <div class="message-content">
                    <p><strong>Message:</strong></p>
                    <p>${message.message}</p>
                </div>
            </div>
        `;
        
        document.getElementById('reply-modal').classList.add('active');
    }

    handleReplySubmit(e) {
        e.preventDefault();
        
        const replyText = document.getElementById('reply-message').value;
        
        if (!this.currentMessage || !replyText.trim()) return;

        // Mark message as replied
        const messages = this.dataManager.getMessages();
        const messageIndex = messages.findIndex(m => m.id === this.currentMessage.id);
        
        if (messageIndex !== -1) {
            messages[messageIndex].status = 'replied';
            messages[messageIndex].reply = replyText;
            messages[messageIndex].repliedAt = new Date().toISOString();
            
            this.dataManager.setMessages(messages);
            this.closeReplyModal();
            this.loadMessages();
            
            this.showNotification('Reply sent successfully!', 'success');
        }
    }

    markAsRead(messageId) {
        const messages = this.dataManager.getMessages();
        const messageIndex = messages.findIndex(m => m.id === messageId);
        
        if (messageIndex !== -1) {
            messages[messageIndex].status = 'replied';
            this.dataManager.setMessages(messages);
            this.loadMessages();
            
            this.showNotification('Message marked as read', 'info');
        }
    }

    deleteMessage(messageId) {
        if (confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
            const messages = this.dataManager.getMessages();
            const filteredMessages = messages.filter(m => m.id !== messageId);
            
            this.dataManager.setMessages(filteredMessages);
            this.loadMessages();
            this.showNotification('Message deleted successfully!', 'success');
        }
    }

    closeReplyModal() {
        document.getElementById('reply-modal').classList.remove('active');
        document.getElementById('reply-form').reset();
        this.currentMessage = null;
    }

    updateUnreadCount() {
        const messages = this.dataManager.getMessages();
        const unreadCount = messages.filter(m => m.status === 'unread').length;
        
        const unreadElement = document.getElementById('unread-count');
        if (unreadElement) {
            unreadElement.textContent = unreadCount;
        }
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
function closeReplyModal() {
    window.adminMessages.closeReplyModal();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminMessages = new AdminMessages();
});