import uuidv4 from 'uuid/v4'

const isValidComment = (data, {users, posts}) => {
  const { author, post } = data
  const userExists = users.some(({id}) => id === author)
  const postExistsAndPublished = posts.some(({id, published}) => id === post && published)
  if (!userExists) throw new Error('User not found')
  if (!postExistsAndPublished) throw new Error('Invalid Post')
  return true
}

export default {
  createUser(parent, args, { db }) {
                                 const {name, email, age} = args.data
                                 const { users } = db
                                 const emailTaken = users.some(u => u.email === email)
                                 if (emailTaken) throw new Error('Email taken')
                                 const user = {
                                 name,
                                 email,
                                 age,
                                 id: uuidv4()
                                 }
                                 users.push(user)
                                 return user
                                 },
  deleteUser(parent, args, { db }) {
                                 const userIndex = users.findIndex(({id}) => id === args.id)
                                 let { users, comments, posts } = db
                                 if (userIndex === -1) throw new Error('User not found')
                                 posts = posts.filter(p => {
                                 const isMatch = p.author === args.id
                                 comments = comments.filter(c => c.author !== args.id)
                                 return !isMatch
                                 })
                                 return users.splice(userIndex, 1)[0]
                                 },
  updateUser(parent, { id, data }, { db }) {
    const { users } = db
    const user = users.find(({id}) => id === id)
    if (!user) throw new Error('User not found')
    if (typeof data.email === 'string') {
      const emailTaken = users.some(({email}) => email === data.email)
      if (emailTaken) throw new Error('Email invalid')
      user.email = data.email
    }
    if (typeof data.name === 'string') {
      user.name = data.name
    }
    
    if (typeof data.age !== 'undefined') {
      user.age = data.age
    }
    return user
  },
  createPost(parent, args, { db, pubsub }) {
    let { users, posts } = db
    const userExists = users.some(({id}) => args.data.author === id)
    if (!userExists) throw new Error('User not found')
    const post = {
      ...args.data,
      id: uuidv4()
    }
    posts.push(post)
    if (post.published) pubsub.publish('post', {
      post: {
        mutation: 'CREATED',
        data: post
      }
    })
    
    return post
  },
  updatePost(parent, { id, data }, { db, pubsub }) {
    const { title, body, published } = data
    const post = db.posts.find(({id: postID}) => id === postID)
    const originalPost = { ...post }
    if (!post) throw new Error('Post not found')
    if (typeof title === 'string') {
      post.title = title
    }
    if (typeof body === 'string') {
      post.body = body
    }
    if (typeof published === 'boolean') {
      post.published = published
      if (originalPost.published && !post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        })
      } else if (!originalPost.published && post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        })
      }
    } else if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      })
    }
    return post
  },
  deletePost(parent, args, { db, pubsub }) {
    const {id: postID} = args
    let { posts, comments } = db
    const postIndex = posts.findIndex(({id}) => id === postID)
    if (postIndex === -1) throw new Error('Post not found')
    const [post] = posts.splice(postIndex, 1)
    comments = comments.filter(({post}) => post !== postID)
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }
    return post
  },
  createComment(parent, args, { db, pubsub }) {
    let { comments } = db
    if (isValidComment(args.data, db)) {
      const comment = {
        ...args.data,
        id: uuidv4()
      }
      comments.push(comment)
      pubsub.publish(`comment ${args.data.post}`, {
        comment: {
          mutation: 'CREATED',
          data: comment
        }
      })
      return comment
    }
  },
  updateComment(parent, { id, data }, { db, pubsub }) {
    const { text } = data
    const comment = db.comments.find(({ id: commentId }) => id === commentId)
    if (!comment) throw new Error('Comment not found')
    if (typeof text === 'string') {
      comment.text = text
    }
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    })
    return comment
  },
  deleteComment(parent, args, { db, pubsub }) {
    const {id: commentID} = args
    let { comments } = db
    const commentIndex = comments.findIndex(({id}) => id === commentID)
    if (commentIndex === -1) throw new Error('Comment not found')
    const [comment] = comments.splice(commentIndex, 1)
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment
      }
    })
    return comment
  }
}