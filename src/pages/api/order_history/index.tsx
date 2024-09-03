import { Client } from "@notionhq/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type { MultiSelectOption, OrderHistiryDataStructured, RowOrderHistory, RowSkinStore } from "@/typing";

const notionSecret = process.env.NOTION_SECRET;
const notionStoreDataBaseld = process.env.NOTION_ORDER_HISTORY_DATABASE_ID;
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

  const { user_id } = req.query; // Получаем user_id из запроса

  try {
    const allRows: RowOrderHistory[] = [];
    let hasMore = true;
    let startCursor: string | undefined = undefined;

    while (hasMore) {
      const query = await notion.databases.query({
        database_id: notionStoreDataBaseld,
        filter: {
          property: "user_id",
          number: {
            equals: parseInt(user_id as string), // Фильтруем по user_id
          },
        },
        start_cursor: startCursor,
      });

      // @ts-ignore
      const rows = query.results.map((res) => res.properties) as RowOrderHistory[];
      allRows.push(...rows);

      hasMore = query.has_more;
      startCursor = query.next_cursor!;
    }

    const ordersHistoryDataStructured: OrderHistiryDataStructured[] = allRows.map(
      (row) => ({
        // for name
        skin_name: row.skin_name.title?.[0]?.text?.content ?? "Default Name",

        // for url
        image_src: row.image_src?.url ?? "URL not available",
        user_trade_link: row.user_trade_link?.url ?? "URL not available",

        // for number
        item_id: row.item_id.number || 0,
        user_id: row.user_id.number || 0,
        order_id: row.order_id.number || 0,
        price: row.price.number || 0,
        float: row.float.number || 0,

        // for multi_select
        rarity: extractMultiSelectNames(row.rarity),
        status: extractMultiSelectNames(row.status),
        startrack: extractMultiSelectNames(row.startrack),
      })
    );

    res.status(200).json({ ordersHistoryDataStructured });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from Notion" });
  }
}
