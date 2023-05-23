import _ from "./config/conf.js"
import  express  from "express";
import morgan from "morgan";
import mongoose from "mongoose";
const app = express()

try{
  await mongoose.connect(process.env.DB_CONNECTION_STR, {useUnifiedTopology: true, useNewUrlParser: true})
  console.log("Database connected...")
}catch(e){
  console.log("Error connected database")
  console.log(e)
  process.exit(-1)
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})