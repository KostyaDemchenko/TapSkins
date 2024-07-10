import { Client } from "@notionhq/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Row, StoreDataStructured, MultiSelectOption } from "@/typing";

const notionSecret = process.env.NOTION_SECRET;
const notionStoreDataBaseld = process.env.NOTION_STORE_DATABASE_ID;
const notion = new Client({ auth: notionSecret });

// Извлечение имен из мультиселектов
function extractMultiSelectNames(options: {
  multi_select: MultiSelectOption[];
}): string {
  return options.multi_select.map((option) => option.name).join(", ");
}

// Обработка запроса
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Обработка CORS заголовков
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  // Обработка предварительных запросов (OPTIONS)
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Проверка наличия необходимых переменных окружения
  if (!notionSecret || !notionStoreDataBaseld) {
    res.status(500).json({ error: "Missing notion secret or DB-ID." });
    return;
  }

  try {
    const query = await notion.databases.query({
      database_id: notionStoreDataBaseld,
    });

    // @ts-ignore
    const rows = query.results.map((res) => res.properties) as Row[];
    const storeDataStructured: StoreDataStructured[] = rows.map((row) => ({
      // for id
      item_id: row.item_id.unique_id.number || 0,

      // for name
      skin_name: row.skin_name.title?.[0]?.text?.content ?? "Default Name",

      // for rich_text
      weapon_name:
        row.weapon_name.rich_text
          .map((richText) => richText.text.content)
          .filter((content) => content.trim() !== "")
          .join(" ") || "Default Description",

      // for url
      image_src: row.image_src?.url ?? "URL not available",

      // for number
      price: row.price.number || 0,
      float: row.float.number || 0,

      // for multi_select
      rarity: extractMultiSelectNames(row.rarity),
      weapon_type: extractMultiSelectNames(row.weapon_type),
      startrack: extractMultiSelectNames(row.startrack),
    }));

    res.status(200).json({ storeDataStructured });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from Notion" });
  }
}
