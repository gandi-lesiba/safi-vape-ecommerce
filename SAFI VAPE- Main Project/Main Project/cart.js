// cart.js - Reusable Cart Functionality for Saffi Vaping Website

(function () {
    const cartToggle = document.getElementById('cart-toggle');
    const cartClose = document.getElementById('cart-close');
    const cartPanel = document.getElementById('cart-panel');
    const cartCount = document.getElementById('cart-count');
    const mobileCartCount = document.getElementById('mobile-cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    if (cartToggle && cartPanel && cartClose) {
        // Hide cart panel by default
        cartPanel.classList.remove('open');

        // Toggle cart panel on cart icon click
        cartToggle.addEventListener('click', () => {
            if (cartPanel.classList.contains('open')) {
                cartPanel.classList.remove('open');
                document.body.style.overflow = '';
            } else {
                cartPanel.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });

        // Hide cart panel on close button click
        cartClose.addEventListener('click', () => {
            cartPanel.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));

            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            saveCart();
            updateCart();
            if (cartPanel) {
                cartPanel.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function updateCart() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

        if (totalItems > 0) {
            if (cartCount) {
                cartCount.textContent = totalItems;
                cartCount.classList.remove('hidden');
            }
            if (mobileCartCount) mobileCartCount.textContent = totalItems;
        } else {
            if (cartCount) cartCount.classList.add('hidden');
            if (mobileCartCount) mobileCartCount.textContent = '0';
        }

        if (cartItems && cart.length > 0) {
            let itemsHTML = '';
            let subtotal = 0;

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                itemsHTML += `
                    <div class="flex justify-between items-center border-b border-secondary/20 pb-4">
                        <div>
                            <h4 class="font-bold">${item.name}</h4>
                            <p class="text-sm text-gray-400">$${item.price.toFixed(2)} × ${item.quantity}</p>
                        </div>
                        <div class="flex items-center">
                            <span class="font-bold">$${itemTotal.toFixed(2)}</span>
                            <button class="remove-item ml-4 text-gray-400 hover:text-secondary" data-id="${item.id}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                `;
            });

            cartItems.innerHTML = itemsHTML;
            if (cartSubtotal) cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;

            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', () => {
                    const id = button.getAttribute('data-id');
                    cart = cart.filter(item => item.id !== id);
                    saveCart();
                    updateCart();
                });
            });
        } else if (cartItems) {
            cartItems.innerHTML = '<p class="text-gray-400">Your cart is empty</p>';
            if (cartSubtotal) cartSubtotal.textContent = '$0.00';
        }
    }

    // On page load, update cart UI from localStorage
    updateCart();
    window.updateCart = updateCart;
})();
