const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = 
{
    // Get all thoughts query
    getThoughts(req, res)
    {
        Thought.find().select('-__v')
            .then((thought) => res.status(200).json(thought))
            .catch((err) => res.status(500).json(err));
    },
    // Get single thought by ID query
    getSingleThought(req, res)
    {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No thought found with that ID!'})
                    : res.status(200).json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Create a new thought with associated user through ID query
    createThought(req, res)
    {
        Thought.create(req.body)
            .then((thought) => 
                !thought
                    ? res.status(404).json({ message: 'Could not create thought!'})
                    : User.findOneAndUpdate(
                        { _id: req.body.userId },
                        { $addToSet: { thoughts: thought._id }},
                        { new: true },
                    ).select('-__v')
                    .then((thought) => 
                        !thought
                            ? res.status(404).json({ message: 'No user found with that ID!'})
                            : res.status(200).json(thought)
                    )
            )         
            .catch((err) => 
            {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Update an existing thiught through ID query
    updateThought(req, res)
    {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { new: true, runValidators: true },
        )
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'No thought with that ID!'})
                : res.status(200).json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Delete an exiting thought through ID query
    deleteThought(req, res)
    {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) => 
                !thought
                    ? res.status(404).json({ message: 'No thought with that ID!'})
                    : User.findOneAndUpdate(
                        { username: thought.username },
                        { $pull: { thoughts: req.params.thoughtId }},
                        { new: true },
                    )
                    .then((user) => 
                        !user   
                            ? res.status(404).json({ message: 'Thought deleted with no asociated user!'})
                            : res.status(200).json({ message: 'Thought deleted and removed from associated user'}) 
                    )   
            )
            .catch((err) => res.status(500).json(err));
    },
    // Create a reaction on an existing thought through ID query
    createReaction(req, res)
    {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: {username: req.body.username, reactionBody: req.body.reactionBody } } },
            { new: true, runValidators: true }
            )
            .then((thought) => 
                !thought
                    ? res.status(404).json({ message: 'No thought found with that ID!'})
                    : res.status(200).json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Delete an exiting reaction through ID and remove it from an existing thought through ID query
    deleteReaction(req, res)
    {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } } },
            { new: true, runValidators: true }
        )
        .then((thought) => 
            !thought
                ? res.status(404).json({ message: 'No thought found with that ID!'})
                : res.status(200).json({ message: 'Reaction deleted and removed from associated thought'})
        )
        .catch((err) => res.status(500).json(err));
    }



};