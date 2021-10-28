var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type RandomDie {
    """
    Number of sides for the die.
    """
    numSides: Int!

    """
    Get a random value relative to number of sides.
    """
    rollOnce: Int!

    """
    Get multiple random values relative to number of sides.
    """
    roll(numRolls: Int!): [Int]
  }

  type Query {
    """
    Roll a dice with certain number of sides, either once or multiple times.
    """
    getDie(numSides: Int): RandomDie
  }
`);

// This class implements the RandomDie GraphQL type
class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({numRolls}) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

// The root provides the top-level API endpoints
var root = {
  getDie: ({numSides}) => {
    return new RandomDie(numSides || 6);
  }
}

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4001);
console.log('Running a GraphQL API server at localhost:4001/graphql');