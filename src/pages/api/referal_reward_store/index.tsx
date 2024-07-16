import { Client } from "@notionhq/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  RowReferal,
  ReferalRewardStoreDataStructured,
  MultiSelectOption,
} from "@/typing";

const notionSecret = process.env.NOTION_SECRET;
const notionStoreDataBaseld =
  process.env.NOTION_REFERAL_REWARD_STORE_DATABASE_ID;
const notion = new Client({ auth: notionSecret });

// Извлечение имен из мультиселектов
function extractMultiSelectNames(options: {
  multi_select: MultiSelectOption[];
}): string {
  return options.multi_select.map((option) => option.name).join(", ");
}

// Извлечение только URL из объекта files
function extractFileUrls(
  files: { name: string; file: { url: string } }[]
): string {
  return files.map((file) => file.file.url).join(", ");
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
    const rows = query.results.map((res) => res.properties) as RowReferal[];
    const referalRewardStoreStructured: ReferalRewardStoreDataStructured[] =
      rows.map((row) => ({
        // for id
        reward_id: row.reward_id.unique_id.number || 0,

        // for name
        reward_name:
          row.reward_name.title?.[0]?.text?.content ?? "Default Name",

        // for multi_select
        reward_type: extractMultiSelectNames(row.reward_type),

        // for number
        reward: row.reward.number || 0,

        // for file
        referal_icon: extractFileUrls(row.referal_icon.files),
      }));

    res.status(200).json({ referalRewardStoreStructured });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from Notion" });
  }
}
