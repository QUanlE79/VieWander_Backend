import landmarkModel from "../model/landmarkSchema.js";
import provinceModel from "../model/provincesSchema.js";
import express from 'express'

const Router = express.Router();

Router.get("/count",async (req,res)=>{
    try{
        const result = await provinceModel.count({}).exec()
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
      const result = await provinceModel.find({}).exec();
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
      const result = await provinceModel.find({_id: req.params.id}).exec();
      const count = await landmarkModel.countDocuments({ province_id: req.params.id }).exec();
      const updatedResult = [...result, { totalLandmark: count }];
      result.add({totalLandmark: count})
      res.json({
        code: "200",
        message: "OK",
        data: updatedResult
      });
    } catch (error) {
      console.log(error);
      res.json({
        code: "404",
        message: "NOT FOUND"
      });
    }
});
Router.post("/create",async (req,res)=>{
    try{
        const province = new provinceModel(req.body)      
        const result = await province.save()
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
Router.post("/update",async (req,res, next)=>{ //...?id=
    try{
        const id = req.query.id;
        const province = await provinceModel.findById(id);
        if (!province) {
            res.json({
                code: "404",
                message: "NOT FOUND"
            });
            next()
        }
        Object.assign(province, req.body);
        const result = await province.save()
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
        const delProvince = await provinceModel.findOneAndDelete({ _id: id });
        if (!delProvince) {
            res.json({
                code: "404",
                message: "NOT FOUND"
            });
            next()
        }
        res.json({
            code: "200",
            message: "OK",
            data: delProvince
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