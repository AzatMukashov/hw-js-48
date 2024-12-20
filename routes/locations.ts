import express from "express";
import fs from "fs";
const router = express.Router();
const locationsFile = './data/locations.json';

interface Location {
    id: number;
    name: string;
    description?: string;
}

const readData = (): Location[] => {
    const data = fs.readFileSync(locationsFile, 'utf8');
    return JSON.parse(data) as Location[];
}
const writeData = (data: Location[]) => {
    fs.writeFileSync(locationsFile, JSON.stringify(data, null, 2));
}

router.get('/', (_req, res) => {
    const locations = readData();
    res.json(locations.map(loc => ({id: loc.id, name: loc.name})));
});
router.get('/:id', (req, res) => {
    const locations = readData();
    const location = locations.find(loc => loc.id === parseInt(req.params.id));
    if (location) {
        res.json(location);
    } else {
        res.status(404).json({message: 'Location not found'});
    }
});

router.post('/', (req, res) => {
    const locations = readData();
    const newLocation: Location = {
        id: locations.length > 0 ? locations[locations.length - 1].id + 1 : 1,
        name: req.body.name,
        description: req.body.description || ''
    };
    locations.push(newLocation);
    writeData(locations);
    res.status(201).json(newLocation);
});

router.delete('/:id', (req, res) => {
    let locations = readData();
    const locationIndex = locations.findIndex(loc => loc.id === parseInt(req.params.id));
    if (locationIndex !== -1) {
        locations.splice(locationIndex, 1);
        writeData(locations);
        res.json({message: 'Location deleted'});
    } else {
        res.status(404).json({message: 'Location not found'});
    }
});

router.put('/:id', (req, res) => {
    let locations = readData();
    const locationIndex = locations.findIndex(loc => loc.id === parseInt(req.params.id));
    if (locationIndex !== -1) {
        locations[locationIndex].name = req.body.name;
        locations[locationIndex].description = req.body.description || '';
        writeData(locations);
        res.json(locations[locationIndex]);
    } else {
        res.status(404).json({message: 'Location not found'});
    }
});

export default router;