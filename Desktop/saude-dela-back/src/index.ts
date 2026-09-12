import fastify, { FastifyReply, FastifyRequest } from "fastify"

const app = fastify()

app.get("/", (request: FastifyRequest, reply: FastifyReply) => {
    reply.send({status: "Funcionando"})
})

app.listen( {port: 3001, host: "0.0.0.0" }, () => {
    console.log("Servidor rodando!")
})