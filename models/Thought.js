const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

// Schema to create Thought model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (date) => {
                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                return date.toLocaleDateString("en-US", options);
            },
        },
        username: {
            type: String,
            required: true,
            ref: 'User',
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: 
        {
            getters: true,
            virtuals: true,
        },
        id: false,
    }
);

// Virtual to return the length of reactions array
thoughtSchema.virtual('reactionCount').get(function ()
{
    return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;