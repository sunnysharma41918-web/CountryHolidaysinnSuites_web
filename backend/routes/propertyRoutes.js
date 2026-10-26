import express from 'express'
import {
  getPublicProperties,
  getPublicPropertyBySlugOrId,
} from '../controllers/propertyController.js'

const router = express.Router()

router.get('/', getPublicProperties)
router.get('/:slugOrId', getPublicPropertyBySlugOrId)

export default router
