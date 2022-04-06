const router = require("express").Router();
const product = require ("../models/product");
const {verifyToken} = require("../validation");


// CRUD operations


// Create product -- post
// router.post("/", verifyToken,(req, res) => { //verifyToken route
router.post("/", (req, res) => { //verifyToken route
    data = req.body; //data is parsed in json, we need to add in the server.js file
    product.insertMany(data)
    .then(data=> {res.status(201).send(data);})
    .catch(err=> {res.status(500).send ({message: err.message})})
});
// /api/products
// Read all products -- get
// router.get("/", (req, res) => {
//     product.find() //allows to get all the entries of the product collection
//     .then(data=> {res.send(data);})
//     .catch(err=> {res.status(500).send ({message: err.message})})
// });


//Read all products (get)
router.get("/", (req, res) => {
    product.find() //allows to get all the entries of the product collection
    .then(data=> {
        res.send(mapArray(data));
    })

    .catch(err=> {res.status(500).send ({message: err.message})})
});

//Read all products in stock -- get. If we put this route below /:id. The api will search for a /instock id
router.get("/instock", (req, res) => {
    product.findById({ inStock: true}) 
    .then(data=> {res.send(data);})
    .catch(err=> {res.status(500).send ({message: err.message})})
});

//FALTA INSTOCK

router.get("/price/:operator/:price", (req, res) => {
    
    
    
    const operator = req.params.operator;
    const price = req.params.price;

    let filterExpr = {$gte: req.params.price}; //greater than $gte (mongo)

    if(operator == "gt") //we pass the parameter in the url
        filterExpr = {$gte: req.params.price};

    product.find({ price: filterExpr})
    .then(data => {res.send(data)})
    .catch(err=>{res.status(500).send({message: err.message})})
})

//Read specific product -- get
router.get("/:id", (req, res) => {
    product.findById(req.params.id) 
    .then(data=> {res.send(data);})
    .catch(err=> {res.status(500).send ({message: err.message})})
});


//Update specific product -- put

router.put("/:id", (req, res) => {
    const id = req.params.id;

    product.findByIdAndUpdate(id, req.body) 
    .then(data=> {
        if(!data) //if mongoose wasnt able to find data/the product we were looking for
        {
            res.status(404).send({message: "Cannot update product with id="+ id +". Maybe product was not found!"})
        } 
        else
        {
            res.send({message: "Product was successfully updated."}) //if we have data
        }
    })
    .catch(err=> {res.status(500).send ({message: "Error updating product with id="+id})})
});



//Delete specific product -- delete


router.delete("/:id",verifyToken, (req, res) => {
    const id = req.params.id;

    product.findByIdAndDelete(id) //doesn't need to have the body, only needs the id
    .then(data=> {
        if(!data) //if mongoose wasnt able to find data/the product we were looking for
        {
            res.status(404).send({message: "Cannot update product with id="+ id +". Maybe product was not found!"})
        } 
        else
        {
            res.send({message: "Product was successfully updated."}) //if we have data
        }
    })
    .catch(err=> {res.status(500).send ({message: "Error updating product with id="+id})})
});


//Function to display links

function mapArray(arr) {
    let outputArr = arr.map (element =>(
        {
            id:element._id,
            name: element.name,
            description: element.description,
            price: element.price,
            instock: element.inStock,
            //link url
            uri: `/api/products/${element.id}`,
            uri2: "/api/prodcuts" + element._id
        }
    ));

    return outputArr;
}

module.exports = router;