const { Comment, Pizza } = require('../models');

const commentController = {
  // add comment to pizza
  async addComment({ params, body }, res) {
    try {
      console.log(params);
      const { _id } = await Comment.create(body);
      let dbPizzaData = await Pizza.findOneAndUpdate(
        { _id: params.pizzaId },
        { $push: { comments: _id } },
        { new: true }
      );
      console.log(dbPizzaData);
      if (!dbPizzaData) {
        res.status(404).json({ message: 'No pizza found with this id!' });
        return;
      }
      dbPizzaData = await dbPizzaData.populate({
        path: 'comments',
        select: '-__v'
      });
      res.json(dbPizzaData);
    } catch (err) {
      res.json(err);
    }
  },

  // add reply to comment
  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true, runValidators: true }
    )
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },

  // remove comment
  async removeComment({ params }, res) {
    try {
      const deletedComment = await Comment.findOneAndDelete({ _id: params.commentId })
      if (!deletedComment) {
        return res.status(404).json({ message: 'No comment with this id!' });
      }
      let dbPizzaData = await Pizza.findOneAndUpdate(
        { _id: params.pizzaId },
        { $pull: { comments: params.commentId } },
        { new: true },
      );
      if (!dbPizzaData) {
        res.status(404).json({ message: 'No pizza found with this id!' });
        return;
      }
      dbPizzaData = await dbPizzaData.populate({
        path: 'comments',
        select: '-__v'
      })
      console.log(dbPizzaData);
      res.json(dbPizzaData);
    } catch (err) {
      res.json(err);
    }
  },
  // remove reply
  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then(dbPizzaData => {
        console.log(dbPizzaData);
        res.json(dbPizzaData)
      })
      .catch(err => res.json(err));
  }
};

module.exports = commentController;
