import React from 'react'

const messageStyle = {
  backgroundColor: 'green',
  color: 'white',
  fontWeight: 'bolder'
}

const errStyle = {
  backgroundColor: 'red'
}

const Message = ({ message, errmsg }) => (
	<div>
    <span className={'messageStyle'}>{errmsg || message}</span>
	</div>
)

export default Message