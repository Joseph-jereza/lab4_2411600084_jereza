document.addEventListener('DOMContentLoaded', () => {
    updateGreeting();
    renderStats();
    
    const initialData = getProducts();
    renderProductsTable('ALL', 'ALL', '');
    
    if (typeof renderCharts === "function") {
        renderCharts(initialData);
    }

    renderRecentActivity();

    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const resetBtn = document.getElementById('resetFiltersBtn');

    function applyFilters() {
        const query = searchInput ? searchInput.value : '';
        const cat = categoryFilter ? categoryFilter.value : 'ALL';
        const stat = statusFilter ? statusFilter.value : 'ALL';

        const filteredData = filterProducts(cat, stat, query);

        renderProductsTable(cat, stat, query);

        if (typeof renderCharts === "function") {
            renderCharts(filteredData);
        }
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = 'ALL';
            if (statusFilter) statusFilter.value = 'ALL';
            
            const allProducts = getProducts();
            renderProductsTable('ALL', 'ALL', '');
            if (typeof renderCharts === "function") {
                renderCharts(allProducts);
            }
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
});

function updateGreeting() {
    const greetingElement = document.getElementById('greeting');
    if (!greetingElement) return;

    const now = new Date();
    const hours = now.getHours();
    let greetingText = "";

    if (hours >= 0 && hours < 12) {
        greetingText = "Good Morning";
    } else if (hours >= 12 && hours < 18) {
        greetingText = "Good Afternoon";
    } else {
        greetingText = "Good Evening";
    }

    let username = 'Admin';
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            username = parsedUser.username || parsedUser.name || 'Admin';
        } catch (e) {
            username = storedUser;
        }
    }

    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        userNameDisplay.textContent = username;
    }

    greetingElement.textContent = `${greetingText}, ${username}!`;
}

function renderStats() {
    const productsList = getProducts();

    const totalProducts = productsList.length;
    const totalValue = productsList.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const lowStockCount = productsList.filter(p => p.status === 'Low Stock').length;
    const outOfStockCount = productsList.filter(p => p.status === 'Out of Stock').length;

    const statTotalProducts = document.getElementById('statTotalProducts');
    const statTotalValue = document.getElementById('statTotalValue');
    const statLowStock = document.getElementById('statLowStock');
    const statOutOfStock = document.getElementById('statOutOfStock');
    const alertText = document.getElementById('alertText');

    if (statTotalProducts) statTotalProducts.textContent = totalProducts;
    if (statTotalValue) statTotalValue.textContent = '₱' + totalValue.toLocaleString('en-PH', { minimumFractionDigits: 2 });
    if (statLowStock) statLowStock.textContent = lowStockCount;
    if (statOutOfStock) statOutOfStock.textContent = outOfStockCount;

    if (alertText) {
        const totalAlerts = lowStockCount + outOfStockCount;
        alertText.textContent = `${totalAlerts} product(s) require inventory replenishment!`;
    }
}

function renderProductsTable(category = 'ALL', status = 'ALL', query = '') {
    const tableBody = document.getElementById('productTableBody');
    if (!tableBody) return;

    const productsList = filterProducts(category, status, query);

    if (!productsList || productsList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">No matching products found.</td></tr>`;
        return;
    }

    tableBody.innerHTML = productsList.map(item => {
        let badgeClass = "bg-success";
        if (item.status === "Low Stock") badgeClass = "bg-warning text-dark";
        if (item.status === "Out of Stock") badgeClass = "bg-danger";

        const totalValue = item.price * item.quantity;

        return `
            <tr>
                <td><strong>${item.sku}</strong></td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>₱${item.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td>${item.quantity}</td>
                <td class="fw-bold">₱${totalValue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</td>
                <td><span class="badge ${badgeClass}">${item.status}</span></td>
            </tr>
        `;
    }).join('');
}

function renderRecentActivity() {
    const tableBody = document.getElementById('activityTableBody');
    if (!tableBody) return;

    const activities = getRecentActivities();

    tableBody.innerHTML = activities.map(item => `
        <tr>
            <td>${item.date}</td>
            <td>${item.activity}</td>
            <td class="text-end"><span class="badge ${item.badgeClass}">${item.status}</span></td>
        </tr>
    `).join('');
}