import Image from 'next/image';
import React from 'react';
import styles from '../styles/EachToDo.module.css';
import { Message } from '../db/models/messages';

type Props = {
  message: Message;
  deleteHandler: (id?: number) => void;
};
const EachMessage = ({ message, deleteHandler }: Props) => {
  return (
    <>
      <li className={styles.each}>
        {/* <button
          className={styles.eachButton}
          onClick={() => {
            updateHandler(toDoItem);
          }}
        >
          <Image
            src={toDoItem.completed ? '/circle-checked.svg' : '/circle.svg'}
            layout="fixed"
            width={20}
            height={20}
            alt="Check Image"
          />
          <span style={toDoItem.completed ? { textDecoration: 'line-through' } : {}}>{toDoItem.text}</span>
        </button> */}
        <div>{message.text}</div>
        <button
          className={styles.deleteBtn}
          onClick={() => {
            deleteHandler(message.uid);
          }}
        >
          <Image src="/delete.svg" width={24} height={24} alt="Check Image" />
        </button>
      </li>
    </>
  );
};

export default EachMessage;
