const Subscription = {
  comment: {
    subscribe(parent, { postId }, { db, pubsub }) {
      const post = db.posts.find(({ id, published }) => id === postId && published)
      if (!post) throw new Error('Post not found')
      return pubsub.asyncIterator(`comment ${postId}`)
    }
  },
  post: {
    subscribe(parent, args, { pubsub }) {
      return pubsub.asyncIterator('post')
    }
  }
}

export { Subscription as default }