// script for the cart functionality
var cartItems = {};

// refresh cart
function refreshAndReopenCartModal() {
    var cartModal = document.getElementById('cartModal');

    // Refresh the cart contents
    refreshCartModal()

    // Close and then immediately reopen the modal
    cartModal.style.display = 'none';
    requestAnimationFrame(() => {
        cartModal.style.display = 'block';
    });
}


function refreshCartModal() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    cartItemsContainer.innerHTML = `
<div class="cart-item-header">
    <div class="cart-item-image">Product</div>
    <div class="cart-item-details">Details</div>
    <div class="cart-item-quantity">Quantity</div>
    <div class="cart-item-total">Price</div>
</div>
`; // Clear current contents

    let total = 0.0;
    let itemCount = 0;

    Object.keys(cartItems).forEach(itemId => {
        const item = cartItems[itemId];
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
    <div class="cart-item-image"><img src="${item.image}" alt="${item.name}"/></div>
    <div class="cart-item-details">
    <p>${item.name}</p>
    <p>Each: Rs.${item.price}</p>
    </div>
    <div class="quantity-selector">
            <button type="button" class="quantity-change decrease-quantity" data-item-id="${itemId}" aria-label="Decrease quantity">-</button>
            <input type="text" class="quantity-input" data-item-id="${itemId}" value="${item.quantity}" readonly>
            <button type="button" class="quantity-change increase-quantity" data-item-id="${itemId}" aria-label="Increase quantity">+</button>
        </div>
    <div class="cart-item-total">Rs.${parseInt(item.price) * item.quantity}</div>
`; // replace the total price

        cartItemsContainer.appendChild(itemElement);

        total += item.price * item.quantity;
        itemCount += item.quantity;
    });

    // Update total price and item count in the modal
    document.getElementById('cartTotalPrice').innerText = `${total}`;
    document.getElementById('itemCount').innerText = `${itemCount} Items`;

    // Handle the case when the cart is empty
    if (itemCount === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        checkoutButton.style.display = 'none';
    } else {
        checkoutButton.style.display = 'block'; // Show checkout button
    }
}


// Open the checkout modal
document.getElementById('checkoutButton').addEventListener('click', function () {
    // Start with an empty summary and total price
    let summaryContent = '';
    let totalPrice = 0;

    // Iterate over cartItems to build the summary and calculate the total price
    Object.keys(cartItems).forEach(itemId => {
        const item = cartItems[itemId];
        totalPrice += (item.price * item.quantity);
        summaryContent += `<p>${item.name} - Quantity: ${item.quantity} </p>`;
    });

    // Update the checkout summary and total price
    document.getElementById('checkoutSummary').innerHTML = summaryContent + `<p>Total is: Rs. ${totalPrice}`;
    // Display the checkout modal
    document.getElementById('checkoutModal').style.display = 'block';

    // Optionally, hide the cart modal if it's open
    document.getElementById('cartModal').style.display = 'none';
});


// Close checkout modal on click of close button
document.querySelectorAll('.close').forEach(closeButton => {
    closeButton.addEventListener('click', function () {
        document.getElementById('checkoutModal').style.display = 'none';
    });
});

// Handle confirm button click
document.getElementById('confirmCheckout').addEventListener('click', function () {
    // Hide the checkout modal
    document.getElementById('checkoutModal').style.display = 'none';

    // Display success message (You can implement this in various ways, here's a simple alert for demonstration)
    alert('Order successfully placed!');
    // Reset the cart if needed or redirect the user, handle as required
});


function toggleDescription(button, isBack = false) {
    var productCard = button.parentElement;

    // If the button pressed is the 'Back' button, it will be inside the description-text div,
    // so we need to set the productCard to the description-text's parent element.
    if (isBack) {
        productCard = productCard.parentElement;
    }

    var descriptionText = productCard.querySelector('.description-text');

    // Toggle based on whether 'isBack' is true
    if (!isBack) {
        // Show the description text
        descriptionText.style.display = 'block';
        // Blur the other elements
        Array.from(productCard.children).forEach(child => {
            if (child !== descriptionText) {
                child.style.filter = 'blur(3px)';
            }
        });
    } else {
        // Hide the description text
        descriptionText.style.display = 'none';
        // Remove the blur effect
        Array.from(productCard.children).forEach(child => child.style.filter = '');
    }


}


document.addEventListener('DOMContentLoaded', (event) => {
    // Capture the initial order of products
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const productContainer = document.querySelector('.product-container');
    const originalOrder = Array.from(productContainer.children)

    // Function to sort products A-Z
    function sortProductsAZ() {
        let products = Array.from(productContainer.children);
        products.sort((a, b) => {
            let nameA = a.querySelector('h2').textContent.toUpperCase(); // ignore upper and lowercase
            let nameB = b.querySelector('h2').textContent.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        });
        // Append sorted products
        productContainer.innerHTML = '';
        products.forEach(product => productContainer.appendChild(product));
    }

    // Function to reset to the default order
    function resetToDefaultOrder() {
        productContainer.innerHTML = '';
        originalOrder.forEach(product => productContainer.appendChild(product));
    }

    // Event listeners for the buttons
    document.getElementById('AtoZ').addEventListener('click', sortProductsAZ);
    document.getElementById('default').addEventListener('click', resetToDefaultOrder);

    // Get the modal
    var modal = document.getElementById('cartModal');

    // Get the button that opens the modal
    var btn = document.getElementById('cart');

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName('close')[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function () {
        modal.style.display = 'block';
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = 'none';
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('[id^="addToCart"]');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {

            const productCard = this.parentElement;
            const productName = productCard.querySelector('h2').textContent;
            const productPrice = productCard.querySelector('p').textContent.replace('Rs. ', '');
            const itemId = this.getAttribute('id');
            const productImage = productCard.querySelector('img').src; // Get the image source

            // Toggle item in cart
            if (this.textContent === "Add to cart") {

                // Retrieve the current count
                var count = parseInt(document.getElementById('cart-count').textContent);

                // Increment the count and update the display
                document.getElementById('cart-count').textContent = count + 1;


                // Check if the item is already in the cart
                if (cartItems[itemId]) {
                    // Item exists, increase the quantity
                    cartItems[itemId].quantity += 1;
                } else {
                    // Item does not exist, add it to the cart with a quantity of 1
                    cartItems[itemId] = {
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: 1
                    };
                }
            } else {

                // Retrieve the current count
                var count = parseInt(document.getElementById('cart-count').textContent);

                //  decrease the count and update the display
                document.getElementById('cart-count').textContent = count - 1;

                delete cartItems[itemId];
                this.textContent = "Add to cart";
            }

            // Optionally refresh the cart if it's open
            if (document.getElementById('cartModal').style.display === 'block') {
            }
        });

    });

    document.getElementById('cartItemsContainer').addEventListener('click', function (event) {
        if (event.target.matches('.increase-quantity') || event.target.matches('.decrease-quantity')) {
            const itemId = event.target.dataset.itemId;
            const item = cartItems[itemId];
            const quantityInput = event.target.closest('.cart-item').querySelector('.quantity-input');
            let quantity = parseInt(quantityInput.value);

            if (event.target.matches('.increase-quantity')) {
                quantity = Math.min(quantity + 1, 99);
                // Retrieve the current count
                var count = parseInt(document.getElementById('cart-count').textContent);

                // Increment the count and update the display
                document.getElementById('cart-count').textContent = Math.min(count + 1, 99);
            } else if (event.target.matches('.decrease-quantity')) {
                quantity = Math.max(quantity - 1, 0);
                // Retrieve the current count
                var count = parseInt(document.getElementById('cart-count').textContent);

                // Decrease the count and update the display
                document.getElementById('cart-count').textContent = Math.max(count - 1, 0);
            }

            quantityInput.value = quantity;
            item.quantity = quantity;

            refreshAndReopenCartModal();


        }

    });

    document.getElementById('cart').addEventListener('click', function () {

        cartItemsContainer.innerHTML =
            '<div class="cart-item-header">' +
            '<div class="cart-item-image">Product</div>' +
            '<div class="cart-item-details">Details</div>' +
            '<div class="cart-item-quantity">Quantity</div>' +
            '<div class="cart-item-total">Price</div>' +
            '</div>'; // Headers added here; 

        let total = 0;
        let itemCount = 0;

        Object.keys(cartItems).forEach(itemId => {
            const quantityInput = document.querySelector(`.quantity-input[data-item-id="${itemId}"]`);
            const item = cartItems[itemId];
            const price = parseInt(item.price.replace(/[^0-9.]/g, ''));
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            const totalPrice = (price * item.quantity);
            itemElement.dataset.itemId = itemId;

            if (quantityInput) {
                quantityInput.value = cartItems[itemId].quantity;
            }

            itemElement.innerHTML = `
        <div class="cart-item-image">
            <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="cart-item-details">
            <p>${item.name}</p>
            <p>Each: Rs.${item.price}</p>
        </div>
        <div class="quantity-selector">
            <button type="button" class="quantity-change decrease-quantity" data-item-id="${itemId}" aria-label="Decrease quantity">-</button>
            <input type="text" class="quantity-input" data-item-id="${itemId}" value="${item.quantity}" readonly>
            <button type="button" class="quantity-change increase-quantity" data-item-id="${itemId}" aria-label="Increase quantity">+</button>
        </div>

        <div class="cart-item-total">
            <p>Rs.${totalPrice}</p>
        </div>
        `;
            cartItemsContainer.appendChild(itemElement);

            total += parseInt(totalPrice);
            itemCount += item.quantity;
        });

        document.getElementById('itemCount').textContent = `${itemCount} Items`;
        document.getElementById('cartTotalPrice').textContent = total;
        if (itemCount === 0) {
            cartItemsContainer.innerHTML = '<p>Cart is empty!</p>';
            checkoutButton.style.display = 'none';
        } else {
            checkoutButton.style.display = 'block'; // Show checkout button
        }

        document.getElementById('cartModal').style.display = 'block';


    });

    document.querySelectorAll('.quantity-selector').forEach(selector => {
    });


});



