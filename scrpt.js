// scrpt.js
alert("Our website is on early stage. If you want a jersey that we show on our tiktok or you want a player jersey contact us on tiktok or mail: vintagefootballjersey2025@gmail.com")
document.addEventListener('DOMContentLoaded', () => {
    const cart = document.querySelector('.cart');
    const cartIcon = document.getElementById('cart-icon');
    const closeCart = document.getElementById('close-cart');
    const overlay = document.querySelector('.cart-overlay');
    const body = document.body;

    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            cart.classList.add('active');
            body.classList.add('cart-open');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cart.classList.remove('active');
            body.classList.remove('cart-open');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            cart.classList.remove('active');
            body.classList.remove('cart-open');
        });
    }

    ready(); // Call your ready function after listeners are set

    // Highlight current page in pagination
    const currentPage = window.location.pathname.split('/').pop() || "index.html";
    const pageLinks = document.querySelectorAll('.pages a');
    const pages = document.querySelectorAll('.pages');
    pageLinks.forEach(link => {
        if (
            (currentPage === "index.html" && link.getAttribute('href') === "index.html") ||
            (currentPage === "page2.html" && link.getAttribute('href') === "page2.html") ||
            (currentPage === "page3.html" && link.getAttribute('href') === "page3.html")
        ) {
            link.classList.add('pages');
        }
    });

    // Search bar functionality - Moved inside DOMContentLoaded
    const searchInput = document.getElementById('search');

    // Event listener for search input
    if (searchInput) { // Check if searchInput element exists
        searchInput.addEventListener("input", e => {
            const value = e.target.value.toLowerCase();
            allProducts.forEach(product => {
                const isVisible = product.title.includes(value);
                product.element.classList.toggle("hide", !isVisible);
            });
        });
    }
});

// Array to store all product elements and their titles for searching
let allProducts = [];

function ready() {
    loadCart();

    let addCart = document.getElementsByClassName('add-cart');
    for (let btn of addCart) {
        btn.addEventListener('click', addCartClicked);
    }

    // Initialize products for search
    initializeProductsForSearch();
}

function addCartClicked(event) {
    let product = event.target.closest('.product-box');
    let title = product.querySelector('.product-title').innerText;
    let price = product.querySelector('.price').innerText;
    let img = product.querySelector('.product-img').src;
    let size = product.querySelector('.product-size').value;
    addProductToCart(title, price, img, size);
    updateTotal();
}

function addProductToCart(title, price, img, size) {
    let cartItems = document.querySelector('.cart-content');
    let cartBoxes = cartItems.querySelectorAll('.cart-box');

    for (let box of cartBoxes) {
        let t = box.querySelector('.cart-product-title').innerText;
        let s = box.querySelector('.cart-size').innerText.replace('Size: ', '');
        if (t === title && s === size) {
            alert('Already added');
            return;
        }
    }

    let div = document.createElement('div');
    div.classList.add('cart-box');
    div.innerHTML = `
        <img src="${img}" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <div class="cart-size">Size: ${size}</div>
            <input type="number" value="1" class="cart-quantity">
        </div>
        <i class='bx bxs-trash cart-remove'></i>`;

    div.querySelector('.cart-remove').addEventListener('click', removeCartItem);
    div.querySelector('.cart-quantity').addEventListener('change', quantityChanged);

    cartItems.appendChild(div);
    saveCart();
}

function removeCartItem(e) {
    e.target.closest('.cart-box').remove();
    updateTotal();
}

function quantityChanged(e) {
    if (e.target.value <= 0 || isNaN(e.target.value)) e.target.value = 1;
    updateTotal();
}

function updateTotal() {
    let boxes = document.querySelectorAll('.cart-box');
    let total = 0;
    let jerseyCount = 0;
    boxes.forEach(box => {
        let price = parseFloat(box.querySelector('.cart-price').innerText.replace('€',''));
        let qty = parseInt(box.querySelector('.cart-quantity').value, 10);
        total += price * qty;
        jerseyCount += qty;
    });
    let shipping = calculateShipping(jerseyCount);
    document.querySelector('.total-price').innerText = '€' + (total + shipping).toFixed(2);

    // Show shipping breakdown
    let totalDiv = document.querySelector('.total');
    if (totalDiv && !totalDiv.querySelector('.shipping-info')) {
        let shippingInfo = document.createElement('div');
        shippingInfo.className = 'shipping-info';
        shippingInfo.style.fontSize = '0.95em';
        shippingInfo.style.color = '#555';
        totalDiv.appendChild(shippingInfo);
    }
    let shippingInfo = totalDiv.querySelector('.shipping-info');
    if (shippingInfo) {
        shippingInfo.innerText = `Shipping: €${shipping.toFixed(2)}`;
    }

    saveCart();
}

function saveCart() {
    let items = [];
    document.querySelectorAll('.cart-box').forEach(box => {
        items.push({
            title: box.querySelector('.cart-product-title').innerText,
            price: box.querySelector('.cart-price').innerText,
            size: box.querySelector('.cart-size').innerText.replace('Size: ', ''),
            quantity: box.querySelector('.cart-quantity').value,
            imgSrc: box.querySelector('.cart-img').src
        });
    });
    localStorage.setItem('cart', JSON.stringify(items));
}

function loadCart() {
    // Clear current cart
    const cartItems = document.querySelector('.cart-content');
    cartItems.innerHTML = '';

    let items = JSON.parse(localStorage.getItem('cart')) || [];
    items.forEach(i => {
        // Add directly without duplicate check
        let div = document.createElement('div');
        div.classList.add('cart-box');
        div.innerHTML = `
            <img src="${i.imgSrc}" class="cart-img">
            <div class="detail-box">
                <div class="cart-product-title">${i.title}</div>
                <div class="cart-price">${i.price}</div>
                <div class="cart-size">Size: ${i.size}</div>
                <input type="number" value="${i.quantity}" class="cart-quantity">
            </div>
            <i class='bx bxs-trash cart-remove'></i>`;

        div.querySelector('.cart-remove').addEventListener('click', removeCartItem);
        div.querySelector('.cart-quantity').addEventListener('change', quantityChanged);

        cartItems.appendChild(div);
    });
    updateTotal();
}

function sendOrder() {
    let items = [];
    document.querySelectorAll('.cart-box').forEach(box => {
        let title = box.querySelector('.cart-product-title').innerText;
        let size = box.querySelector('.cart-size').innerText.replace('Size: ', '');
        let qty = box.querySelector('.cart-quantity').value;
        let price = box.querySelector('.cart-price').innerText;
        items.push(`${title} (${size}) x${qty} - ${price}`);
    });

    emailjs.send("service_vmcxrde","template_2ef7fck", {
        message: items.join('\n'),
    }).then(() => {
        alert("Order sent successfully!");
    }, (err) => {
        alert("Failed to send order: " + JSON.stringify(err));
    });
}

paypal.Buttons({
    createOrder: function (data, actions) {
        let total = 0;
        let items = [];
        document.querySelectorAll('.cart-box').forEach(box => {
            let title = box.querySelector('.cart-product-title').innerText;
            let price = parseFloat(box.querySelector('.cart-price').innerText.replace('€',''));
            let qty = parseInt(box.querySelector('.cart-quantity').value, 10);
            let size = box.querySelector('.cart-size').innerText.replace('Size: ', '');
            total += price * qty;
            items.push({
                name: `${title} (${size})`,
                unit_amount: { currency_code: 'EUR', value: price.toFixed(2) },
                quantity: qty.toString()
            });
        });
        // Add shipping as a separate item if needed
        let jerseyCount = items.reduce((sum, item) => sum + parseInt(item.quantity), 0);
        let shipping = calculateShipping(jerseyCount);
        if (shipping > 0) {
            items.push({
                name: "Shipping",
                unit_amount: { currency_code: 'EUR', value: shipping.toFixed(2) },
                quantity: "1"
            });
            total += shipping;
        }
        if (isNaN(total) || total <= 0) return;
        return actions.order.create({
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: total.toFixed(2),
                    breakdown: {
                        item_total: { currency_code: 'EUR', value: (total - shipping).toFixed(2) },
                        shipping: { currency_code: 'EUR', value: shipping.toFixed(2) }
                    }
                },
                items: items
            }]
        });
    },
    onApprove: function (data, actions) {
        return actions.order.capture().then(function(details) {
            // Payment successful, now send the order
            sendOrder();
            document.querySelectorAll('.cart-box').forEach(box => box.remove());
            updateTotal();
            alert('Payment completed by ' + details.payer.name.given_name + '!');
        });
    }
}).render('#paypal');

//pages
const currentPage = window.location.pathname.split('/').pop();
if (currentPage === "page1.html") {

}

function calculateShipping(jerseyCount) {
   /*if (jerseyCount >= 5) return 0;
    if (jerseyCount === 4) return 1;
    if (jerseyCount === 3) return 3;
    if (jerseyCount === 2) return 4;
    if (jerseyCount === 1) return 5;*/
    return 2;
}

// Function to initialize the allProducts array with product details
function initializeProductsForSearch() {
    const productBoxes = document.querySelectorAll('.product-box');
    allProducts = Array.from(productBoxes).map(productBox => {
        return {
            element: productBox,
            title: productBox.querySelector('.product-title').innerText.toLowerCase()
        };
    });
}