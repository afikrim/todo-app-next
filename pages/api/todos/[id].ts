import { readFileSync, writeFileSync } from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import { resolve } from 'path'

import { Response } from '../../../types/Response'
import { Todo } from '../../../types/Todo'

const readFromFile = (): Todo[] => {
  const todos = readFileSync(
    resolve(process.cwd(), 'storage', 'todos.json'),
    'utf-8'
  )

  return JSON.parse(todos)
}

const writeToFile = (todos: Todo[]) => {
  writeFileSync(
    resolve(process.cwd(), 'storage', 'todos.json'),
    JSON.stringify(todos)
  )
}

const handlePut = (
  req: NextApiRequest,
  res: NextApiResponse<Response<Todo | null>>
) => {
  const todos = readFromFile()
  const { query, body } = req

  const id = query.id
  const value = body.value
  const status = body.status

  const index = todos.findIndex((todo) => todo.id === id)
  if (index === -1) {
    res.status(404).json({
      status: false,
      message: `Todo with id ${id} not found!`,
      data: null,
    })
    return
  }

  todos[index] = {
    ...todos[index],
    value: value || todos[index].value,
    status: status || todos[index].status,
  }

  writeToFile(todos)

  res.status(200).json({
    status: true,
    message: `Successfully update todo with id ${id}!`,
    data: todos[index],
  })
}

const handleDelete = (
  req: NextApiRequest,
  res: NextApiResponse<Response<null>>
) => {
  const todos = readFromFile()
  const { query } = req

  const id = query.id

  const index = todos.findIndex((todo) => todo.id === id)
  if (index === -1) {
    res.status(404).json({
      status: false,
      message: `Todo with id ${id} not found!`,
      data: null,
    })
    return
  }

  todos.splice(index, 1)

  writeToFile(todos)

  res.status(200).json({
    status: true,
    message: `Successfully delete todo with id ${id}!`,
    data: null,
  })
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'PUT':
      handlePut(req, res)
      break
    case 'DELETE':
      handleDelete(req, res)
      break
    default:
      res.setHeader('Allow', ['PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
