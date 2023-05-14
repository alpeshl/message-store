import { NextApiRequest, NextApiResponse } from 'next';
import tigrisDb from '../../../lib/tigris';
import { Message } from '../../../db/models/messages';

type Data = {
  result?: Array<Message>;
  error?: string;
};

// GET /api/messages/search?q=searchQ -- searches for messages matching text `searchQ`
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const query = req.query['q'];
  if (query === undefined) {
    res.status(400).json({ error: 'No search query found in request' });
    return;
  }
  try {
    const messagesCollection = tigrisDb.getCollection<Message>(Message);
    const searchResult = await messagesCollection.search({ q: query as string });
    const messages = new Array<Message>();
    for await (const res of searchResult) {
      res.hits.forEach(hit => messages.push(hit.document));
    }
    res.status(200).json({ result: messages });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ error: error.message });
  }
}
