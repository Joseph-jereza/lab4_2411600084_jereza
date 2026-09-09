let categoryChartInstance = null;
let stockChartInstance = null;

function renderCharts(productsList = getProducts()) {
    

    const categoryTotals = {};
    productsList.forEach(p => {
        categoryTotals[p.category] = (categoryTotals[p.category] || 0) + (p.price * p.quantity);
    });

    const categoryLabels = Object.keys(categoryTotals);
    const categoryValues = Object.values(categoryTotals);

    const ctxCategory = document.getElementById('categoryChart');
    if (ctxCategory) {
        if (categoryChartInstance) {
            categoryChartInstance.destroy();
        }
        categoryChartInstance = new Chart(ctxCategory, {
            type: 'bar',
            data: {
                labels: categoryLabels,
                datasets: [{
                    label: 'Total Value (₱)',
                    data: categoryValues,
                    backgroundColor: ['#0d6efd', '#20c997', '#ffc107', '#6f42c1']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
            }
        });
    }

    const stockCounts = { "In Stock": 0, "Low Stock": 0, "Out of Stock": 0 };
    productsList.forEach(p => {
        if (stockCounts[p.status] !== undefined) {
            stockCounts[p.status]++;
        }
    });

    const stockLabels = Object.keys(stockCounts);
    const stockValues = Object.values(stockCounts);

    const ctxStock = document.getElementById('stockStatusChart');
    if (ctxStock) {
        if (stockChartInstance) {
            stockChartInstance.destroy();
        }
        stockChartInstance = new Chart(ctxStock, {
            type: 'doughnut',
            data: {
                labels: stockLabels,
                datasets: [{
                    data: stockValues,
                    backgroundColor: ['#198754', '#ffc107', '#dc3545'] // Green (In Stock), Yellow (Low), Red (Out)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { position: 'top' }
                }
            }
        });
    }
}