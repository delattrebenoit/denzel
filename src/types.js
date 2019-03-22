const {
    GraphQLObjectType,    
    GraphQLString,
    GraphQLInt
} = require('graphql');

movieType = new GraphQLObjectType({
    name: 'Movie',
    fields: {
        _id: { type: GraphQLString },
        link:{type: GraphQLString},
        id:{type:GraphQLString},
        metascore:{type:GraphQLString},
        poster:{type:GraphQLString},
        rating:{type:GraphQLInt},
        synopsis:{type:GraphQLString},
        title:{type:GraphQLString},
        votes:{type:GraphQLInt},
        year: { type: GraphQLInt }
    }
});

exports.movieType = movieType;