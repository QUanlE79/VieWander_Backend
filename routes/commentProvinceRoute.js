import commentModel from "../model/comment_provinceSchema.js";
import express from 'express'

const Router = express.Router();

Router.get("/count",async (req,res)=>{
    try{
        const result = await commentModel.count({}).exec()
        res.json({
            code: "200",
            message: "OK",
            data: result
        });
    }catch(er){
        console.log(er)
        res.json({
            code: "404",
            message: "NOT FOUND",
        });
    }
})
Router.get("/:id", async (req, res) => {
    try {
        const landmark_id = req.params.id
        const result = await commentModel.find({province_id: landmark_id}).exec();

        const modifiedResult = result.map(doc => {
          const modifiedDoc = { ...doc.toObject() };
          modifiedDoc.name = "GPT"; // Add the desired property
          return modifiedDoc;
        });

        console.log(modifiedResult)
        res.json({
          code: "200",
          message: "OK",
          data: result
        });
    } catch (error) {
      console.log(error);
      res.json({
        code: "404",
        message: "NOT FOUND"
      });
    }
});
Router.post("/create", async (req, res) => {
    try {
      const { landmark_id, author_id, content, date_post, rating } = req.body;
  
      const filter = { landmark_id, author_id };
      const update = { content, date_post, rating };
      const options = { upsert: true, new: true };
  
      const result = await commentModel.findOneAndUpdate(filter, update, options).exec();
  
      res.json({
        code: "200",
        message: "OK",
        data: result
      });
    } catch (ex) {
      console.log(ex);
      res.json({
        code: "400",
        message: "BAD REQUEST"
      });
    }
  });
  
export default Router;