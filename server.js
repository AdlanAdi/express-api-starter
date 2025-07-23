import express from 'express';  
import dotenv from 'dotenv';  
import { Pool } from 'pg'; 
import cors from 'cors'; 
import authRouter from './routes/auth.js';  
import productsRouter from './routes/productsRoute.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PORT = 8000; 
const app = express(); 
dotenv.config();
app.use(cors());
app.use(express.json()); 


// PostgreSQL connection using Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});  




app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.id, p.name, p.price, p.stock, c.name AS category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/' , (req,res )=> { 
    res.send('Hello World!');
} )


app.use('/api/auth', authRouter)
app.use('/api/products', productsRouter);



app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`);
});