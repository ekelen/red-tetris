import React from 'react'
import '../styles/message.scss'

const Message = ({ message, errmsg }) => (
	<div className={'message'}>
    <span className={errmsg && 'errmsg'}>{errmsg || message}</span>
	</div>
)

export default Message
