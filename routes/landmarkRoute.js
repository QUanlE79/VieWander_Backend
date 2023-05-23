import landmarkModel from "../model/landmarkSchema.js";
import express from 'express'

const Router = express.Router();

Router.get("/total",async (req,res)=>{
    try{
        const result = await landmarkModel.count({}).exec()
        res.json({
            code: "200",
            message: "OK",
            data: result
        });
    }catch(er){
        console.log(er)
        res.json({
            code: "400",
            message: "BAD REQUEST"
        });
    }
})
Router.get("/", async (req, res) => {
    try {
      const result = await landmarkModel.find({}).exec();
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

Router.get("/:id", async (req, res) => {
    try {
      const result = await landmarkModel.find({_id: req.params.id}).exec();
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
Router.post("/add",async (req,res)=>{
    try{
        const landmark = new landmarkModel(req.body)      
        const result = await landmark.save()
        res.json({
            code: "200",
            message: "OK",
            data: result
        });
    }catch(ex){
        console.log(ex);
        res.json({
            code: "400",
            message: "BAD REQUEST"
        });
    }
})
Router.post("/edit",async (req,res, next)=>{ //...?id=
    try{
        const id = req.query.id;
        const landmark = await landmarkModel.findById(id);
        if (!landmark) {
            res.json({
                code: "404",
                message: "NOT FOUND"
            });
            next()
        }
        Object.assign(landmark, req.body);
        const result = await landmark.save()
        res.json({
            code: "200",
            message: "OK",
            data: result
        });
    }catch(ex){
        console.log(ex);
        res.json({
            code: "400",
            message: "BAD REQUEST"
        });
    }
})
Router.post("/delete",async (req,res)=>{
    try{
        const id = req.query.id;
        const deletedLandmark = await productModel.findOneAndDelete({ _id: id });
        if (!deletedLandmark) {
            res.json({
                code: "404",
                message: "NOT FOUND"
            });
            next()
        }
        res.json({
            code: "200",
            message: "OK",
            data: deletedLandmark
        });
    }catch(ex){
        console.log(ex);
        res.json({
            code: "400",
            message: "BAD REQUEST"
        });
    }
})
export default Router;