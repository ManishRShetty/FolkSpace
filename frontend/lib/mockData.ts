// Mock data for frontend development without backend

export const USE_MOCK_DATA = true; // Toggle this to switch between mock and real API

// Mock Inventory Items
export const mockInventoryItems = [
    {
        _id: '1',
        product_name: 'Nordic Shampoo',
        Quantity: 150,
        selling_price: 12.99,
        cost_price: 8.50,
        country: 'finland',
        month: 1,
        createdAt: '2026-01-01T10:00:00Z',
    },
    {
        _id: '2',
        product_name: 'Organic Toothpaste',
        Quantity: 200,
        selling_price: 6.50,
        cost_price: 3.20,
        country: 'sweden',
        month: 1,
        createdAt: '2026-01-02T11:00:00Z',
    },
    {
        _id: '3',
        product_name: 'Birch Body Lotion',
        Quantity: 75,
        selling_price: 18.99,
        cost_price: 12.00,
        country: 'norway',
        month: 1,
        createdAt: '2026-01-03T09:30:00Z',
    },
    {
        _id: '4',
        product_name: 'Arctic Face Cream',
        Quantity: 45,
        selling_price: 34.50,
        cost_price: 22.00,
        country: 'iceland',
        month: 1,
        createdAt: '2026-01-04T14:00:00Z',
    },
    {
        _id: '5',
        product_name: 'Sea Salt Scrub',
        Quantity: 120,
        selling_price: 15.99,
        cost_price: 9.50,
        country: 'denmark',
        month: 1,
        createdAt: '2026-01-05T08:45:00Z',
    },
    {
        _id: '6',
        product_name: 'Herbal Conditioner',
        Quantity: 180,
        selling_price: 14.50,
        cost_price: 9.00,
        country: 'finland',
        month: 2,
        createdAt: '2026-01-06T16:20:00Z',
    },
    {
        _id: '7',
        product_name: 'Vitamin E Oil',
        Quantity: 60,
        selling_price: 22.00,
        cost_price: 14.50,
        country: 'sweden',
        month: 2,
        createdAt: '2026-01-07T12:15:00Z',
    },
    {
        _id: '8',
        product_name: 'Aloe Vera Gel',
        Quantity: 250,
        selling_price: 8.99,
        cost_price: 4.50,
        country: 'norway',
        month: 2,
        createdAt: '2026-01-08T10:30:00Z',
    },
];

// Mock Analytics Data
export const mockAnalytics = {
    metrics: [
        {
            _id: '1',
            metric: 'totalRevenue',
            value: '€45,231.89',
            change: '+12.5%',
        },
        {
            _id: '2',
            metric: 'newCustomers',
            value: '1,204',
            change: '+8.2%',
        },
        {
            _id: '3',
            metric: 'conversionRate',
            value: '3.12%',
            change: '-1.5%',
        },
        {
            _id: '4',
            metric: 'avgOrderValue',
            value: '€120.50',
            change: '+0.5%',
        },
    ],
};

// Mock Regional Top Products (by country)
export const mockRegionalTop: Record<string, Array<{
    product_name: string;
    totalSales: number;
    avgPrice: number;
    retailerCount: number;
}>> = {
    finland: [
        { product_name: 'Nordic Shampoo', totalSales: 1250, avgPrice: 12.99, retailerCount: 15 },
        { product_name: 'Herbal Conditioner', totalSales: 980, avgPrice: 14.50, retailerCount: 12 },
        { product_name: 'Birch Body Lotion', totalSales: 750, avgPrice: 18.99, retailerCount: 10 },
        { product_name: 'Sauna Honey Cream', totalSales: 620, avgPrice: 24.99, retailerCount: 8 },
        { product_name: 'Arctic Berry Serum', totalSales: 480, avgPrice: 32.00, retailerCount: 6 },
    ],
    sweden: [
        { product_name: 'Organic Toothpaste', totalSales: 1500, avgPrice: 6.50, retailerCount: 22 },
        { product_name: 'Vitamin E Oil', totalSales: 890, avgPrice: 22.00, retailerCount: 14 },
        { product_name: 'Lavender Soap', totalSales: 720, avgPrice: 5.99, retailerCount: 18 },
        { product_name: 'Oat Milk Lotion', totalSales: 650, avgPrice: 16.50, retailerCount: 11 },
        { product_name: 'Pine Tar Shampoo', totalSales: 520, avgPrice: 14.99, retailerCount: 9 },
    ],
    norway: [
        { product_name: 'Birch Body Lotion', totalSales: 1100, avgPrice: 18.99, retailerCount: 16 },
        { product_name: 'Aloe Vera Gel', totalSales: 920, avgPrice: 8.99, retailerCount: 20 },
        { product_name: 'Fjord Sea Salt Scrub', totalSales: 680, avgPrice: 19.99, retailerCount: 12 },
        { product_name: 'Cloudberry Cream', totalSales: 540, avgPrice: 28.50, retailerCount: 8 },
        { product_name: 'Salmon Oil Capsules', totalSales: 420, avgPrice: 35.00, retailerCount: 7 },
    ],
    iceland: [
        { product_name: 'Arctic Face Cream', totalSales: 800, avgPrice: 34.50, retailerCount: 8 },
        { product_name: 'Geothermal Mud Mask', totalSales: 650, avgPrice: 29.99, retailerCount: 6 },
        { product_name: 'Icelandic Moss Extract', totalSales: 480, avgPrice: 42.00, retailerCount: 5 },
        { product_name: 'Blue Lagoon Lotion', totalSales: 390, avgPrice: 38.50, retailerCount: 4 },
        { product_name: 'Glacier Water Mist', totalSales: 320, avgPrice: 25.00, retailerCount: 5 },
    ],
    denmark: [
        { product_name: 'Sea Salt Scrub', totalSales: 1300, avgPrice: 15.99, retailerCount: 19 },
        { product_name: 'Hygge Candle Set', totalSales: 950, avgPrice: 24.99, retailerCount: 15 },
        { product_name: 'Danish Rose Oil', totalSales: 720, avgPrice: 45.00, retailerCount: 10 },
        { product_name: 'Rye Flour Soap', totalSales: 580, avgPrice: 8.50, retailerCount: 14 },
        { product_name: 'Baltic Amber Serum', totalSales: 440, avgPrice: 55.00, retailerCount: 6 },
    ],
};

// Country code mapping
const countryCodeMap: Record<string, string> = {
    fi: 'finland',
    se: 'sweden',
    no: 'norway',
    is: 'iceland',
    dk: 'denmark',
};

export const getRegionalTopByCountry = (countryCode: string) => {
    const countryName = countryCodeMap[countryCode.toLowerCase()] || countryCode.toLowerCase();
    return mockRegionalTop[countryName] || [];
};

// Mock Top Sold Products (Last Year)
export const mockTopSold = [
    { product_name: 'Nordic Shampoo', totalSales: 15420, avgPrice: 12.99 },
    { product_name: 'Organic Toothpaste', totalSales: 12850, avgPrice: 6.50 },
    { product_name: 'Sea Salt Scrub', totalSales: 9780, avgPrice: 15.99 },
    { product_name: 'Aloe Vera Gel', totalSales: 8640, avgPrice: 8.99 },
    { product_name: 'Birch Body Lotion', totalSales: 7520, avgPrice: 18.99 },
];

// Mock Delivery Agents
export const mockDeliveryAgents = [
    { _id: '1', name: 'Erik Johansson', location: 'Stockholm', phone: '+46 70 123 4567', status: 'active' },
    { _id: '2', name: 'Anna Virtanen', location: 'Helsinki', phone: '+358 40 123 4567', status: 'active' },
    { _id: '3', name: 'Magnus Olsen', location: 'Oslo', phone: '+47 90 12 34 56', status: 'busy' },
    { _id: '4', name: 'Sigrid Ísleifsdóttir', location: 'Reykjavik', phone: '+354 612 3456', status: 'active' },
    { _id: '5', name: 'Lars Andersen', location: 'Copenhagen', phone: '+45 20 12 34 56', status: 'offline' },
];

// Mock Stock Data
export const mockStock = [
    { product_name: 'Nordic Shampoo', country: 'finland', quantity: 150, reorderLevel: 50 },
    { product_name: 'Organic Toothpaste', country: 'sweden', quantity: 200, reorderLevel: 75 },
    { product_name: 'Sea Salt Scrub', country: 'denmark', quantity: 120, reorderLevel: 40 },
    { product_name: 'Aloe Vera Gel', country: 'norway', quantity: 30, reorderLevel: 60 }, // Low stock!
    { product_name: 'Arctic Face Cream', country: 'iceland', quantity: 45, reorderLevel: 20 },
];

// Mock Inventory Alerts
export const mockInventoryAlerts = {
    lowStock: [
        { product_name: 'Aloe Vera Gel', quantity: 30, reorderLevel: 60, country: 'norway' },
        { product_name: 'Arctic Face Cream', quantity: 45, reorderLevel: 50, country: 'iceland' },
    ],
    expiringSoon: [
        { product_name: 'Organic Toothpaste', expiryDate: '2026-02-15', daysUntilExpiry: 43 },
        { product_name: 'Vitamin E Oil', expiryDate: '2026-02-28', daysUntilExpiry: 56 },
    ],
};
