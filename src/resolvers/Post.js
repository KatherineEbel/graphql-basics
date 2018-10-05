export default {
    author(parent, args, { db }) {
      const { author } = parent
      let { users } = db
      return users.find(({id}) => id === author)
    },
    comments(parent, args, { db }) {
      const { id } = parent
      let { comments } = db
      return comments.filter(({post}) => post === id)
    }
    
}