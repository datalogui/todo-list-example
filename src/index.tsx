// Import dependencies
import * as React from 'react'
import { render } from 'react-dom'

// Import components
import TodoForm from './components/todo-form'
import TodoList from './components/todo-list'

// Import interfaces
import { TodoInterface } from './interfaces'

// Import styles
import './styles/styles.css'

import * as datalog from '@datalogui/datalog'
import { useQuery } from '@datalogui/react'

// The main todo table
const Todos = datalog.newTable<TodoInterface>({
  id: datalog.StringType,
  text: datalog.StringType,
  isCompleted: datalog.BoolType
})

// TodoListApp component
const TodoListApp = () => {
  const todos = useQuery(({ id, text, isCompleted }: TodoInterface) => {
    Todos({ id, text, isCompleted })
  })

  // Creating new todo item
  function handleTodoCreate(todo: TodoInterface) {
    Todos.assert(todo)
  }

  // Update existing todo item
  function handleTodoUpdate(event: React.ChangeEvent<HTMLInputElement>, id: string) {
    const todoToUpdate = todos.find((todo: TodoInterface) => todo.id === id)
    if (todoToUpdate) {
      Todos.retract(todoToUpdate)
      Todos.assert({
        ...todoToUpdate,
        text: event.target.value
      })
    }
  }

  // Remove existing todo item
  function handleTodoRemove(id: string) {
    const todoToRemove: TodoInterface | undefined = todos.find((todo: TodoInterface) => todo.id === id)
    if (todoToRemove) {
      Todos.retract(todoToRemove)
    }
  }

  // Check existing todo item as completed
  function handleTodoComplete(id: string) {
    const todoToUpdate = todos.find((todo: TodoInterface) => todo.id === id)
    if (todoToUpdate) {
      Todos.retract(todoToUpdate)
      Todos.assert({
        ...todoToUpdate,
        isCompleted: !todoToUpdate.isCompleted
      })
    }
  }

  // Check if todo item has title
  function handleTodoBlur(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value.length === 0) {
      event.target.classList.add('todo-input-error')
    } else {
      event.target.classList.remove('todo-input-error')
    }
  }

  return (
    <div className="todo-list-app">
      <TodoForm
        todos={todos}
        handleTodoCreate={handleTodoCreate}
      />

      <TodoList
        todos={todos}
        handleTodoUpdate={handleTodoUpdate}
        handleTodoRemove={handleTodoRemove}
        handleTodoComplete={handleTodoComplete}
        handleTodoBlur={handleTodoBlur}
      />
    </div>
  )
}

const rootElement = document.getElementById('root')
render(<TodoListApp />, rootElement)
