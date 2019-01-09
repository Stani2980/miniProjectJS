const { GraphQLScalarType, buildSchema } = require('graphql');
const { DateTime, EmailAddress } = require('@okgrow/graphql-scalars');
const uf = require('../facades/userFacade');
const bf = require('../facades/locationBlogFacade');

// Create schemas
const schema = buildSchema(`
    scalar DateTime
    scalar EmailAddress
    scalar ObjectID
    
    type User {
        id: ObjectID!
        firstName: String!
        lastName: String!
        userName: String!
        password: String!
        email: EmailAddress!
    }
    
    input UserInput {
        firstName: String!
        lastName: String!
        userName: String!
        password: String!
        email: EmailAddress!
    }

    type LocationBlog {
        id: ObjectID!
        info: String!
        author: ObjectID!
        likedBy: [ObjectID]
        created: DateTime
    }
    
    type Pos {
        longitude: Int!
        latitude: Int!
    }
    
    input LocationBlogInput {
        info: String!
        author: ObjectID!
        likedBy: [ObjectID]
        created: DateTime
    }

    type Query {
        getUser(id: ObjectID!): User
        getUserByUsername(userName: String!): User
        getLocationBlogs: [LocationBlog!]
        getUsers: [User]

    }

    type Mutation {
        createUser(input: UserInput): User
        createLocationBlog(input: LocationBlogInput): LocationBlog
        likeBlog(userId: ObjectID, locationBlogId: ObjectID ): LocationBlog
    }
`)

const resolvers = {
    getUser: async ({ _id }) => {
        const user = await uf.findById(_id);
        return user;
    },
    createUser: async ({ input }) => {
        let { firstName, lastName, userName, password, email } = input
        const user = await uf.addUser(firstName, lastName, userName, password, email);
        return user;
    },
    getUsers: async () => {
        const users = await uf.getAllUsers();
        return users;
    },
    getUserByUsername: async ({ userName }) => {
        const user = await uf.findByUsername(userName);
        return user;
    },
    getLocationBlogs: async () => {
        const blogs = await bf.getAllLocationBlogs()
        return blogs;
    },
    likeBlog: async ({ locationBlogId, userId }) => {
        console.log(locationBlogId, userId)
        const blogToUpdate = await bf.getLocationBlogById(locationBlogId)
        const blog = await bf.addLikeToBlog(blogToUpdate, userId);
        return blog;
    },
    DateTime,
    EmailAddress,
    ObjectID: new GraphQLScalarType({ // GraphQL needs this to be able to handle the ObjectIDs' created from MongoDB
        name: 'ObjectID',
        description: 'The ObjectID scalar type represents a [`BSON`](https://en.wikipedia.org/wiki/BSON) ID commonly used in mongodb.',
        serialize(_id) {
            if (_id instanceof ObjectID) {
                return _id.toHexString()
            } else if (typeof _id === 'string') {
                return _id
            } else {
                throw new Error(`${Object.getPrototypeOf(_id).constructor.name} not convertible to `)
            }
        },
        parseValue(_id) {
            if (typeof _id === 'string') {
                return ObjectID.createFromHexString(_id)
            } else {
                throw new Error(`${typeof _id} not convertible to ObjectID`)
            }
        },
        parseLiteral(ast) {
            if (ast.kind === Kind.STRING) {
                return ObjectID.createFromHexString(ast.value)
            } else {
                throw new Error(`${ast.kind} not convertible to ObjectID`)
            }
        },
    }),

}

module.exports = {
    schema,
    resolvers,
}