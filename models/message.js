const mongoose = require('mongoose');

//Создаю cхему для сообщений, которые можно оставить на странице "Для связи".
//Каждое сообщение будет состоять из эл.почты, имени и самого сообщения.
const messageSchema = {
  email: String,
  name: String,
  messageText: String
};

//Используя конструктор схемы, создаю новое сообщение.
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
