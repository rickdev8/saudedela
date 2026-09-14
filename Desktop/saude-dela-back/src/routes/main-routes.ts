// routes/auth.routes.ts
import { FastifyInstance } from "fastify"
import { Login, Me} from "../controllers/auth-login-controller"
import { Register } from "../controllers/auth-register-controller"
import { authGuard } from "../middlewares/auth-token"

export function authRoutes(app: FastifyInstance) {
  app.post("/register", Register) 
  app.post("/login", Login)
  app.get("/acompanhe-se", { preHandler: authGuard }, Me)      
}