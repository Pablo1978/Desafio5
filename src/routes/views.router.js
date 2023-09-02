import { Router } from "express";
//import ProductManager from "../managers/productsManager.js";
import ProductManager from "../dao/mongomanagers/productManagerMongo.js";
import { __dirname } from "../utils.js";

const pmanager = new ProductManager(__dirname + "/dao/fileManagers/db/products.json");
const router = Router();

router.get("/", async (req, res) => {
  const listaProductos = await pmanager.getProducts();
  res.render("home", { listaProductos });
});

router.get("/realTimeProducts", async (req, res) => {
  const listaProductos = await pmanager.getProducts();
  res.render("realTimeProducts", { listaProductos });

});

router.get("/chat",(req,res)=>{
  res.render("chat")
})

export default router;