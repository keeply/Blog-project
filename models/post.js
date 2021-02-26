const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Создаю cхему для постов в блоге. Каждый пост будет состоять из заголовка и контента.
const postSchema = Schema(
  {
    title: {
      type: String,
    },
    content: String
  },
    {
      timestamps: true
    });

//Используя конструктор схемы, создаю новый пост.
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
