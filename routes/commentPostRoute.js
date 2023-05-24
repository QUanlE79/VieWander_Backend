import commentModel from "../model/comment_postChema.js";
import express from 'express'

const Router = express.Router();

Router.get("/count",async (req,res)=>{
    try{
        const result = await commentModel.count({}).exec()
        res.json({
            status: "200",
            message: "OK",
            data: result
        });
    }catch(er){
        console.log(er)
        res.json({
            status: "404",
            message: "NOT FOUND",
        });
    }
})

Router.get("/:id", async (req, res) => {
    try {
        const post_id = req.params.id
        const result = await commentModel.find({post_id}).exec();
        res.json({
            status: "200",
          message: "OK",
          data: result
        });
    } catch (error) {
      console.log(error);
      res.json({
        status: "404",
        message: error.toString()
      });
    }
});

Router.post("/create", async(req, res)=>{
    const newComment = new commentModel(req.body)
    try{
        const savedComment = await newComment.save()
        return res.json({
            status: 200,
            message: "Comment saved successfully",
            data: savedComment
        })
    }catch(err){
        return res.json({
            status: 404,
            message: err.toString(),
            data: null
        })
    }
})
export default Router;