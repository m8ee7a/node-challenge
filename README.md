# Node.js Senior Developer Challenge

## Overview

This challenge simulates a real-world scenario at our organization: migrating legacy ColdFusion services to our modern Node.js/TypeScript stack. You are tasked with replicating a specific endpoint while ensuring data integrity and professional code standards.

## The Mission

Replicate the legacy `GET /services/get_order.cfm?id={id}` endpoint in this Express application. The legacy system returns inconsistent data types (strings
instead of numbers/booleans) that must be sanitized.

### Legacy Sample Response

```json
{
  "ORD_ID": 5501,
  "TOTAL_AMT": "125.50",
  "IS_SETTLED": "1",
  "SHIP_DATE": "2026-04-16"
}
```

## Quick Start

1. Prerequisites

- Node.js (v16 or higher)
- npm or yarn

2. Installation

```shell
npm install
```

3. Running the application

We use ts-node to run the TypeScript files directly during development:

```shell
npx nodemon --exec ts-node index.ts
```

The server will start on `http://localhost:3000`.

## Available Endpoints

- `POST /api/orders` - (Example provided) Demonstrates Zod validation for request bodies.
- `GET /api/orders/:id` - (Your task) Replicate the legacy order retrieval logic.

## Developer Notes

Our legacy documentation is incomplete. As a Senior Developer, we expect you to:

- Infer the Schema: Decide how the legacy types should be represented in a modern TypeScript interface.
- Improve the Contract: Do not blindly return the legacy keys. Optimize the response for our React frontend.
- Handle the "False Success": The legacy system sometimes returns a 200 OK even if the record is missing, but with an empty body. Ensure your implementation is more robust.

## Evaluation Criteria

- Schema Safety: Use of Zod for runtime validation and type coercion.
- Resourcefulness: Handling edge cases (e.g., 404s, invalid IDs).
- Code Quality: Transforming legacy `UPPER_SNAKE_CASE` keys to modern `camelCase`.
- Self-Sufficiency: Ability to infer requirements from a thin brief.
