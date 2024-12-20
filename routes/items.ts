import express from "express";
import fs from "fs";
import multer from "multer";
const router = express.Router();
const itemsFile = './data/items.json';

interface Item {
    id: number;
    categoryId: number;
    locationId: number;
    name: string;
    description?: string;
    photo?: string;
    dateAdded: string;
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({storage: storage});

const readData = (): Item[] => {
    const data = fs.readFileSync(itemsFile, 'utf8');
    return JSON.parse(data) as Item[];
}
const writeData = (data: Item[]) => {
    fs.writeFileSync(itemsFile, JSON.stringify(data, null, 2));
}
router.get('/', (_req, res) => {
    const items = readData();
    res.json(items.map(item => ({id: item.id, name: item.name})));
});
router.get('/:id', (req, res) => {
    const items = readData();
    const item = items.find(item => item.id === parseInt(req.params.id));
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({message: 'Item not found'});
    }
});

router.post('/', upload.single('photo'), (req, res) => {
    const items = readData();
    const newItem: Item = {
        id: items.length > 0 ? items[items.length - 1].id + 1 : 1,
        categoryId: req.body.categoryId,
        locationId: req.body.locationId,
        name: req.body.name,
        description: req.body.description || '',
        photo: req.file ? req.file.path.replace(/\\/g, '/') : '',
        dateAdded: new Date().toISOString()
    };
    items.push(newItem);
    writeData(items);
    res.status(201).json(newItem);
});

router.delete('/:id', (req, res) => {
    let items = readData();
    const itemIndex = items.findIndex(item => item.id === parseInt(req.params.id));
    if (itemIndex !== -1) {
        items.splice(itemIndex, 1);
        writeData(items);
        res.json({message: 'Item deleted'});
    } else {
        res.status(404).json({message: 'Item not found'});
    }
});

router.put('/:id', upload.single('photo'), (req, res) => {
    let items = readData();
    const itemIndex = items.findIndex(item => item.id === parseInt(req.params.id));
    if (itemIndex !== -1) {
        items[itemIndex].categoryId = req.body.categoryId;
        items[itemIndex].locationId = req.body.locationId;
        items[itemIndex].name = req.body.name;
        items[itemIndex].description = req.body.description || '';
        if (req.file) {
            items[itemIndex].photo = req.file.path.replace(/\\/g, '/');
        }
        items[itemIndex].dateAdded = new Date().toISOString();
        writeData(items);
        res.json(items[itemIndex]);
    } else {
        res.status(404).json({message: 'Item not found'});
    }
});

export default router;