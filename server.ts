import express from 'express';
const app = express();
const port = 8000;
app.use(express.json());
import categoriesRoute from './routes/categories';
import locationsRoute from './routes/locations';
import itemsRoute from './routes/items';

app.use('/categories', categoriesRoute);
app.use('/locations', locationsRoute);
app.use('/items', itemsRoute);
app.listen(port, () => {
    console.log(`Server running on - http://localhost:${port}`);
});