import { Router } from "express";
import ShoppingList from "../models/ShoppingList";
import { CategoryEnum } from "../types/CategoryEnum";

const router = Router();

router.get('/categories', async (req, res) => {
    try {
        const categories = Object.values(CategoryEnum);
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: 'srever error' });
    }
});


router.post('/shopping-list', async (req, res) => {
    const { items } = req.body;

    if (!Array.isArray(items) || !items.every(item =>
        typeof item.category === 'string' &&
        typeof item.productName === 'string' &&
        typeof item.quantity === 'number')) 
        {
        return res.status(400).json({ message: 'Invalid data format' });
    }

    try {
        const shoppingList = new ShoppingList({ items });
        await shoppingList.save();
        res.status(201).json(shoppingList);
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

export default router;