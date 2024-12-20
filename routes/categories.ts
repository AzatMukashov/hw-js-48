import express from "express";
import fs from "fs";

const router = express.Router();
const categoriesFile = './data/categories.json';

interface Category {
    id: number;
    name: string;
    description?: string;
}

const readData = (): Category[] => {
    const data = fs.readFileSync(categoriesFile, 'utf8');
    return JSON.parse(data) as Category[];
};
const writeData = (data: Category[]) => {
    fs.writeFileSync(categoriesFile, JSON.stringify(data, null, 2));
};

router.get('/', (req, res) => {
    const categories = readData();
    res.json(categories.map((cat: Category) => ({id: cat.id, name: cat.name})));
});
router.get('/:id', (req, res) => {
    const categories = readData();
    const category = categories.find(cat => cat.id === parseInt(req.params.id));
    if (category) {
        res.json(category);
    } else {
        res.status(404).json({message: 'Category not found'});
    }
});

router.post('/', (req, res) => {
    const categories = readData();
    const newCategory: Category = {
        id: categories.length > 0 ? categories[categories.length - 1].id + 1 : 1,
        name: req.body.name,
        description: req.body.description || ''
    };
    categories.push(newCategory);
    writeData(categories);
    res.status(201).json(newCategory);
});

router.delete('/:id', (req, res) => {
    let categories = readData();
    const categoryIndex = categories.findIndex(cat => cat.id === parseInt(req.params.id));
    if (categoryIndex !== -1) {
        categories.splice(categoryIndex, 1);
        writeData(categories);
        res.json({message: 'Category deleted'});
    } else {
        res.status(404).json({message: 'Category not found'});
    }
});