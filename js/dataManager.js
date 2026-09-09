const initialProducts = [
    { sku: "ELE-001", name: "Keyboard", category: "Electronics", price: 3500, quantity: 20, status: "In Stock", reorderLevel: 5 },
    { sku: "ELE-002", name: "Wireless Earbuds", category: "Electronics", price: 3500, quantity: 3, status: "Low Stock", reorderLevel: 5 },
    { sku: "ACC-001", name: "USB-C Cable", category: "Accessories", price: 450, quantity: 50, status: "In Stock", reorderLevel: 10 },
    { sku: "ACC-002", name: "Laptop Stand", category: "Accessories", price: 1200, quantity: 0, status: "Out of Stock", reorderLevel: 2 },
    { sku: "FUR-001", name: "Gaming Chair", category: "Furniture", price: 25000, quantity: 2, status: "Low Stock", reorderLevel: 3 },
    { sku: "FUR-002", name: "Standing Desk", category: "Furniture", price: 15000, quantity: 10, status: "In Stock", reorderLevel: 2 }
];

const initialActivities = [
    { date: "2026-09-09 01:15", activity: "New order #ORD-8832 placed", status: "Success", badgeClass: "bg-success" },
    { date: "2026-09-08 22:15", activity: "User profile updated", status: "Info", badgeClass: "bg-info text-white" },
    { date: "2026-09-08 19:05", activity: "System alert: Inventory low", status: "Warning", badgeClass: "bg-warning text-dark" }
];

if (!localStorage.getItem('v7_products')) {
    localStorage.setItem('v7_products', JSON.stringify(initialProducts));
}
if (!localStorage.getItem('v7_activities')) {
    localStorage.setItem('v7_activities', JSON.stringify(initialActivities));
}

function getProducts() {
    return JSON.parse(localStorage.getItem('v7_products')) || initialProducts;
}

function getRecentActivities() {
    return JSON.parse(localStorage.getItem('v7_activities')) || initialActivities;
}

function filterProducts(category = 'ALL', status = 'ALL', query = '') {
    const products = getProducts();
    const searchTerm = query.toLowerCase().trim();

    return products.filter(product => {
        const matchesCategory = (category === 'ALL' || product.category === category);
        const matchesStatus = (status === 'ALL' || product.status === status);
        const matchesQuery = !searchTerm || 
                             product.name.toLowerCase().includes(searchTerm) || 
                             product.sku.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesStatus && matchesQuery;
    });
}

function getCategoryData() {
    const products = getProducts();
    const categories = {};
    products.forEach(p => {
        categories[p.category] = (categories[p.category] || 0) + (p.price * p.quantity);
    });
    return {
        labels: Object.keys(categories),
        values: Object.values(categories)
    };
}

function getStockStatusData() {
    const products = getProducts();
    const counts = { "In Stock": 0, "Low Stock": 0, "Out of Stock": 0 };
    products.forEach(p => {
        if (counts[p.status] !== undefined) counts[p.status]++;
    });
    return {
        labels: Object.keys(counts),
        values: Object.values(counts)
    };
}

function exportToCSV() {
    const products = getProducts();
    let csvContent = "data:text/csv;charset=utf-8,SKU,Name,Category,Unit Price,Quantity,Total Value,Status\n";
    products.forEach(p => {
        const totalVal = p.price * p.quantity;
        csvContent += `${p.sku},"${p.name}",${p.category},${p.price},${p.quantity},${totalVal},${p.status}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}