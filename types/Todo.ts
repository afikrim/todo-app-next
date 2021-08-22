export enum TODO_STATUS {
  TODO = 'todo',
  DONE = 'done',
}

export type Todo = {
  id?: string
  value: string
  status: TODO_STATUS
}

export type UpdateTodo = {
  id: string
  value?: string
  status?: TODO_STATUS
}
