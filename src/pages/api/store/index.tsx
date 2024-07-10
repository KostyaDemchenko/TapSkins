import { Client } from "@notionhq/client";
import type { NextApiRequest, NextApiResponse } from "next";

const notionSecret = process.env.NOTION_SECRET;
const notionStoreDataBaseld = process.env.NOTION_STORE_DATABASE_ID;

const notion = new Client({ auth: notionSecret });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!notionSecret || !notionStoreDataBaseld)
    throw new Error("Missing notion secret or DB-ID.");

  const query = await notion.databases.query({
    database_id: notionStoreDataBaseld,
  });

  console.log(query.results);

  res.status(200).json({ name: "John Doe" });
}
