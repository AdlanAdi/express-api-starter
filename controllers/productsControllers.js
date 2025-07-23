import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient(); 


export const addProduct = async (req, res) => { 
  const {name , price , stock , category_id} = req.body; 

  try { 
    const newProduct = await prisma.products.create({ 
      data : { 
        name,  
        price: parseFloat(price), 
        stock: parseInt(stock), 
        category_id: parseInt(category_id)
      }
    })

    res.status(201).json({
      message: 'Product added successfully',
      product: newProduct,
    });

  }catch(err) { 
    console.error(err); 
    return res.status(500).json({ error: 'Failed to update product' });
  }

} 


export const deleteProduct = async (req,res)=> {  
  const { id } = req.params;  

  try{  
    const result = await prisma.products.delete( { where: {id:parseInt(id)} } ) 
    res.json({ message: 'Product deleted successfully', product: result });
  } catch(err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }

    console.error(err);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
 
} 


export const getProducts = async (req , res) => {  
  try { 
    const products = await prisma.products.findMany({include : { category: true }}); 
    const formatted = products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price.toString(), // convert to string
      stock: product.stock,
      category: product.category?.name || null,
    }));

    res.json(formatted);
  }catch(err) { 
    console.error(err); 
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
}