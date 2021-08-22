import type { NextPage } from 'next'
import Head from 'next/head'

import { TODO_STATUS } from '../types/Todo'
import { TodoLogic } from './index.logic'

const Home: NextPage = () => {
  const {
    handleCheckTodo,
    handleSubmit,
    handleRemoveBtnClick,
    handleUpdateBtnClick,
    handleUpdateSubmit,
    updatingTodoId,
    todos,
    todoInput,
    todoUpdateInput,
    todoUpdateInputId,
  } = TodoLogic()

  return (
    <div className='container flex flex-nowrap justify-center mx-auto px-4 py-7'>
      <Head>
        <title>ToDo App</title>
        <meta name='description' content='ToDo App with NextJs' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='grid grid-cols-1 gap-4'>
        <div className='border overflow-hidden rounded shadow-md w-96'>
          <form action='#' onSubmit={handleSubmit} className='px-3 py-2'>
            <input
              type='text'
              name='todo'
              id='inputTodo'
              className='w-full rounded border px-3 py-2'
              ref={todoInput}
              placeholder='ToDo'
            />
            <small id='todoInputAlert' className='text-red-500'></small>
          </form>
        </div>
        <div>
          <h3 className='mb-2 text-left text-gray-500 text-xl'>Todo: </h3>
          {todos.filter((todo) => todo.status === TODO_STATUS.TODO).length >
            0 && (
            <div className='border overflow-hidden rounded shadow-md w-96'>
              <ul className='divide-y divide-gray-300'>
                {todos
                  .filter((todo) => todo.status === TODO_STATUS.TODO)
                  .map((todo) => (
                    <li
                      key={`${todo.id}_list`}
                      className='flex flex-nowrap p-4 cursor-pointer'
                    >
                      <input
                        type='checkbox'
                        key={todo.id}
                        id={todo.id}
                        className='mr-2'
                        value={todo.id}
                        onClick={handleCheckTodo}
                      />
                      {updatingTodoId === todo.id ? (
                        <form action='#' onSubmit={handleUpdateSubmit}>
                          <input
                            id={`update_${todo.id}_id`}
                            type='hidden'
                            value={todo.id}
                            ref={todoUpdateInputId}
                          />
                          <input
                            type='text'
                            id={`update_${todo.id}`}
                            className='border-b border-gray-300 focus:outline-none focus:border-b-4 focus:border-gray-400 px-2 py-1'
                            defaultValue={todo.value}
                            ref={todoUpdateInput}
                          />
                        </form>
                      ) : (
                        <>
                          <label htmlFor={todo.id} className='cursor-pointer'>
                            {todo.value}
                          </label>
                          <button
                            className='duration-100 hover:bg-gray-200 hover:text-black ml-auto p-1 rounded text-gray-500'
                            onClick={handleUpdateBtnClick}
                            value={todo.id}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                            </svg>
                          </button>
                          <button
                            className='duration-100 hover:bg-red-500 hover:text-white ml-1 p-1 rounded text-red-500'
                            onClick={handleRemoveBtnClick}
                            value={todo.id}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </button>
                        </>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
        <div>
          <h3 className='mb-2 text-left text-gray-500 text-xl'>Done: </h3>
          {todos.filter((todo) => todo.status === TODO_STATUS.DONE).length >
            0 && (
            <div className='border overflow-hidden rounded shadow-md w-96'>
              <ul className='divide-y divide-gray-300'>
                {todos
                  .filter((todo) => todo.status === TODO_STATUS.DONE)
                  .map((todo) => (
                    <li className='flex flex-nowrap p-4 cursor-pointer'>
                      <input
                        type='checkbox'
                        key={todo.id}
                        id={todo.id}
                        className='mr-2'
                        value={todo.id}
                        onClick={handleCheckTodo}
                        checked={true}
                      />
                      <label
                        htmlFor={todo.id}
                        className='cursor-pointer line-through'
                      >
                        {todo.value}
                      </label>
                      <button
                        className='duration-100 hover:bg-red-500 hover:text-white ml-auto p-1 rounded text-red-500'
                        onClick={handleRemoveBtnClick}
                        value={todo.id}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-5 w-5'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                        >
                          <path
                            fillRule='evenodd'
                            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
