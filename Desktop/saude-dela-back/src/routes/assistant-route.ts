import { FastifyInstance } from "fastify"
import { ask } from "../controllers/assistant-controller"

export async function assistantRoutes(app: FastifyInstance) {
  app.post("/assistant/ask", ask)
}