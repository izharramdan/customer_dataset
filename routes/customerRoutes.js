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

        // Hitung total dokumen untuk pagination
        const total = await Customer.countDocuments();

        res.json({
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalData: total,
            data
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

module.exports = router;
