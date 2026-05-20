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

// ==================== USER STORAGE ====================
// Get all registered users from localStorage (array of objects)
function getUsers() {
    return JSON.parse(localStorage.getItem("flowerUsers")) || [];
}
function saveUsers(users) {
    localStorage.setItem("flowerUsers", JSON.stringify(users));
}
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("flowerCurrentUser")) || null;
}
function setCurrentUser(user) {
    localStorage.setItem("flowerCurrentUser", JSON.stringify(user));
}
function logoutUser() {
    localStorage.removeItem("flowerCurrentUser");
    window.location.href = "login.html";
}

// ==================== REGISTER ====================
function validateRegister() {
    let fullname = document.getElementById("reg-fullname").value.trim();
    let username = document.getElementById("reg-username").value.trim();
    let email    = document.getElementById("reg-email").value.trim();
    let password = document.getElementById("reg-password").value;
    let confirm  = document.getElementById("reg-confirm").value;
    let errBox   = document.getElementById("reg-errorBox");
    let succBox  = document.getElementById("reg-successBox");

    errBox.innerHTML = "";
    succBox.innerHTML = "";

    // --- Validation checks ---
    if (!fullname || !username || !email || !password || !confirm) {
        errBox.innerHTML = "⚠️ Please fill in all fields!";
        return;
    }
    if (username.length < 3) {
        errBox.innerHTML = "⚠️ Username must be at least 3 characters!";
        return;
    }
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errBox.innerHTML = "⚠️ Please enter a valid email address!";
        return;
    }
    if (password.length < 6) {
        errBox.innerHTML = "⚠️ Password must be at least 6 characters!";
        return;
    }
    if (password !== confirm) {
        errBox.innerHTML = "❌ Passwords do not match!";
        shakebox("reg-confirm");
        return;
    }

    // --- Check username not already taken ---
    let users = getUsers();
    let exists = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (exists) {
        errBox.innerHTML = "❌ Username already taken! Please choose another.";
        shakebox("reg-username");
        return;
    }

    // --- Save new user ---
    let newUser = { fullname, username, email, password };
    users.push(newUser);
    saveUsers(users);

    // --- Success ---
    succBox.innerHTML = "✅ Account created successfully! Redirecting to login...";
    setTimeout(() => { window.location.href = "login.html"; }, 1500);
}

// ==================== LOGIN ====================
function validateLogin() {
    let user    = document.getElementById("username").value.trim();
    let pass    = document.getElementById("password").value;
    let errBox  = document.getElementById("errorBox");
    let succBox = document.getElementById("successBox");

    errBox.innerHTML  = "";
    succBox.innerHTML = "";

    if (!user || !pass) {
        errBox.innerHTML = "⚠️ Please fill in all fields!";
        return;
    }

    let users = getUsers();

    // Also allow the hardcoded default account
    let found = users.find(u =>
        u.username.toLowerCase() === user.toLowerCase() && u.password === pass
    );
    let isDefault = (user === "malak" && pass === "888");

    if (found || isDefault) {
        let loggedUser = found || { username: "malak", fullname: "Malak Hamada" };
        setCurrentUser(loggedUser);
        succBox.innerHTML = `✅ Welcome back, ${loggedUser.fullname || loggedUser.username}! Redirecting...`;
        setTimeout(() => { window.location.href = "shop.html"; }, 1200);
    } else {
        errBox.innerHTML = "❌ Wrong username or password!";
        shakebox("username");
    }
}

// helper – shake a field
function shakebox(id) {
    let el = document.getElementById(id);
    if (!el) {
        // try to shake the whole login-box instead
        el = document.querySelector(".login-box");
    }
    if (!el) return;
    el.style.animation = "shake 0.4s";
    setTimeout(() => { el.style.animation = ""; }, 400);
}

// ==================== PASSWORD STRENGTH ====================
function checkStrength() {
    let pass = document.getElementById("reg-password")?.value || "";
    let bar  = document.getElementById("strengthBar");
    let fill = document.getElementById("strengthFill");
    let label = document.getElementById("strengthLabel");
    if (!bar) return;

    if (pass.length === 0) { bar.style.display = "none"; return; }
    bar.style.display = "block";

    let score = 0;
    if (pass.length >= 6)  score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^a-zA-Z0-9]/.test(pass)) score++;

    let levels = [
        { pct: "20%", color: "#ff4d4d", text: "Very Weak 😬" },
        { pct: "40%", color: "#ff944d", text: "Weak 😐" },
        { pct: "60%", color: "#ffd24d", text: "Fair 🙂" },
        { pct: "80%", color: "#99dd55", text: "Strong 💪" },
        { pct: "100%", color: "#44cc44", text: "Very Strong 🔒" },
    ];
    let lvl = levels[Math.min(score, 4)];
    fill.style.width  = lvl.pct;
    fill.style.background = lvl.color;
    label.textContent = lvl.text;
    label.style.color = lvl.color;
}

// ==================== SLIDESHOW (Mini Box in contact) ====================
let counter = 0;
function startMiniSlides() {
    let images = document.getElementsByClassName("MySlide");
    if (images.length === 0) return;
    for (let i = 0; i < images.length; i++) images[i].style.display = "none";
    counter++;
    if (counter > images.length) counter = 1;
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
function saveCart() { localStorage.setItem("flowerCart", JSON.stringify(cart)); }

function addToCart(name, price, img) {
    let existing = cart.find(item => item.name === name);
    if (existing) { existing.qty++; }
    else { cart.push({ name, price, qty: 1, img }); }
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
    saveCart(); updateCartBadge(); renderCart();
}
function removeItem(index) {
    cart.splice(index, 1);
    saveCart(); updateCartBadge(); renderCart();
}
function checkout() {
    if (cart.length === 0) { alert("Your cart is empty!"); return; }
    let total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    let summary = cart.map(item => `${item.name} x${item.qty} = $${item.price * item.qty}`).join("\n");
    alert(`🌸 Order confirmed!\n\n${summary}\n\nTotal: $${total}\n\nThank you for shopping at Malak's Flower Shop! 💖`);
    cart = []; saveCart(); updateCartBadge(); closeCart();
}

// ==================== CONTACT FORM ====================
function validateContact() {
    let name    = document.getElementById("cName")?.value.trim();
    let email   = document.getElementById("cEmail")?.value.trim();
    let msg     = document.getElementById("cMsg")?.value.trim();
    let errBox  = document.getElementById("contactError");
    let succBox = document.getElementById("contactSuccess");
    if (errBox)  errBox.innerHTML  = "";
    if (succBox) succBox.innerHTML = "";
    if (!name || !email || !msg) {
        if (errBox) errBox.innerHTML = "⚠️ Please fill in all fields!";
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (errBox) errBox.innerHTML = "⚠️ Please enter a valid email address!";
        return;
    }
    if (succBox) succBox.innerHTML = "✅ Message sent successfully! We'll get back to you soon.";
    document.getElementById("cName").value  = "";
    document.getElementById("cEmail").value = "";
    document.getElementById("cMsg").value   = "";
}

// ==================== INIT ====================
window.onload = function () {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
    }
    startMiniSlides();
    heroSlideshow();
    updateCartBadge();

    // Attach password strength checker if on register page
    let passField = document.getElementById("reg-password");
    if (passField) passField.addEventListener("input", checkStrength);
};
