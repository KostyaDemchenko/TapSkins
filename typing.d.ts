// Multi_select
export type MultiSelectOption = {
  id: string;
  name: string;
};

// Skin_Store_data_types
export interface SkinStoreDataStructured {
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

export interface RowSkinStore {
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
    number: number;
  };
  float: {
    id: string;
    name: string;
    type: string;
    number: number;
  };
  rarity: { id: string; multi_select: MultiSelectOption[] };
  weapon_type: { id: string; multi_select: MultiSelectOption[] };
  startrack: { id: string; multi_select: MultiSelectOption[] };
}

// Task_Store_data_types
export interface TaskStoreDataStructured {
  task_id: number;
  task_name: string;
  platform_type: string;
  reward_type: string;
  link_to_join: string;
  social_icon: string;
  [key: string]: any;
}

export interface RowTaskStore {
  type(type: any): string;
  task_id: {
    id: string;
    type: string;
    unique_id: {
      prefix: string | null;
      number: number;
    };
  };
  task_name: {
    id: string;
    title: [{ type: string; text: { content: string } }];
  };
  platform_type: { id: string; multi_select: MultiSelectOption[] };
  reward_type: { id: string; multi_select: MultiSelectOption[] };
  link_to_join?: { id: string; name: string; type: string; url: string };
  reward: {
    id: string;
    name: string;
    type: string;
    number: number;
  };
  social_icon: {
    id: string;
    name: string;
    type: string;
    files: { name: string; file: { url: string } }[];
  };
}

// Task_Store_data_types
export interface ReferalRewardStoreDataStructured {
  reward_id: number;
  reward_name: string;
  reward: number;
  reward_type: string;
  referal_icon: string;
  [key: string]: any;
}

export interface RowReferal {
  type(type: any): string;
  reward_id: {
    id: string;
    type: string;
    unique_id: {
      prefix: string | null;
      number: number;
    };
  };
  reward_name: {
    id: string;
    title: [{ type: string; text: { content: string } }];
  };
  reward_type: { id: string; multi_select: MultiSelectOption[] };
  reward: {
    id: string;
    name: string;
    type: string;
    number: number;
  };
  referal_icon: {
    id: string;
    name: string;
    type: string;
    files: { name: string; file: { url: string } }[];
  };
}
