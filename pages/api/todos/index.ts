import { readFileSync, writeFileSync } from 'fs'
import { nanoid } from 'nanoid'
import { resolve } from 'path'

import { Response } from '../../../types/Response'
import { Todo, TODO_STATUS } from '../../../types/Todo'

import type { NextApiRequest, NextApiResponse } from 'next'
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

const handleGet = (res: NextApiResponse<Response<Todo[]>>) => {
  res
    .status(200)
    .json({
      status: true,
      message: 'Successfully get all todos.',
      data: readFromFile(),
    })
}

const handlePost = (
  req: NextApiRequest,
  res: NextApiResponse<Response<Todo | null>>
) => {
  const todos = readFromFile()
  const { body } = req

  if (!body.value) {
    res
      .status(400)
      .json({ status: false, message: 'Param value is required!', data: null })
    return
  }

  const newTodo = {
    id: nanoid(),
    value: body.value,
    status: TODO_STATUS.TODO,
  }

  todos.push(newTodo)
  writeToFile(todos)

  res.status(200).json({
    status: true,
    message: 'Successfully insert a new ToDo',
    data: newTodo,
  })
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      handleGet(res)
      break
    case 'POST':
      handlePost(req, res)
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
