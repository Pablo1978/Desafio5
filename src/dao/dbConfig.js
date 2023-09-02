import mongoose from "mongoose"

const URI="mongodb+srv://pabloeltano:tier26@cluster0.6a9bfhe.mongodb.net/ecommerce?retryWrites=true&w=majority"

await mongoose.connect(URI,{
    serverSelectionTimeoutMS:5000,
})
console.log("Base de datos conectada")


