// Объявление всех модулей, которые будут использоваться в данном проекте
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
const https = require("https");

const app = express();

//модели постов и сообщений
const Post = require("./models/post");
const Message = require("./models/message");


//Контент, который будет использован на некоторых страницах блога
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Здесь мы можете написать мне, используя контакт-форму.";

// Устанавливаю 'view engine' для конвертации Embedded JavaScript templates в HTML
app.set('view engine', 'ejs');
// Устанавливаю bodyParser  (пакет body-parser понадобится для чтения данных, которые отправляются в запросе POST)
app.use(bodyParser.urlencoded({
  extended: true
}));
// Добавляю папку "public" как статический ресурс
app.use(express.static("public"));
// Использую БД mongodb для данного блога, там будут храниться все посты и сообщения, оставленные пользователями
mongoose.connect("mongodb+srv://admin1:blog123@cluster0.28pia.mongodb.net/blogDB", {
    useNewUrlParser: true
  })
  .then(() => console.log('Database Connection Successful!!'))
  .catch(err => console.error(err));

//Главная
app.get("/", function(req, res) {
  //Отображаю все посты на Главной странице сайта
  Post.find({}, function(err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
    });
  });
});

//Создаю страницу "Новый пост"
app.get("/compose", function(req, res) {
  res.render("compose");
});

//На странице "Новый пост" с помощью body-parser сохраняю в БД введенные заголовок и тело поста
app.post("/compose", function(req, res) {

  const post = new Post({
    title: req.body.inputTitle,
    content: req.body.inputContent
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    } else {
      console.log(err)
    }
  });
});

////Создаю страницу для каждого поста по его id
app.get("/posts/:postId", function(req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({
    _id: requestedPostId
  }, function(err, post) {
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.post("/contact", function(req, res) {
  //На странице "Для связи" создаю новое сообщение, использую схему для сообщений
  const message = new Message({
    email: req.body.inputEmail,
    name: req.body.inputName,
    messageText: req.body.inputMessage
  });
  //Сохраняю новое сообщение, если нет ошибок, перенаправление на страницу "Для связи"
  message.save(function(err) {
    if (!err) {
      res.redirect("/contact");
    }
  });
});


//Создаю страницу "Обо мне", добавляю туда контент
app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});
//Создаю страницу "Для связи"
app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

//Запускаю сервер на localhost:3000
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
// Если сервер запущен успешно, вывожу соответствующее сообщение в консоли
app.listen(port, function() {
  console.log("Server has started successfully");
});
