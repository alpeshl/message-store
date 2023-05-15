import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import LoaderWave from '../components/LoaderWave';
import { Message } from '../db/models/messages';
import styles from '../styles/Home.module.css';
import tigrisDb from '../lib/tigris';
import EachMessage from '../components/EachMessage';

type Props = {
  messages: Array<Message>;
};

type FetchStatus = 'loading' | 'success' | 'error';
type TodoViewMode = 'list' | 'search';

const Home: NextPage<Props> = ({ messages }) => {
  // This is the input field
  const [textInput, setTextInput] = useState('');

  // Todo list array which displays the todo messages
  const [messagesList, setMessagesList] = useState<Message[]>(messages);

  const [fetchStatus, setFetchStatus] = useState<FetchStatus>('success');

  // This is use to animate the input text field
  const [wiggleError, setWiggleError] = useState(false);

  // Two separate views. 1. List view for todo messages & 2. Search result view
  const [viewMode, setViewMode] = useState<TodoViewMode>('list');

  // Fetch Todo List
  /*
   'fetchListItems' is the first method that's called when the component is mounted from the useEffect below.
   This sets some of the state like 'isLoading' and 'isError' before it fetches for data from the endpoint defined under 'pages/api/messages/index'.
   The api endpoint returns a json with the key 'result' and a status 200 if successful or returns a status 500 along with the 'error' key.
   If the 'result' key is present we safely set the 'messages'.
  */
  const fetchListItems = () => {
    setFetchStatus('loading');

    fetch('/api/messages')
      .then(response => response.json())
      .then(data => {
        setFetchStatus('success');
        if (data.result) {
          setViewMode('list');
          setMessagesList(data.result);
        } else {
          setFetchStatus('error');
        }
      })
      .catch(() => {
        setFetchStatus('error');
      });
  };

  // Delete Todo-item
  /*
  'deleteMessage' requires an id value of the Message. When the user presses the 'delete'(cross) button from a Message, this method is invoked.
  It calls the endpoint 'api/item/<id>' with the 'DELETE' method. Read the method 'handleDelete' under pages/api/item/[id]' to learn more how the api handles deletion.
  */
  const deleteMessage = (id?: string) => {
    setFetchStatus('loading');

    fetch('/api/messages/' + id, {
      method: 'DELETE'
    }).then(() => {
      setFetchStatus('success');
      if (viewMode == 'list') {
        fetchListItems();
      } else {
        searchQuery();
      }
    });
  };

  // Search query
  /*
  'searchQuery' method takes the state from 'textInput' and send it over to the 'api/messages/search' endpoint via a query param 'q'.
  The response is the same as the response from "fetch('/api/messages')", an array of Messages if successful.
  */
  const searchQuery = () => {
    if (queryCheckWiggle()) {
      return;
    }
    setFetchStatus('loading');

    fetch(`/api/messages/search?q=${encodeURI(textInput)}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        setFetchStatus('success');
        if (data.result) {
          setViewMode('search');
          setMessagesList(data.result);
        }
      });
  };

  const setHasError = (hasError: boolean) => {
    setWiggleError(hasError);
    if (hasError) {
      setTimeout(() => {
        setWiggleError(false);
      }, 500);
    }
  };

  // Util search query/input check
  /*
  The is a helper util method, that validtes the input field via a regex and returns a true or false.
  This also wiggles the text input if the regex doesn't find any match.
  */
  const queryCheckWiggle = () => {
    const result: RegExpMatchArray | null = textInput.match('^\\S.{0,100}$');
    if (result === null) {
      setHasError(true);
      return true;
    }
    return false;
  };

  return (
    <div>
      <Head>
        <title>Todo App using Next.js + Tigris</title>
        <meta name="description" content="Tigris app tutorial" />
      </Head>

      <div className={styles.container}>
        <h2>WhatsApp message browser</h2>

        {/* Search Header */}
        <div className={styles.searchHeader}>
          <input
            className={`${styles.searchInput} ${wiggleError ? styles.invalid : ''}`}
            value={textInput}
            onChange={e => {
              setWiggleError(false);
              setTextInput(e.target.value);
            }}
            placeholder="Type a message to search"
          />
          <button onClick={searchQuery}>Search</button>
        </div>

        {/* Results section */}
        <div className={styles.results}>
          {/* Loader, Errors and Back to List mode */}
          {fetchStatus === 'error' && <p className={styles.errorText}>Something went wrong.. </p>}
          {fetchStatus === 'loading' && <LoaderWave />}
          {viewMode == 'search' && (
            <button
              className={styles.clearSearch}
              onClick={() => {
                setTextInput('');
                fetchListItems();
              }}
            >
              Go back to list
            </button>
          )}

          {/* Todo Item List */}
          {messagesList.length < 1 ? (
            <p className={styles.noItems}>{viewMode == 'search' ? 'No messages found.. ' : ''}</p>
          ) : (
            <ul>
              {messagesList.map(each => {
                return <EachMessage key={each.id} message={each} deleteHandler={deleteMessage} />;
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const messagesCollection = tigrisDb.getCollection<Message>(Message);
  const cursor = messagesCollection.findMany();
  const messages = await cursor.toArray();
  return {
    props: { messages }
  };
};

export default Home;
