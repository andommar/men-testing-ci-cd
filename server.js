const express = require("express");
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const app = express();
const {verifyToken} = require("./validation");

//swagger dep
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

//setup swagger
const swaggerDefinition = yaml.load('./swagger.yaml');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

//import routes
const productRoutes = require ("./routes/product");
const authRoutes = require ("./routes/auth");

require("dotenv-flow").config();

// parse request of content type JSON
app.use(express.json());
//app.use(bodyParser.json()); //we enabled the app to parse in json



mongoose
  .connect(process.env.DBHOST, {
    useUnifiedTopology: true, //Adittional parameters to avoid warnings from MongoDB
    useNewUrlParser: true,
  })
  .catch((error) => console.log("Error connectiong to MongoDB:" + error)); //if there's error trying to connect to mongo. E.g: dbuser22

mongoose.connection.once("open", () =>
  console.log("Conected succesfully to MongoDB")
);


//routes
app.get("/api/welcome", (req, res) => {
  res.status(200).send({ message: "Welcome to the MEN RESTful API" });
});

//post, put, delete ->CRUD
app.use("/api/products", productRoutes);
app.use("/api/user", authRoutes);

const PORT = process.env.PORT || 4000; //if there's no setting it will run 4000
app.listen(PORT, function () {
  console.log("Server is running on port: " + PORT);
});

module.exports = app;
