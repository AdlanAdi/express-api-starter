import express from 'express'; 
import dotenv from 'dotenv'; 
import { deleteProduct , addProduct , getProducts } from '../controllers/productsControllers.js'; 
import { PrismaClient } from '@prisma/client'; 
dotenv.config(); 

const router = express.Router(); 

router.post('/addProduct', addProduct);
router.delete('/:id', deleteProduct);
router.get('/getAllProducts', getProducts);

export default router;