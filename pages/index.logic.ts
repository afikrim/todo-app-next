import React, { FormEventHandler, useEffect, useRef, useState } from 'react'

import { Todo, TODO_STATUS, UpdateTodo } from '../types/Todo'

export const TodoLogic = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [updatingTodoId, setUpdatingTodoId] = useState<string>()

  const todoInput = useRef<HTMLInputElement>(null)
  const todoUpdateInput = useRef<HTMLInputElement>(null)
  const todoUpdateInputId = useRef<HTMLInputElement>(null)

  useEffect(() => {
    initTodo()
  }, [])

  const initTodo = (): void => {
    const headers = new Headers()

    const requestInit: RequestInit = {
      method: 'GET',
      headers: headers,
    }

    fetch('/api/todos', requestInit)
      .then((raw) => raw.json())
      .then((json) => {
        console.log(json)

        if (json.status) {
          const todos = json.data

          setTodos(todos)
          return
        }

        alert(json.message)
      })
      .catch((err) => {
        console.error(err)

        alert('Terjadi kesalahan pada server.')
      })
  }

  const addTodo = (todo: string): void => {
    const headers = new Headers()
    headers.append('content-type', 'application/json')

    const requestInit: RequestInit = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ value: todo }),
    }

    fetch('/api/todos', requestInit)
      .then((raw) => raw.json())
      .then((json) => {
        const alertElement = document.getElementById(
          'todoInputAlert'
        ) as HTMLElement

        if (json.status) {
          const newTodo = json.data

          alertElement.innerText = ''
          setTodos([...todos, newTodo])
          return
        }
        alertElement.innerText = json.message
      })
      .catch((err) => {
        console.error(err)

        const alertElement = document.getElementById(
          'todoInputAlert'
        ) as HTMLElement
        alertElement.innerText = 'Terjadi kesalahan pada server.'
      })
  }

  const updateTodo = ({ id, value, status }: UpdateTodo) => {
    const headers = new Headers()
    headers.append('content-type', 'application/json')

    const requestInit: RequestInit = {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({ value, status }),
    }

    fetch(`/api/todos/${id}`, requestInit)
      .then((raw) => raw.json())
      .then((json) => {
        const alertElement = document.getElementById(
          'todoInputAlert'
        ) as HTMLElement

        if (json.status) {
          const updatedTodo = json.data

          alertElement.innerText = ''
          setTodos(
            todos.map((todo) => {
              if (todo.id === id) {
                return updatedTodo
              }

              return todo
            })
          )
          return
        }
        alertElement.innerText = json.message
      })
      .catch((err) => {
        console.error(err)

        const alertElement = document.getElementById(
          'todoInputAlert'
        ) as HTMLElement
        alertElement.innerText = 'Terjadi kesalahan pada server.'
      })
  }

  const removeTodo = (id: string): void => {
    const headers = new Headers()

    const requestInit: RequestInit = {
      method: 'DELETE',
      headers: headers,
    }

    fetch(`/api/todos/${id}`, requestInit)
      .then((raw) => raw.json())
      .then((json) => {
        const alertElement = document.getElementById(
          'todoInputAlert'
        ) as HTMLElement

        if (json.status) {
          alertElement.innerText = ''
          setTodos(todos.filter((todo) => todo.id !== id))
          return
        }
        alertElement.innerText = json.message
      })
      .catch((err) => {
        console.error(err)

        const alertElement = document.getElementById(
          'todoInputAlert'
        ) as HTMLElement
        alertElement.innerText = 'Terjadi kesalahan pada server.'
      })
  }

  const handleSubmit: FormEventHandler<HTMLElement> = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (todoInput.current !== undefined && todoInput.current !== null) {
      addTodo(todoInput.current.value)

      todoInput.current.value = ''
    }
  }

  const handleCheckTodo = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const value = e.currentTarget.value
    const id = value
    const todo = todos.filter((todo) => todo.id === id)[0]

    if (todo.status === TODO_STATUS.TODO) {
      updateTodo({ id, value: undefined, status: TODO_STATUS.DONE })
    } else if (todo.status === TODO_STATUS.DONE) {
      updateTodo({ id, value: undefined, status: TODO_STATUS.TODO })
    }
  }

  const handleUpdateBtnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const value = e.currentTarget.value

    setUpdatingTodoId(value)
    setTimeout(() => {
      document.getElementById(`update_${value}`)?.focus()
    }, 50)
  }

  const handleUpdateSubmit: FormEventHandler = (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    e.preventDefault()

    const id = todoUpdateInputId.current?.value as string
    const value = todoUpdateInput.current?.value

    updateTodo({ id: id, value: value })
    setUpdatingTodoId(undefined)
  }

  const handleRemoveBtnClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const value = e.currentTarget.value

    removeTodo(value)
  }

  return {
    handleCheckTodo,
    handleSubmit,
    handleUpdateSubmit,
    handleRemoveBtnClick,
    handleUpdateBtnClick,
    updatingTodoId,
    todos,
    todoInput,
    todoUpdateInput,
    todoUpdateInputId,
  }
}
