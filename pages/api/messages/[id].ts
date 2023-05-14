import { NextApiRequest, NextApiResponse } from 'next';
import tigrisDb from '../../../lib/tigris';
import { Message } from '../../../db/models/messages';

type Data = {
  result?: Message;
  error?: string;
};

// GET /api/messages/[id] -- gets item from collection where id = [id]
// PUT /api/messages/[id] {ToDoItem} -- updates the item in collection where id = [id]
// DELETE /api/messages/[id] -- deletes the item in collection where id = [id]
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { id } = req.query;
  switch (req.method) {
    case 'GET':
      await handleGet(req, res, String(id));
      break;
    // case 'PUT':
    //   await handlePut(req, res);
    //   break;
    case 'DELETE':
      await handleDelete(req, res, String(id));
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse<Data>, messageId: string) {
  try {
    const messagesCollection = tigrisDb.getCollection<Message>(Message);
    const item = await messagesCollection.findOne({ filter: { uid: messageId } });
    if (!item) {
      res.status(404).json({ error: 'No item found' });
    } else {
      res.status(200).json({ result: item });
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse<Data>, messageId: string) {
  try {
    const messagesCollection = tigrisDb.getCollection<Message>(Message);
    const status = (await messagesCollection.deleteOne({ filter: { uid: messageId } })).status;
    if (status === 'deleted') {
      res.status(200).json({});
    } else {
      res.status(500).json({ error: `Failed to delete ${messageId}` });
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}
