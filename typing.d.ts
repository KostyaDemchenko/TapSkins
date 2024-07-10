// Multi_select
export type MultiSelectOption = {
  id: string;
  name: string;
};

// Store_data_types1
export interface StoreDataStructured {
  item_id: number;
  skin_name: string;
  rarity: string;
  weapon_type: string;
  weapon_name: string;
  price: number;
  float: number;
  startrack: string;
  image_src: string;
  [key: string]: any;
}

export interface Row {
  item_id: {
    id: string;
    type: string;
    unique_id: {
      prefix: string | null;
      number: number;
    };
  };
  skin_name: {
    id: string;
    title: [{ type: string; text: { content: string } }];
  };
  weapon_name: { id: string; rich_text: { text: { content: string } }[] };
  image_src?: { id: string; name: string; type: string; url: string };
  price: {
    id: string;
    name: string;
    type: string;
    number: number; // Изменено на number
  };
  float: {
    id: string;
    name: string;
    type: string;
    number: number; // Изменено на number
  };
  rarity: { id: string; multi_select: MultiSelectOption[] };
  weapon_type: { id: string; multi_select: MultiSelectOption[] };
  startrack: { id: string; multi_select: MultiSelectOption[] };
}
