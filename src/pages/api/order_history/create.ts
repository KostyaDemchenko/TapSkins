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

  // Получаем последний order_id и время из localStorage (если они есть)
  const lastOrderId = parseInt(req.headers["last-order-id"] as string);
  const lastOrderTimestamp = parseInt(
    req.headers["last-order-timestamp"] as string
  );

  // Генерируем новый order_id или используем старый, если прошло менее 10 секунд
  const currentTimestamp = Date.now();
  let order_id = currentTimestamp;

  if (
    lastOrderId &&
    lastOrderTimestamp &&
    currentTimestamp - lastOrderTimestamp < 10000
  ) {
    order_id = lastOrderId;
  }

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
