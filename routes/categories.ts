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
