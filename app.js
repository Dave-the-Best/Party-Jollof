document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({behavior: 'smooth'});
        }
    });
});

const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.trasition = 'transform 0.3s ease';
    });
    buttons.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Cart Management
let cart = {};
let cartTotal = 0;
let cartItemCount = 0;
let selectedPortion = 'small';
let selectedPortionPrice = 12.99;

// Carousel Management
let currentSlide = 0;
const carouselTrack = document.getElementById('carouselTrack');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    initializeSmoothScrolling();
    initializeButtonEffects();
    updateCartDisplay();
});

// ==================== CART FUNCTIONS ====================

function increaseItem(event, itemId, price) {
    event.stopPropagation();
    
    if (!cart[itemId]) {
        cart[itemId] = { 
            quantity: 0, 
            price: price,
            name: formatItemName(itemId)
        };
    }
    
    cart[itemId].quantity++;
    cartTotal += price;
    cartItemCount++;
    
    updateItemDisplay(itemId);
    updateCartDisplay();
}

function decreaseItem(event, itemId) {
    event.stopPropagation();
    
    if (cart[itemId] && cart[itemId].quantity > 0) {
        cart[itemId].quantity--;
        cartTotal -= cart[itemId].price;
        cartItemCount--;
        
        if (cart[itemId].quantity === 0) {
            delete cart[itemId];
        }
        
        updateItemDisplay(itemId);
        updateCartDisplay();
    }
}

function updateItemDisplay(itemId) {
    const qtyElement = document.getElementById(`${itemId}-qty`);
    if (!qtyElement) return;
    
    const quantity = cart[itemId] ? cart[itemId].quantity : 0;
    qtyElement.textContent = quantity;
    
    if (quantity > 0) {
        qtyElement.classList.add('active');
    } else {
        qtyElement.classList.remove('active');
    }
}

function updateCartDisplay() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartItemCount;
    }
}

function formatItemName(itemId) {
    return itemId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function viewCart() {
    if (cartItemCount === 0) {
        alert('Your cart is empty. Add some delicious Party Jollof items!');
        return;
    }
    
    let cartMessage = '🛒 YOUR CART\n';
    cartMessage += '═'.repeat(40) + '\n\n';
    
    // Add portion size
    cartMessage += `Portion Size: ${selectedPortion.charAt(0).toUpperCase() + selectedPortion.slice(1)}\n`;
    cartMessage += `Base Price: $${selectedPortionPrice.toFixed(2)}\n\n`;
    
    cartMessage += 'Items:\n';
    cartMessage += '─'.repeat(40) + '\n';
    
    for (let itemId in cart) {
        const item = cart[itemId];
        const itemTotal = (item.quantity * item.price).toFixed(2);
        cartMessage += `${item.name}\n`;
        cartMessage += `  ${item.quantity} x $${item.price.toFixed(2)} = $${itemTotal}\n\n`;
    }
    
    const grandTotal = (cartTotal + selectedPortionPrice).toFixed(2);
    cartMessage += '─'.repeat(40) + '\n';
    cartMessage += `Subtotal: $${cartTotal.toFixed(2)}\n`;
    cartMessage += `Portion: $${selectedPortionPrice.toFixed(2)}\n`;
    cartMessage += `TOTAL: $${grandTotal}\n\n`;
    cartMessage += '═'.repeat(40) + '\n';
    cartMessage += 'Thank you for ordering with Party Jollof! 🍽️';
    
    alert(cartMessage);
}

function clearCart() {
    cart = {};
    cartTotal = 0;
    cartItemCount = 0;
    updateCartDisplay();
    
    // Reset all quantity displays
    document.querySelectorAll('.item-quantity').forEach(el => {
        el.textContent = '0';
        el.classList.remove('active');
    });
}

// ==================== PORTION SELECTION ====================

function selectPortion(element, size) {
    selectedPortion = size;
    
    // Update active state
    document.querySelectorAll('.portion-option').forEach(opt => {
        opt.classList.remove('active');
    });
    element.classList.add('active');
    
    // Update selected portion price
    const priceText = element.querySelector('.price').textContent;
    selectedPortionPrice = parseFloat(priceText.replace('$', ''));
    
    console.log(`Selected portion: ${size} - $${selectedPortionPrice}`);
}

// ==================== CAROUSEL FUNCTIONS ====================

function initializeCarousel() {
    if (!carouselTrack) return;
    
    const cards = carouselTrack.querySelectorAll('.side-card');
    if (cards.length === 0) return;
    
    // Auto-scroll carousel every 3 seconds
    setInterval(() => {
        slideCarousel(1);
    }, 3000);
}

function slideCarousel(direction) {
    if (!carouselTrack) return;
    
    const cards = carouselTrack.querySelectorAll('.side-card');
    const cardWidth = 350 + 24; // card width + gap
    const maxSlide = Math.max(0, cards.length - 3);
    
    currentSlide += direction;
    
    // Loop back to start or end
    if (currentSlide < 0) {
        currentSlide = maxSlide;
    } else if (currentSlide > maxSlide) {
        currentSlide = 0;
    }
    
    carouselTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
}

// ==================== NAVIGATION & SMOOTH SCROLLING ====================

function initializeSmoothScrolling() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || targetId === '#home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

// ==================== BUTTON EFFECTS ====================

function initializeButtonEffects() {
    // Add hover effects to all buttons
    const buttons = document.querySelectorAll('button, .btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('cart-btn')) {
                this.style.transform = 'translateY(-2px)';
                this.style.transition = 'transform 0.3s ease';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('cart-btn')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
}

// ==================== FORM HANDLING ====================

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        if (name && email && subject && message) {
            alert(`Thank you ${name}! 🎉\n\nYour message has been received.\nWe'll get back to you at ${email} soon.\n\nSubject: ${subject}`);
            this.reset();
        }
    });
}

// ==================== SCROLL ANIMATIONS ====================

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.course-card, .contact-card, .side-card, .testimonial-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations after page load
window.addEventListener('load', initializeScrollAnimations);

// ==================== UTILITY FUNCTIONS ====================

// Format currency
function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#4CAF50' : '#ff5722'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== KEYBOARD SHORTCUTS ====================

document.addEventListener('keydown', function(e) {
    // Press 'C' to view cart
    if (e.key === 'c' || e.key === 'C') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            viewCart();
        }
    }
    
    // Press 'Escape' to scroll to top
    if (e.key === 'Escape') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ==================== LOCAL STORAGE (Optional) ====================

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('partyJollofCart', JSON.stringify({
        cart: cart,
        cartTotal: cartTotal,
        cartItemCount: cartItemCount,
        selectedPortion: selectedPortion,
        selectedPortionPrice: selectedPortionPrice
    }));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedData = localStorage.getItem('partyJollofCart');
    if (savedData) {
        const data = JSON.parse(savedData);
        cart = data.cart || {};
        cartTotal = data.cartTotal || 0;
        cartItemCount = data.cartItemCount || 0;
        selectedPortion = data.selectedPortion || 'small';
        selectedPortionPrice = data.selectedPortionPrice || 12.99;
        
        // Update all displays
        updateCartDisplay();
        for (let itemId in cart) {
            updateItemDisplay(itemId);
        }
    }
}

// Auto-save cart when it changes
function autoSaveCart() {
    saveCartToStorage();
}

// Load cart on page load
window.addEventListener('load', loadCartFromStorage);

// Save cart before leaving
window.addEventListener('beforeunload', saveCartToStorage);

// ==================== CONSOLE INFO ====================

console.log('%c🍽️ Party Jollof Website', 'font-size: 20px; font-weight: bold; color: #ff5722;');
console.log('%cWebsite loaded successfully!', 'font-size: 14px; color: #4CAF50;');
console.log('%cKeyboard Shortcuts:', 'font-size: 12px; font-weight: bold;');
console.log('%c- Press "C" to view cart', 'font-size: 12px;');
console.log('%c- Press "Escape" to scroll to top', 'font-size: 12px;');

// Export functions for global use
window.increaseItem = increaseItem;
window.decreaseItem = decreaseItem;
window.viewCart = viewCart;
window.selectPortion = selectPortion;
window.slideCarousel = slideCarousel;
window.clearCart = clearCart;

// Rating stars functionality
let selectedRating = 0;
const stars = document.querySelectorAll('.star');
const ratingValue = document.getElementById('rating-value');

stars.forEach(star => {
    star.addEventListener('click', function() {
        selectedRating = parseInt(this.getAttribute('data-rating'));
        ratingValue.value = selectedRating;
        updateStars();
    });

    star.addEventListener('mouseenter', function() {
        const hoverRating = parseInt(this.getAttribute('data-rating'));
        highlightStars(hoverRating);
    });
});

document.getElementById('ratingStars').addEventListener('mouseleave', function() {
    updateStars();
});

function highlightStars(rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function updateStars() {
    highlightStars(selectedRating);
}

// Message Form Submission
document.getElementById('messageForm').addEventListener('submit', function(e) {
    e.preventDefault();
            
    const name = document.getElementById('message-name').value;
    const email = document.getElementById('message-email').value;
    const subject = document.getElementById('message-subject').value;
    const message = document.getElementById('message-text').value;

    // Show success message
    const successMsg = document.getElementById('message-success');
    successMsg.classList.add('show');

    // Reset form
    this.reset();

    // Hide success message after 5 seconds
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 5000);

    console.log('Message submitted:', { name, email, subject, message });
});

// Review Form Submission
document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (selectedRating === 0) {
        alert('Please select a rating before submitting your review.');
        return;
    }
            
    const name = document.getElementById('review-name').value;
    const email = document.getElementById('review-email').value;
    const category = document.getElementById('review-category').value;
    const review = document.getElementById('review-text').value;

    // Show success message
    const successMsg = document.getElementById('review-success');
    successMsg.classList.add('show');

    // Reset form
    this.reset();
    selectedRating = 0;
    updateStars();

    // Hide success message after 5 seconds
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 5000);

    console.log('Review submitted:', { name, email, rating: selectedRating, category, review });
});

// Social media click handlers
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = this.title;
        alert(`${platform} link coming soon! Follow us for updates.`);
    });
});

// Button hover effects
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.transition = 'transform 0.3s ease';
    });
    button.addEventListener('mouseleave', function() {
        if (!this.classList.contains('submit-btn')) {
            this.style.transform = 'translateY(0)';
        }
    });
});