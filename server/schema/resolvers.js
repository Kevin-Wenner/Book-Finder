const {User, Book} = require('../models');
const {signToken} = require('../utils/auth');
const {AuthenticationError} = require("apollo-server-express");

const resolvers ={
    Query: {
        user: async (parent, args, contex) => {
            if(context.user){
                const userData = await User.findOne({
                    $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
                  })
                .select("-__v -password")
                .populate("books");
            }
            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: {
        saveBook: async (parent, args, context) => {
            if(context.user){
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: user._id },
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                )
            }
            return updatedUser
        },
        deleteBook: async (parent, args, contex) => {
            if(context.user){
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: user._id },
                    { $pull: { savedBooks: { bookId: params.bookId } } },
                    { new: true }
                )
            }
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne(email)
            if(!user){
                throw new AuthenticationError('No user of the username');
            }
            const correctPw = await user.isCorrectPassword(password)
            const token = signToken(user);
            return{token, user};
        },
        createUser: async (parent, arg) => {
            const user = await User.create(args);
            const token = signToken(user);
            return{token, user};
        }
    },
}

module.exports = resolvers;