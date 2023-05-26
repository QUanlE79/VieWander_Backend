import postModel from "../model/postSchema.js";
import commentModel from "../model/comment_postChema.js";
import express from 'express'
import multer from "multer";
const Router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/posts")
    },
    filename: function (req, file, cb) {
        const uniqueFileName = Date.now() + '-' + req.body.author_id + ".jpeg";
        cb(null, uniqueFileName)
        req.body.image = uniqueFileName
    }
})
const upload = multer({ storage: storage })

Router.get("/total",async (req,res)=>{
    try{
        const result = await postModel.count({}).exec()
        res.json({
            status: "200",
            message: "OK",
            data: result
        });
    }catch(er){
        console.log(er)
        res.json({
            status: "400",
            message: "BAD REQUEST"
        });
    }
})

Router.get("/", async (req, res) => {
    try {
        const allPosts = await postModel.find({}).exec();
        let allPostsWithComment = []
        for (let post of allPosts){
            let comments = await commentModel.find({ post_id: post._id }).exec();
            let postUpdated = []
            for (let comment of comments) {
              let user = await userModel.findById(comment.author_id).exec();
              if (user) {
                let commentWithAuthorName = { ...comment._doc, name: user.name };
                postUpdated.push(commentWithAuthorName);
              }
            }
            allPostsWithComment.push(postUpdated)
        }
        res.json({
        status: "200",
          message: "OK",
          data: allPostsWithComment
        });
      res.json({
        status: "200",
        message: "OK",
        data: result
      });
    } catch (err) {
      console.log(err);
      res.json({
        status: "404",
        message: err.toString()
      });
    }
});

Router.get("/:id", async (req, res) => {
    try {
      const result = await postModel.find({_id: req.params.id}).exec();
      res.json({
        status: "200",
        message: "OK",
        data: result
      });
    } catch (err) {
      console.log(err);
      res.json({
        status: "404",
        message: err.toString()
      });
    }
});

Router.post("/create",upload.single('image'),async (req,res)=>{
    try{
        const newPost = new postModel(req.body)      
        const result = await newPost.save()
        res.json({
            status: "200",
            message: "OK",
            data: result
        });
    }catch(ex){
        console.log(ex);
        res.json({
            status: "400",
            message: ex.toString()
        });
    }
})

Router.post("/update",async (req,res, next)=>{ //...?id=
    try{
        const id = req.query.id;
        const post = await postModel.findById(id);
        if (!post) {
            res.json({
                status: "404",
                message: "POST NOT FOUND"
            });
            next()
        }
        Object.assign(post, req.body);
        const result = await post.save()
        res.json({
            code: "200",
            message: "OK",
            data: result
        });
    }catch(ex){
        console.log(ex);
        res.json({
            code: "400",
            message: ex.toString()
        });
    }
})

Router.post("/delete",async (req,res)=>{
    try{
        const id = req.query.id;
        const deletedPost = await postModel.findOneAndDelete({ _id: id });
        if (!deletedPost) {
            return res.json({
                status: "404",
                message: "POST NOT FOUND"
            });
        }
        res.json({
            status: "200",
            message: "OK",
            data: deletedPost
        });
    }catch(ex){
        console.log(ex);
        res.json({
            status: "400",
            message: ex.toString()
        });
    }
})

Router.post("/like/:id", async(req,res)=>{
    try {
        const post_id = req.params.id
        const author_id = req.body.author_id
        if (author_id == undefined){
            console.log(ex);
            res.json({
                status: "403",
                message: "Forbidden"
            });
            next()
        }
        const result = await postModel.updateOne({ _id: post_id }, { $inc: { num_of_like: 1 } });
        res.json({
            status: "200",
            message: "OK",
            data: result
        });
    } catch (ex) {
        console.log(ex);
        res.json({
            status: "400",
            message: ex.toString()
        });
    }
})
Router.post("/dislike/:id", async(req,res)=>{
    try {
        const post_id = req.params.id
        const author_id = req.body.author_id
        if (author_id == undefined){
            console.log(ex);
            res.json({
                status: "403",
                message: "Forbidden"
            });
            next()
        }
        const result = await postModel.updateOne({ _id: post_id }, { $dec: { num_of_like: 1 } });
        res.json({
            status: "200",
            message: "OK",
            data: result
        });
    } catch (ex) {
        console.log(ex);
        res.json({
            status: "400",
            message: ex.toString()
        });
    }
})
export default Router