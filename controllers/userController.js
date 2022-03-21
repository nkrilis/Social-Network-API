const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = 
{
    // Get all users query
    getUsers(req, res)
    {
        User.find().select('-__v')
            .then((users) => res.status(200).json(users))
            .catch((err) => res.status(500).json(err));
    },
    // Get single user through ID query
    getSingleUser(req, res)
    {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'No user with that ID!' })
                    : res.status(200).json(user)
      )
      .catch((err) => res.status(500).json(err));
    },
    // Create a user query
    createUser(req, res)
    {
        User.create(req.body)
            .then((user) => res.status(200).json(user))
            .catch((err) => 
            {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Update an existing user through ID query
    updateUser(req, res)
    {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((user) => 
            !user
                ? res.status(404).json({ message: 'No user with that ID!'})
                : res.status(200).json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Delete an exiting user through ID and all associated thoughts through ID query
    deleteUser(req, res)
    {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) => 
                !user
                    ? res.status(404).json({ message: 'No user with that ID!' })
                    : Thought.deleteMany({ _id: { $in: user.thoughts } })
            )
            .then(() => res.status(200).json({ message: 'User and associated thoughts deleted!' }))
            .catch((err) => res.status(500).json(err));
    },
    // Add a friend to an existing user query
    addFriend(req, res)
    {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { new: true, runValidators: true },
        )
        .then((user) => 
            !user
                ? res.status(404).json({ message: 'No user with that ID!'})
                : res.json({ user, message: 'Friend added successfully!'})
        )
        .catch((err) => res.status(500).json(err));
    },
    // Delete an friend from an existing user
    deleteFriend(req, res)
    {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId }},
            { new: true, runValidators: true },
        )
        .then((user) => 
            !user
                ? res.status(404).json({ message: 'No friend found with that ID!'})
                : res.status(200).json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    
};
