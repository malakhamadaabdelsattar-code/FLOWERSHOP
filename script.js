// ==================== DARK MODE ====================
function toggleMode() {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

// ==================== SIDE MENU ====================
function openMenu() {
    document.getElementById("sideMenu").classList.add("open");
    document.getElementById("menuOverlay").classList.add("show");
}

function closeMenu() {
    document.getElementById("sideMenu").classList.remove("open");
    document.getElementById("menuOverlay").classList.remove("show");
}

// ==================== LOGIN VALIDATION ====================
function validateLogin() {
    let user = document.getElementById("username").value.trim();
    let pass = document.getElementById("password").value;
    let errorBox = document.getElementById("errorBox");
    let successBox = document.getElementById("successBox");

    // Reset messages
    errorBox.innerHTML = "";
    if (successBox) successBox.innerHTML = "";

    // Form validation
    if (!user || !pass) {
        errorBox.innerHTML = "⚠️ Please fill in all fields!";
        return;
    }

    if (user === "malak" && pass === "888") {
        if (successBox) successBox.innerHTML = "✅ Login successful! Redirecting...";
        setTimeout(() => { window.location.href = "shop.html"; }, 1000);
    } else {
        errorBox.innerHTML = "❌ Wrong username or password!";
        // Shake animation
        let loginBox = document.querySelector(".login-box");
        if (loginBox) {
            loginBox.style.animation = "shake 0.4s";
            setTimeout(() => { loginBox.style.animation = ""; }, 400);
        }
    }
}

// ==================== SLIDESHOW (Mini Box in contact) ====================
let counter = 0;

function startMiniSlides() {
    let images = document.getElementsByClassName("MySlide");
    if (images.length === 0) return;
    for (let i = 0; i < images.length; i++) {
        images[i].style.display = "none";
    }
    counter++;
    if (counter > images.length) { counter = 1; }
    images[counter - 1].style.display = "block";
    setTimeout(startMiniSlides, 3000);
}

// ==================== HERO SLIDESHOW ====================
let heroIndex = 0;
function heroSlideshow() {
    const slides = document.querySelectorAll(".hero-slide");
    if (slides.length === 0) return;
    slides.forEach(s => s.classList.remove("active"));
    heroIndex = (heroIndex + 1) % slides.length;
    slides[heroIndex].classList.add("active");
    setTimeout(heroSlideshow, 4000);
}

// ==================== CART SYSTEM ====================
let cart = JSON.parse(localStorage.getItem("flowerCart")) || [];

function saveCart() {
    localStorage.setItem("flowerCart", JSON.stringify(cart));
}

function addToCart(name, price, img) {
    let existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ name, price, qty: 1, img });
    }
    saveCart();
    updateCartBadge();
    showCartToast(name);
}

function updateCartBadge() {
    let badge = document.getElementById("cartBadge");
    if (!badge) return;
    let total = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? "inline-block" : "none";
}

function showCartToast(name) {
    let toast = document.getElementById("cartToast");
    if (!toast) return;
    toast.textContent = `✅ "${name}" added to cart!`;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3000);
}

function openCart() {
    renderCart();
    document.getElementById("cartModal").classList.add("open");
    document.getElementById("menuOverlay").classList.add("show");
}

function closeCart() {
    document.getElementById("cartModal").classList.remove("open");
    document.getElementById("menuOverlay").classList.remove("show");
}

function renderCart() {
    let cartItems = document.getElementById("cartItems");
    let cartTotal = document.getElementById("cartTotal");
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p style='text-align:center;opacity:0.6;'>Your cart is empty 🛒</p>";
        if (cartTotal) cartTotal.textContent = "Total: $0";
        return;
    }

    cartItems.innerHTML = cart.map((item, i) => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <span>$${item.price} × ${item.qty} = $${item.price * item.qty}</span>
            </div>
            <div class="cart-item-controls">
                <button onclick="changeQty(${i}, -1)">−</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${i}, 1)">+</button>
                <button onclick="removeItem(${i})" style="background:#ff4d6d;">🗑️</button>
            </div>
        </div>
    `).join("");

    let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    if (cartTotal) cartTotal.textContent = `Total: $${total}`;
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    saveCart();
    updateCartBadge();
    renderCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartBadge();
    renderCart();
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    let summary = cart.map(item => `${item.name} x${item.qty} = $${item.price * item.qty}`).join("\n");
    alert(`🌸 Order confirmed!\n\n${summary}\n\nTotal: $${total}\n\nThank you for shopping at Malak's Flower Shop! 💖`);
    cart = [];
    saveCart();
    updateCartBadge();
    closeCart();
}

// ==================== CONTACT FORM VALIDATION ====================
function validateContact() {
    let name = document.getElementById("cName")?.value.trim();
    let email = document.getElementById("cEmail")?.value.trim();
    let msg = document.getElementById("cMsg")?.value.trim();
    let errBox = document.getElementById("contactError");
    let successBox = document.getElementById("contactSuccess");

    if (errBox) errBox.innerHTML = "";
    if (successBox) successBox.innerHTML = "";

    if (!name || !email || !msg) {
        if (errBox) errBox.innerHTML = "⚠️ Please fill in all fields!";
        return;
    }
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        if (errBox) errBox.innerHTML = "⚠️ Please enter a valid email address!";
        return;
    }
    if (successBox) successBox.innerHTML = "✅ Message sent successfully! We'll get back to you soon.";
    document.getElementById("cName").value = "";
    document.getElementById("cEmail").value = "";
    document.getElementById("cMsg").value = "";
}

// ==================== INIT ====================
window.onload = function () {
    // Restore dark mode
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
    }
    // Start slideshows
    startMiniSlides();
    heroSlideshow();
    // Update cart badge
    updateCartBadge();
};
