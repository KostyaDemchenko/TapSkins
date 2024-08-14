import { Client } from "@notionhq/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type { OrderHistiryDataStructured, RowOrderHistory } from "@/typing";

// Глобальный объект для хранения последнего order_id и временной метки
const userOrderState: {
  [userId: number]: { orderId: number; timestamp: number };
} = {};

const notionSecret = process.env.NOTION_SECRET;
const notionStoreDataBaseld = process.env.NOTION_ORDER_HISTORY_DATABASE_ID;
const notion = new Client({ auth: notionSecret });

// Извлечение имен из мультиселектов
function extractMultiSelectNames(options: {
  multi_select: RowOrderHistory[];
}): string {
  return options.multi_select.map((option) => option.name).join(", ");
}

// Функция для получения текущего времени в секундах
function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
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

  const { user_id } = req.body as Partial<OrderHistiryDataStructured>;

  try {
    const currentTimestamp = getCurrentTimestamp();

    let order_id;

    // Проверяем, есть ли предыдущий запрос от этого пользователя
    if (
      userOrderState[user_id!] &&
      currentTimestamp - userOrderState[user_id!].timestamp < 20
    ) {
      // Если прошло меньше 20 секунд, используем старый order_id
      order_id = userOrderState[user_id!].orderId;
    } else {
      // Иначе генерируем новый order_id
      order_id = Date.now(); // Или другой способ генерации уникального order_id
      userOrderState[user_id!] = {
        orderId: order_id,
        timestamp: currentTimestamp,
      };
    }

    const {
      skin_name,
      image_src,
      user_trade_link,
      item_id,
      price,
      float,
      rarity,
      status,
      startrack,
    } = req.body as Partial<OrderHistiryDataStructured>;

    const response = await notion.pages.create({
      parent: { database_id: notionStoreDataBaseld },
      properties: {
        order_id: {
          number: order_id,
        },
        timestamp: {
          number: currentTimestamp,
        },
        skin_name: {
          title: [
            {
              type: "text",
              text: {
                content: skin_name || "Default Name",
              },
            },
          ],
        },
        image_src: {
          url: image_src || "https://example.com/default-image.png",
        },
        user_trade_link: {
          url: user_trade_link || "https://example.com/default-trade-link",
        },
        item_id: {
          number: item_id || 0,
        },
        user_id: {
          number: user_id || 0,
        },
        price: {
          number: price || 0,
        },
        float: {
          number: float || 0.0,
        },
        rarity: {
          multi_select: rarity
            ? rarity.split(",").map((r: string) => ({ name: r.trim() }))
            : [],
        },
        status: {
          multi_select: status
            ? status.split(",").map((s: string) => ({ name: s.trim() }))
            : [],
        },
        startrack: {
          multi_select: startrack
            ? startrack.split(",").map((st: string) => ({ name: st.trim() }))
            : [],
        },
      },
    });

    res
      .status(200)
      .json({ message: "Order added successfully", data: response });
  } catch (error) {
    console.error("Failed to create order in Notion:", error);
    res.status(500).json({ error: "Failed to create order in Notion" });
  }
}
