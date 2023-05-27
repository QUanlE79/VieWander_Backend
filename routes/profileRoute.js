import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js';
import userModel from '../model/userSchema.js';

const Router = express.Router();
Router.get('/getAll', async (req, res) => {
    try {
        let users = await userModel.find()
        users = users.map((user) => {
            const { password, ...otherDetails } = user._doc
            return otherDetails
        })
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json(error)
    }
})
Router.put('/follow/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;

    const { _id } = req.body;


    try {
        const followUser = await userModel.findById(id)
        const followingUser = await userModel.findById(_id)
        if (!followUser.follower.includes(_id)) {
            await followUser.updateOne({ $push: { follower: _id } })
            await followingUser.updateOne({ $push: { follow: id } })
            res.status(200).json("User followed")
        } else {
            res.status(403).json("User is Already followed by you")
        }

    } catch (error) {
        res.status(500).json(error)
    }

})
Router.put('/unfollow/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    const { _id } = req.body;

    try {
        const followUser = await userModel.findById(id)
        const followingUser = await userModel.findById(_id)
        if (!followUser.follower.includes(_id)) {
            await followUser.updateOne({ $pull: { follower: _id } })
            await followingUser.updateOne({ $pull: { follow: id } })
            res.status(200).json("User Unfollowed")
        } else {
            res.status(403).json("User is not followed by you")
        }

    } catch (error) {
        res.status(500).json(error)
    }

})
export default Router;