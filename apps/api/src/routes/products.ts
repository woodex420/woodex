import { Router } from 'express'
import { supabase } from '../lib/supabase.js'

export const productsRouter = Router()

productsRouter.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (error) throw error
    res.json({ data: data || [], count: data?.length || 0 })
  } catch (error) {
    next(error)
  }
})

productsRouter.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle()

    if (error) throw error
    res.json({ data })
  } catch (error) {
    next(error)
  }
})
