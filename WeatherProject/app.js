const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  // req.body.cityName;

  const query = req.body.cityName;
  const units = "metric";
  const apiKey = "4c69229d5b5abb35371d28fec9cbc2c9";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&units=" +
    units +
    "&appid=" +
    apiKey;

  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgurl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<p>The weather is currently " + description + "</p>");
      res.write("<h1>Temp is " + temp + "</h1>");
      res.write("<img src=" + imgurl + ">");

      res.send();
    });
  });
});

app.listen(1000, function () {
  console.log("Server running on port 1000");
});
