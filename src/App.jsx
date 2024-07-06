import React, { useState, useEffect } from 'react';
import './TodoApp.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ task: '', description: '', status: 'not completed' });
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null); 

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.task && newTodo.description) {
      setTodos([...todos, newTodo]);
      setNewTodo({ task: '', description: '', status: 'not completed' });
    }
  };

  const handleEdit = (id) => {
    const todo = todos.find((todo) => todo.id === id);
    setNewTodo(todo);
    setEditing(id); 
  };

  const handleUpdate = (id) => {
    const updatedTodo = { ...newTodo, id };
    setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    setNewTodo({ task: '', description: '', status: 'not completed' });
    setEditing(null);
  };

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleStatusChange = (id, status) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, status } : todo)));
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return todo.status === 'completed';
    if (filter === 'not completed') return todo.status === 'not completed';
  });

  return (
    <div className="TodoApp">
      <h1>MyTodo</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo.task}
          onChange={(e) => setNewTodo({ ...newTodo, task: e.target.value })}
          placeholder="TodoName"
        />
        <input
          type="text"
          value={newTodo.description}
          onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
          placeholder="TodoDescription"
        />
        <button className="submit"type="submit">AddTodo</button>
      </form>
      <h2>Mytodos</h2>
      
      <div className="filter" style={{float:'right'}}>
        <span>StatusFilter:</span>
        <select value={filter} onChange={handleFilterChange}>
          <option  value="all">All</option>
          <option  value="completed">Completed</option>
          <option value="not completed">Not Completed</option>
        </select>
      </div>
      <div className="todos">
        {filteredTodos.map((todo) => (
          <div key={todo.id} className="todo-card">
            <p>Name:{todo.task}</p>
            <p>Description:{todo.description}</p>
            <span
              onClick={() => handleStatusChange(todo.id, todo.status === 'completed' ? 'not completed' : 'completed')}
            >
              Status:
              <select value={todo.status}
                onChange={(e) => handleStatusChange(todo.id, e.target.value)}
              >
                <option value="completed">Completed</option>
                <option value="not completed">Not Completed</option>
              </select>
            </span><br></br>
            <button className="edit-button"onClick={() => handleEdit(todo.id)}>Edit</button>
            <button className="delete-button"onClick={() => handleDelete(todo.id)}>Delete</button>
            {editing === todo.id && ( 
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdate(todo.id);
              }}>
                <input
                  type="text"
                  value={newTodo.task}
                  onChange={(e) => setNewTodo({ ...newTodo, task: e.target.value })}
                  placeholder="TodoName"
                />
                <input
                  type="text"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  placeholder="TodoDescription"
               />
                <button type="submit">Update Todo</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;