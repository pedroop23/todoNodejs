const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {

  const {username} = request.headers
 const user = users.find(users=> users.username == username)
 
 if(!user ){
   return response.status(404).json({error: "User not found"})
 }
  request.user = user;
  return next()
  // Complete aqui
}

app.post('/users', (request, response) => {
  const {name,username} = request.body
  
 const userAlreadyExists = users.some(users=> users.username === username)
 if(userAlreadyExists){
  return response.status(400).json({error: "user already exists!"})
 }
 const newUser = {
  id: uuidv4(),
   name: name,
  username: username,
  
  todos: []            
}
users.push(newUser)
return response.status(201).json(newUser)

 
  // Complete aqui
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {user} = request
  return response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  
  const {title,deadline} = request.body

  const {user} =request
  const todo ={
    id: uuidv4(), 
	title: title,
	done: false, 
	deadline: new Date(deadline), 
	created_at: new Date()
  }
  user.todos.push(todo)
  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
const {title,deadline} = request.body
const {user} = request
const {id} = request.params

const todo = user.todos.find(todo=> todo.id ===id);

   if(!todo){
     return response.status(404).json({error: 'Todo not found'})
   }
    todo.title = title
    todo.deadline = new Date(deadline)
     
      

return response.json(todo);
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {user} = request
const {id} = request.params

const todo =user.todos.find(todo=> todo.id === id);

    if(!todo){
      return response.status(404).json({error: 'Todo not found'})
    }
    
    todo.done = true
      

return response.json(todo);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {user} = request
  const {id} = request.params
  const userIndex = user.todos.findIndex(
    userIndex => userIndex.id == id
  );
  if(userIndex == -1){
    return response.status(404).json({error: 'Todo not found'})
  }
user.todos.splice(userIndex,1)
return response.status(204).json();

});

module.exports = app;