export default {
    author(parent, args, { db }) {
      const { author } = parent
      let { users } = db
      return users.find(({id}) => id === author)
    },
    post(parent, args, { db }) {
      const { post } = parent
      let { posts } = db
      return posts.find(({id}) => id === post)
    }
}