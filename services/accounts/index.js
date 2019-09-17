const { ApolloServer, gql ,addResolveFunctionsToSchema , makeExecutableSchema} = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { find, filter ,_ } = require('lodash');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const typeDefs = gql`
  type User {
    id : Int!
    name : String
    email : String
    password : String
  }
  type Query {
    allUsers :[User]
    users(id : Int!) : User
    login(email : String , password : String) : Authdata
  }
  input UserInput {
    id : Int!
    name : String
    email : String
    password : String
  }
  type Mutation{
    addUser(input : UserInput) : [User]
    updateUser(input : UserInput) : User
    deleteUser(id : Int!) :[User]
  }
  type Authdata {
    token : String
  }
  
`;

const resolvers = {
  Query : {
    allUsers : () => {
      return users
    },
    users :(root , { id })=>{
      return users.filter(user => {
        return user.id  === id;
      })[0];
    },
    login  :(root , { email , password }) =>{
      const user =  users.filter(user=> { return (user.email ===  email && user.password === password)})[0];
      var token = jwt.sign({email : user.email} , 'shhhhhh' , { expiresIn : '1h'})
      return { token }
    }
    
    
  },
  Mutation :{
    addUser :async (root , { input })   => { 
    users.push(input);
    return users
    },
    updateUser :(root , { input }) =>{
      var index = users.findIndex(x =>x.id  === input.id);
      var element = users[index];
      users[index] = _.assign(element , input);
      return users[index];
    },
    deleteUser : (root, { id }) =>{
      users.slice(users.findIndex(x => x.id === id ) , 1);
      return users
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{ typeDefs, resolvers }])
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const users = [
  {
    id: "1",
    name: "Damon Salvatore",
    email: "damon@gmail.com",
    password : "123"
  },

];

// mutation {
//   addUser( input : {id : 11, name : "Hello" , email : "hello@gmail.com" , password : "123" })
//   {
//     name
//     id
//   }
// }
// mutation {
//   updateUser( input : {id : 11, name : "Hello" , email : "hello@gmail.com" , password : "123" } )
//   {
//     name
//     id
//   }
// }
// mutation {
//   deleteUser( id : 11 )
//   {
//     name
//   }
// }
// {
//   login(email : "damon@gmail.com" , password : "123" ){
//     token
//   }
// }
