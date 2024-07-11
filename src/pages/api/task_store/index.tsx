import { Client } from "@notionhq/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  RowTaskStore,
  TaskStoreDataStructured,
  MultiSelectOption,
} from "@/typing";

const notionSecret = process.env.NOTION_SECRET;
const notionStoreDataBaseld = process.env.NOTION_TASK_STORE_DATABASE_ID;
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
    const rows = query.results.map((res) => res.properties) as RowTaskStore[];
    const taskStoreDataStructured: TaskStoreDataStructured[] = rows.map(
      (row) => ({
        // for id
        task_id: row.task_id.unique_id.number || 0,

        // for name
        task_name: row.task_name.title?.[0]?.text?.content ?? "Default Name",

        // for multi_select
        platform_type: extractMultiSelectNames(row.platform_type),
        reward_type: extractMultiSelectNames(row.reward_type),

        // for number
        reward: row.reward.number || 0,

        // for url
        link_to_join: row.link_to_join?.url ?? "URL not available",

        // for file
        social_icon: extractFileUrls(row.social_icon.files),
      })
    );

    res.status(200).json({ taskStoreDataStructured });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from Notion" });
  }
}
