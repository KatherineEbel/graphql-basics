import { GraphQLServer, PubSub } from 'graphql-yoga'
import db from './db'
import * as resolvers from './resolvers'

const pubsub = new PubSub()
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    db,
    pubsub
  }
})

server.start()
      .then(() => console.log('The server is up!'))
