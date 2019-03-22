
const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;

const imdb = require('./imdb');
const DENZEL_IMDB_ID = 'nm0000243';
const {GraphQLSchema} = require('graphql');
const graphqlHTTP = require('express-graphql');
const CONNECTION_URL = "mongodb+srv://ben:ben@cluster0-tqd70.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "movies";
const {queryType} = require('./query.js');
var app = Express();
const schema = new GraphQLSchema({ query: queryType });


const _=require('lodash');


app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

app.listen(9292, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("movie");
        console.log("Connected to `" + DATABASE_NAME + "`!");        
    });
})
app.get("/movies/populate", async function(request, response){      
        const movies = await imdb(DENZEL_IMDB_ID);
        collection.insertMany(movies, (err, result) => {
        if (err)return response.status(500).send(err);
        response.send('Movies imported');
    });
});

app.get('/movies/:id', (request, response)=>{
    collection.findOne({'id': request.params.id},(err, result)=>{
      if(err) return response.sendStatus(500).send(err);      
      response.send(result);
    });
  })

  app.get("/movies/search", (request, response) => {
    req=request.query;
    var metascore=parseInt(req.metascore)
    var limit=parseInt(req.limit)
    console.log(req.limit);
    collection.find({"metascore":{$gte:metascore}}).limit(limit).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get("/movies", (request, response) => {

    collection.aggregate([
            { $match: { metascore: { $gte: 70 } } },
            { $sample: { size: 1 } }
        ]).toArray((err, result) => {
            if (err)return response.status(500).send(err);
            response.send(result);
        });
});

app.post('/movies/:id', (request, response)=>{
	collection.updateOne({'id': request.params.id}, {$set:{date : request.body.date, review : request.body.review}}, (err, result)=>{
		if(err) return response.sendStatus(500).send(err);
		response.send(result);
	});
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    context:collection,
    graphiql: true,
    
}));

