import { GraphQLServer } from 'graphql-yoga';

// String, Boolean, Int, Float, ID
// Type definitions

// Demo user data
const users = [
  {
    id: '1',
    name: 'Kathy',
    email: 'kathy@example.com',
    age: 42
  },
  {
    id: '2',
    name: 'Sydney',
    email: 'sydney@example.com',
    age: 9
  },
  {
  id: '3',
  name: 'David',
  email: 'sydney@example.com'
  }
];

const posts = [
  {
    id: '1',
    title: 'GraphQL',
    body: 'The body of my awesome post.',
    published: true,
    author: '1'
  },
  {
    id: '2',
    title: 'Mongo DB',
    body: 'The body of my even better post',
    published: false,
    author: '1'
  },
  {
    id: '3',
    title: 'Progressive Web Apps',
    body: 'Learning about react native was great',
    published: false,
    author: '2'
  }
]

const comments = [
  {
    id: '1',
    text: 'Comment number 1',
    author: '3',
    post: '3'
  },
  {
    id: '2',
    text: 'Comment number 2',
    author: '2',
    post: '3'
  },
  {
    id: '3',
    text: 'Comment number 3',
    author: '2',
    post: '1'
  },
  {
    id: '4',
    text: 'Comment number 4',
    author: '1',
    post: '1'
  },
]

const typeDefs = `
  type Query {
    users(query: String): [User]!
    posts(query: String): [Post]!
    me: User!
    post: Post!
    comments: [Comment]!
  }
  
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
  
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean
    author: User!
    comments: [Comment!]
  }
  
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`

// Resolver function
const resolvers = {
  Query: {
    me() {
      return {
        id: '123098',
        name: 'Katherine',
        email: 'kathy@example.com',
        age: 42
      }
    },
    post() {
      return {
        id: '145983',
        title: 'My New Post',
        body: 'The body of my awesome post.',
        published: true
      }
    },
    users(parent, args) {
      const {query} = args
      return query ? users.filter(u => u.name.toLowerCase().includes(query.toLowerCase())) : users
    },
    posts(parent, args) { // additional params are ctx and info
      const {query} = args
      return query ? posts.filter(p => {
        return p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.body.toLowerCase().includes(query.toLowerCase())
      }) : posts
    },
    comments() {
      return comments
    }
  },
  Post: {
    author(parent) {
      const { author } = parent
      return users.find(({id}) => id === author)
    },
    comments(parent) {
      const { id } = parent
      return comments.filter(({post}) => post === id)
    }
    
  },
  Comment: {
    author(parent) {
      const { author } = parent
      return users.find(({id}) => id === author)
    },
    post(parent) {
      const { post } = parent
      return posts.find(({id}) => id === post)
    }
  },
  User: {
    posts(parent) {
      const { id } = parent
      return posts.filter(({author}) => author === id)
    },
    comments(parent) {
      const { id } = parent
      return comments.filter(({author}) => author === id)
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start()
      .then(() => console.log('The server is up!'))
