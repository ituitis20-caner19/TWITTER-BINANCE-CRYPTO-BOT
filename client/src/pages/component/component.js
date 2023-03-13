import React from 'react'

import { FaTrash } from 'react-icons/fa'
const List = ({content, trash}) => {

  return (
    <div className='component'>
      <p className="p-component">{content}</p>

      <button onClick={() => trash(content)} className="btn-component">
        <FaTrash />
      </button>

    </div>
  )
}

export default List
