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
    author: '2'
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

const db = {
  users,
  posts,
  comments
}

export { db as default }
