
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql');
const { movieType } = require('./types.js');
const _=require('lodash');

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {

        movieID: {
            type: movieType,
            
            args: {
                id: { type: GraphQLString }
            },
            resolve: function (source, args) {
               console.log(args.id);
                return _.find(collectionMovie,{id:args.id});
            }
        },
        movie: {
            type: new GraphQLList(movieType) ,            
            resolve: function (source, args) {              
                return _.filter(collectionMovie,{metascore:70});
            }
        }        
    }
});

exports.queryType = queryType;