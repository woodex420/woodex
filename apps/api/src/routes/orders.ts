import { Router } from 'express'
import { supabase } from '../lib/supabase.js'

export const ordersRouter = Router()

ordersRouter.get('/', async (_req, res, next) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (error) throw error
    res.json({ data: data || [], count: data?.length || 0 })
  } catch (error) {
    next(error)
  }
})

ordersRouter.get('/:id', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle()

    if (error) throw error
    res.json({ data })
  } catch (error) {
    next(error)
  }
})

ordersRouter.post('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase.from('orders').insert(req.body).select().single()
    if (error) throw error
    res.status(201).json({ data })
  } catch (error) {
    next(error)
  }
})
