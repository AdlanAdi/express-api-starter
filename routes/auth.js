import express from 'express'
import dotenv from 'dotenv'
import { signup , login } from '../controllers/authControllers.js'
dotenv.config()

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in environment variables')
}

router.post('/signup' , signup)
router.post('/login' , login ) 


export default router