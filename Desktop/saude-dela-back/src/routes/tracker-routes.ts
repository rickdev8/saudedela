// routes/tracker.routes.ts
import { FastifyInstance } from "fastify"
import { authGuard } from "../middlewares/auth-token"
import { createEntry, listEntries } from "../controllers/tracker.controller"

export async function trackerRoutes(app: FastifyInstance) {
  app.addHook("onRequest", authGuard)

  app.post("/tracker/entries", createEntry)
  app.get("/tracker/entries", listEntries)
}