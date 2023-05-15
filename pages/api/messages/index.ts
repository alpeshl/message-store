import type { NextApiRequest, NextApiResponse } from 'next';
import tigrisDb from '../../../lib/tigris';
import { Message } from '../../../db/models/messages';

type Response = {
  result?: Array<Message>;
  error?: string;
};

// GET /api/messages -- gets messages from collection
// POST /api/messages {ToDoItem} -- inserts a new item to collection
export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  switch (req.method) {
    case 'GET':
      await handleGet(req, res);
      break;
    case 'POST':
      await handlePost(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const messagesCollection = tigrisDb.getCollection<Message>(Message);
    const cursor = messagesCollection.findMany({
      sort: [
        {
          field: 'timestamp',
          order: '$asc'
        }
      ]
    });
    const messages = await cursor.toArray();
    res.status(200).json({ result: messages });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const item = JSON.parse(req.body) as Message;
    const messagesCollection = tigrisDb.getCollection<Message>(Message);
    const inserted = await messagesCollection.insertOne(item);
    res.status(200).json({ result: [inserted] });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}
