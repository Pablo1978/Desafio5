import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
//import ProductManager from "./managers/productsManager.js";
import { __dirname } from "./utils.js";
import "./dao/dbConfig.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);


app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

//const pmanager = new ProductManager(__dirname + "/dao/fileManagers/db/products.json");
const socketServer = new Server(httpServer);

import ProductManager from "./dao/mongomanagers/productManagerMongo.js"
const pmanagersocket=new ProductManager()

import MessagesManager from "./dao/mongomanagers/messageManagerMongo.js";
const messagesManager = new MessagesManager();


socketServer.on("connection", async (socket) => {
    console.log("Cliente conectado con id: ", socket.id);

    const listProducts = await pmanagersocket.getProducts({});
    socketServer.emit("sendProducts", listProducts);

    socket.on("addProduct", async (obj) => {
        await pmanagersocket.addProduct(obj);
        const listProducts = await pmanagersocket.getProducts({});
        socketServer.emit("sendProducts", listProducts);
    });

    socket.on("deleteProduct", async (id) => {
        await pmanagersocket.deleteProduct(id);
        const listProducts = await pmanagersocket.getProducts({});
        socketServer.emit("sendProducts", listProducts);
    });

    socket.on("nuevousuario",(usuario)=>{
            console.log("usuario" ,usuario)
            socket.broadcast.emit("broadcast",usuario)
           })
           socket.on("disconnect",()=>{
               console.log(`Usuario con ID : ${socket.id} esta desconectado `)
           })
       
           socket.on("mensaje", async (info) => {
            console.log(info)
            await messagesManager.createMessage(info);
            socketServer.emit("chat", await messagesManager.getMessages());
          });
});

