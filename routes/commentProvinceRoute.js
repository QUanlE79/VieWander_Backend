import commentModel from "../model/comment_provinceSchema.js";
import express from 'express'
import userModel from '../model/userSchema.js';

const Router = express.Router();

Router.get("/count", async (req, res) => {
  try {
    const result = await commentModel.count({}).exec()
    res.json({
      code: "200",
      message: "OK",
      data: result
    });
  } catch (er) {
    console.log(er)
    res.json({
      code: "404",
      message: "NOT FOUND",
    });
  }
})
Router.get("/:id", async (req, res) => {
  try {
    const provinceId = req.params.id
    let result = await commentModel.find({ province_id: provinceId }).exec();
    const sum_rating = result.reduce((remider, currentCmt) => remider + currentCmt.rating, 0)
    const rating_average = (sum_rating / result.length).toFixed(1)
    for (let comment of result) {
      let user = await userModel.findOne({ _id: comment.author_id }).exec();
      comment.name = user.name;
    }
    console.log('result', result)
    res.json({
      code: "200",
      message: "OK",
      data: {
        comments: result, rating_average
      }
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
    const { province_id, author_id, content, rating } = req.body;

    const filter = { province_id, author_id };
    const update = { content, rating };
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