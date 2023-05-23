import _ from "./config/conf.js"
import  express  from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js"
import profileRoute from "./routes/profileRoute.js"
import provinceRoute from "./routes/provinceRoute.js"
import landmarkRoute from "./routes/landmarkRoute.js"
import postRoute from "./routes/postRoute.js"
import commentProvinceRoute from "./routes/commentProvinceRoute.js"
import commentDetailRoute from "./routes/commentDetailRoute.js"
import commentPostRoute from "./routes/commentPostRoute.js"
const app = express()

try{
  await mongoose.connect(process.env.DB_CONNECTION_STR, {useUnifiedTopology: true, useNewUrlParser: true})
  console.log("Database connected...")
}catch(e){
  console.log("Error connected database")
  console.log(e)
  process.exit(-1)
}
app.use(morgan('dev'))
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/auth', authRoute)
app.use('/profile', profileRoute)
app.use('/province', provinceRoute)
app.use('/landmark', landmarkRoute)
app.use('/post',postRoute)
app.use('/comment-province', commentProvinceRoute)
app.use('/comment-landmark', commentDetailRoute)
app.use('/comment-post', commentPostRoute)

app.listen(process.env.PORT, () => {
  console.log(`VieWander backend http://127.0.0.1:${process.env.PORT}`)
})
