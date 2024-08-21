import { Client } from "@notionhq/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  RowSkinStore,
  SkinStoreDataStructured,
  MultiSelectOption,
} from "@/typing";

const notionSecret = process.env.NOTION_SECRET;
const notionStoreDataBaseld = process.env.NOTION_SKIN_STORE_DATABASE_ID;
const notion = new Client({ auth: notionSecret });

// Извлечение имен из мультиселектов
function extractMultiSelectNames(options: {
  multi_select: MultiSelectOption[];
}): string {
  return options.multi_select.map((option) => option.name).join(", ");
}

// Функция для получения всех данных с учетом пагинации
async function fetchAllData(databaseId: string) {
  let allResults: any[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: startCursor,
    });

    allResults = [...allResults, ...response.results];
    hasMore = response.has_more;
    startCursor = response.next_cursor ?? undefined;
  }

  return allResults;
}

// Обработка запроса
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (!notionSecret || !notionStoreDataBaseld) {
    res.status(500).json({ error: "Missing notion secret or DB-ID." });
    return;
  }

  try {
    // Получаем все данные с учетом пагинации
    const queryResults = await fetchAllData(notionStoreDataBaseld);

    // @ts-ignore
    const rows = queryResults.map((res) => res.properties) as RowSkinStore[];
    const storeDataStructured: SkinStoreDataStructured[] = rows.map((row) => ({
      item_id: row.item_id.unique_id.number || 0,
      skin_name: row.skin_name.title?.[0]?.text?.content ?? "Default Name",
      weapon_name:
        row.weapon_name.rich_text
          .map((richText) => richText.text.content)
          .filter((content) => content.trim() !== "")
          .join(" ") || "Default Description",
      image_src: row.image_src?.url ?? "URL not available",
      price: row.price.number || 0,
      float: parseFloat(row.float.number.toFixed(5)) || 0,
      rarity: extractMultiSelectNames(row.rarity),
      weapon_type: extractMultiSelectNames(row.weapon_type),
      startrack: extractMultiSelectNames(row.startrack),
    }));

    // Сортировка по item_id от меньшего к большему
    storeDataStructured.sort((a, b) => a.item_id - b.item_id);

    res.status(200).json({ storeDataStructured });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from Notion" });
  }
}
