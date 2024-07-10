import { Client } from "@notionhq/client";
import type { NextApiRequest, NextApiResponse } from "next";

const notionSecret = process.env.NOTION_SECRET;
const notionStoreDataBaseld = process.env.NOTION_STORE_DATABASE_ID;

const notion = new Client({ auth: notionSecret });

// Sort multi select options by name
function sortMultiSelectOptions(options: {
  multi_select: MultiSelectOption[];
}): MultiSelectOption[] {
  return options.multi_select.sort((a, b) => a.name.localeCompare(b.name));
}

type Row = {
  // надо посмотреть как айди обрабатывать

  // for name
  ai_name: { id: string; title: [{ type: string; text: { content: string } }] };

  // for regular text
  ai_description: { id: string; rich_text: { text: { content: string } }[] };

  // for link
  ai_img_url: { id: string; url: string };

  // for number
  ai_rate: {
    id: string;
    name: string;
    type: string;
    number: { format: string };
  };

  // for multi select
  ai_input: { id: string; multi_select: { id: string; name: string }[] };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  // Preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (!notionSecret || !notionStoreDataBaseld) {
    throw new Error("Missing notion secret or DB-ID.");
  }

  const query = await notion.databases.query({
    database_id: notionStoreDataBaseld,
  });

  // @ts-ignore
  const rows = query.results.map((res) => res.properties) as Row[];
  const storeDataStructured = rows.map((row) => ({}));

  res.status(200).json({ storeDataStructured });
}
