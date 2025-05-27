const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// GET all customers with pagination
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;     // default: page 1
        const limit = parseInt(req.query.limit) || 50;  // default: 50 data per page
        const skip = (page - 1) * limit;

        // Cari data dengan skip & limit
        const data = await Customer.find()
            // .select('Name Email gender') 
            .skip(skip)
            .limit(limit)
            .lean();

        // Ubah tahun lahir menjadi umur pada setiap data
        const currentYear = new Date().getFullYear();
        const dataWithAge = data.map(item => {
            if (typeof item.age === 'number') {
                return { ...item, age: currentYear - item.age };
            }
            return item;
        });

        // Hitung total dokumen untuk pagination
        const total = await Customer.countDocuments();

        res.json({
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalData: total,
            data: dataWithAge
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Summary berdasarkan gender
router.get('/summary/gender', async (req, res) => {
    try {
        const summary = await Customer.aggregate([
            {
                $group: {
                    _id: "$gender",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Ubah bentuk hasil agar lebih rapi
        const formatted = {};
        summary.forEach(item => {
            formatted[item._id] = item.count;
        });

        res.json({ summary: formatted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/summary/device', async (req, res) => {
    try {
        const summary = await Customer.aggregate([
            {
                $group: {
                    _id: "$brand_device",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Ubah bentuk hasil agar lebih rapi
        const formatted = {};
        summary.forEach(item => {
            formatted[item._id] = item.count;
        });

        res.json({ summary: formatted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/summary/interest', async (req, res) => {
    try {
        const summary = await Customer.aggregate([
            {
                $group: {
                    _id: "$digital_interest",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Ubah bentuk hasil agar lebih rapi
        const formatted = {};
        summary.forEach(item => {
            formatted[item._id] = item.count;
        });

        res.json({ summary: formatted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/summary/age', async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const summary = await Customer.aggregate([
            {
                $group: {
                    _id: "$age", // _id di sini adalah tahun lahir
                    count: { $sum: 1 }
                }
            }
        ]);

        // Ubah tahun lahir menjadi umur
        const formatted = {};
        summary.forEach(item => {
            if (typeof item._id === 'number') {
                const umur = currentYear - item._id;
                formatted[umur] = (formatted[umur] || 0) + item.count;
            }
        });

        res.json({ summary: formatted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/summary/location', async (req, res) => {
    try {
        const summary = await Customer.aggregate([
            {
                $group: {
                    _id: "$name_of_location",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Ubah bentuk hasil agar lebih rapi
        const formatted = {};
        summary.forEach(item => {
            formatted[item._id] = item.count;
        });

        res.json({ summary: formatted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/summary/hour', async (req, res) => {
    try {
        const summary = await Customer.aggregate([
            {
                $group: {
                    _id: "$login_hour",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Ubah bentuk hasil agar lebih rapi
        const formatted = {};
        summary.forEach(item => {
            formatted[item._id] = item.count;
        });

        res.json({ summary: formatted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.get('/summary/date', async (req, res) => {
    try {
        const summary = await Customer.aggregate([
            {
                $project: {
                    formattedDate: {
                        $dateToString: { format: "%Y-%m-%d", date: "$date" }
                    }
                }
            },
            {
                $group: {
                    _id: "$formattedDate",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Format response
        const formatted = {};
        summary.forEach(item => {
            formatted[item._id] = item.count;
        });

        res.json({ summary: formatted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/summary/locationtype', async (req, res) => {
    try {
        const summary = await Customer.aggregate([
            {
                $group: {
                    _id: "$location_type",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Ubah bentuk hasil agar lebih rapi
        const formatted = {};
        summary.forEach(item => {
            formatted[item._id] = item.count;
        });

        res.json({ summary: formatted });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
