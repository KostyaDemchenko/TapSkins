// /api/history_order/create.ts
import { Client } from "@notionhq/client";
import type { NextApiRequest, NextApiResponse } from "next";
import type { OrderHistiryDataStructured } from "@/typing";

const notionSecret = process.env.NOTION_SECRET;
const notionStoreDataBaseld = process.env.NOTION_ORDER_HISTORY_DATABASE_ID;
const notion = new Client({ auth: notionSecret });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Only POST requests are allowed" });
    return;
  }

  if (!notionSecret || !notionStoreDataBaseld) {
    res.status(500).json({ error: "Missing Notion secret or database ID" });
    return;
  }

  // Генерация order_id на основе текущей даты и времени
  const order_id = Date.now();
  const {
    skin_name,
    image_src,
    user_trade_link,
    item_id,
    user_id,
    price,
    float,
    rarity,
    status,
    startrack,
  } = req.body as Partial<OrderHistiryDataStructured>;

  console.log("Generated order_id:", order_id);

  try {
    const response = await notion.pages.create({
      parent: { database_id: notionStoreDataBaseld },
      properties: {
        order_id: {
          number: order_id,
        },
        skin_name: {
          title: [
            {
              type: "text",
              text: {
                content: skin_name || "Default Name", // Название скина
              },
            },
          ],
        },
        image_src: {
          url: image_src || "https://example.com/default-image.png", // URL изображения
        },
        user_trade_link: {
          url: user_trade_link || "https://example.com/default-trade-link", // Торговая ссылка
        },
        item_id: {
          number: item_id || 0, // ID предмета
        },
        user_id: {
          number: user_id || 0, // ID пользователя
        },
        price: {
          number: price || 0, // Цена
        },
        float: {
          number: float || 0.0, // Float value
        },
        rarity: {
          multi_select: rarity
            ? rarity.split(",").map((r: string) => ({ name: r.trim() }))
            : [], // Редкость
        },
        status: {
          multi_select: status
            ? status.split(",").map((s: string) => ({ name: s.trim() }))
            : [], // Статус
        },
        startrack: {
          multi_select: startrack
            ? startrack.split(",").map((st: string) => ({ name: st.trim() }))
            : [], // StarTrack
        },
      },
    });

    console.log("Notion response:", response);

    res
      .status(200)
      .json({ message: "Order added successfully", data: response });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to create order in Notion:", error.message);
      res
        .status(500)
        .json({
          error: "Failed to create order in Notion",
          details: error.message,
        });
    } else {
      console.error("Failed to create order in Notion: Unknown error");
      res
        .status(500)
        .json({
          error: "Failed to create order in Notion",
          details: "Unknown error",
        });
    }
  }
}
