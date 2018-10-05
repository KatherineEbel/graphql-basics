export default {
    users(parent, args, { db }) {
      const {query} = args
      const { users } = db
      return query
        ? users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()))
        : users
    },
    posts(parent, args, { db }) { // additional params are ctx and info
      const {query} = args
      const { posts } = db
      return query ? posts.filter(p => {
        return p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.body.toLowerCase().includes(query.toLowerCase())
      }) : posts
    },
    comments(parent, args, { db }) {
      const { comments } = db
      return comments
    }
}

