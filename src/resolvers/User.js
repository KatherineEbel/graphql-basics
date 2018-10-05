export default {
    posts(parent, args, { db }) {
      const { id } = parent
      let { posts } = db
      return posts.filter(({author}) => author === id)
    },
    comments(parent, args, { db }) {
      const { id } = parent
      let { comments } = db
      return comments.filter(({author}) => author === id)
    }
}