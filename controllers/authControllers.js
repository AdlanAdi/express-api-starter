
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const prisma = new PrismaClient() 
const JWT_SECRET = process.env.JWT_SECRET 


if(!JWT_SECRET) { 
  throw new Error('Missing JWT_SECRET in environment variables')
} 

export const signup = async ( req,res) => { 
    const { email , password , name } = req.body 
     
    try { 
        const existingUser = await prisma.users.findUnique({where : {email}} ) 
        if(existingUser) {  
            return res.status(400).json({ error : 'Email already exists' })
        } 

        const hashedPassword = await bcrypt.hash(password, 10) 

        const newUser = await prisma.users.create({ 
            data:{  
                email, 
                password: hashedPassword, 
                name,
                createdAt: new Date(),
            }
        }) 
        const token = jwt.sign({userId: newUser.id}, JWT_SECRET , {expiresIn:'1h'}) 
        
        res.json({token , user:{ id: newUser.id, email: newUser.email, name: newUser.name }})
    }catch(err){  
        console.error(err) 
        res.status(500).json({ error: 'Signup failed' })
    } 
}


export const login = async (req,res) => {  
    const { email , password , name} = req.body 

    try { 
        const user = await prisma.users.findUnique({where : {email}}) 
        if(!user) { 
            return res.status(400).json({error : 'Invalid credentials'} )
        } 
        
        const isValid = await bcrypt.compare(password, user.password) 
        if(!isValid) { 
            return res.status(400).json({error : 'Invalid credentials'})
        } 

        const token = jwt.sign({userId:user.id}, JWT_SECRET , {expiresIn :'1h'}) 

        res.json({token , user:{ id: user.id, email: user.email, name: user.name }})

    }catch(err) { 
        console.error(err) 
        res.status(500).json({ error: 'Login failed' })
    }
}