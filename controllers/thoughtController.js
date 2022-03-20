const { User, Thought } = require('../models');

module.exports = 
{
    getThoughts(req, res)
    {
        Thought.find()
            .then((thought) => res.status(200).json(thought))
            .catch((err) => res.status(500).json(err));
    },

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
                    )
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

    deleteThought(req, res)
    {
        Thought.findOneAndDelete(
            { _id: req.par}
        )
    }



};