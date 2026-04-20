import express, { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

const app = express()
const PORT = 3000

app.use(express.json())

/**
 * JIRA-402: REPLICATE LEGACY ORDER API
 * ---------------------------------------------------------
 * We are decommissioning the ColdFusion 'get_order.cfm' endpoint.
 * Your task is to recreate it in this Node service.
 *
 * * LEGACY API SPEC (Based on observation):
 * - Endpoint: /services/get_order.cfm?id={id}
 * - Sample JSON Output:
 * { "ORD_ID": 5501, "TOTAL_AMT": "125.50", "IS_SETTLED": "1", "SHIP_DATE": "2026-04-16" }
 *
 * * REQUIREMENTS:
 * 1. Create a GET route `/api/orders/:id`.
 * 2. Validate the incoming data.
 * 3. Return a clean, modern JSON response to the frontend.
 * 4. Handle common edge cases (e.g., order not found).
 * ---------------------------------------------------------
 */

// --- ZOD TOOLBOX HINT ---
// const ExampleSchema = z.object({
//   id: z.coerce.number(), // Automatically converts "123" to 123
//   isActive: z.preprocess((val) => val === "1", z.boolean()) // Handles CF "1"/"0" strings
// })

// --- MOCK DATABASE (Simulating a call to your Legacy DB) ---
const fetchLegacyData = async (id: string) => {
  if (id === '404') return null
  return {
    ORD_ID: parseInt(id),
    TOTAL_AMT: '125.50', // Note: Legacy returns this as a string
    IS_SETTLED: '1', // Note: Legacy returns "1" for true, "0" for false
    SHIP_DATE: '2026-04-16',
  }
}

// --- MIDDLEWARE FACTORY (Used for request validation) ---
const validate =
  (
    schema: z.ZodSchema<unknown>,
    source: 'params' | 'query' | 'body' = 'params',
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source])
    if (!result.success)
      return res.status(400).json({ error: result.error.errors })
    res.locals.validated = result.data
    next()
  }

// --- GET / ---
app.get('/', async (_req: Request, res: Response) => {
  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Node.js Senior Developer Challenge</title>
      </head>
      <body>
        <h1>Node.js Senior Developer Challenge</h1>
        <p>Quick tests:</p>
        <ul>
          <li><a href="/api/orders/123">View order #123 — sample legacy response (expected 200)</a></li>
          <li><a href="/api/orders/404">View order #404 — simulate "order not found" (expected 404)</a></li>
        </ul>
      </body>
    </html>
  `
  return res.type('html').send(html)
})

// --- POST /orders ---
const CreateOrderSchema = z.object({
  customerName: z
    .string({
      required_error: 'Customer name is required.',
    })
    .min(3, 'Name must be at least 3 characters'),
  items: z
    .array(
      z.object({
        name: z
          .string({ required_error: 'Item name is required.' })
          .min(1, 'Item name is required.'),
        price: z.coerce
          .number({ required_error: 'Item price is required.' })
          .nonnegative('Price must be >= 0'),
      }),
      {
        required_error: 'Order must have at least one item.',
      },
    )
    .nonempty('Order must have at least one item.'),
  priority: z.enum(['low', 'high']).default('low'),
})

app.post(
  '/api/orders',
  validate(CreateOrderSchema, 'body'),
  (req: Request, res: Response) => {
    try {
      const { customerName } = req.body

      console.log('Creating order for:', customerName)

      return res.status(201).json({
        message: 'Order created successfully',
        data: req.body,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Return a 400 Bad Request with the validation errors
        return res.status(400).json({
          message: 'Validation Failed',
          errors: error.errors,
        })
      }

      // Return a 500 Internal Server Error for all other errors
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },
)

// --- CANDIDATE WORK AREA ---

app.get('/api/orders/:id', async (req: Request, res: Response) => {
  // TODO: Implement the migration logic here
})

// --- SERVER STARTUP ---
app.listen(PORT, () => {
  console.log(`Challenge running on http://localhost:${PORT}`)
})
