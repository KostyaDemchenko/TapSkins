type MultiSelectOption = {
  id: number;
  name: string;
};

// Store_data_types
type aiListStructured = {
  item_id: number;
  skin_name: string;
  rarity: MultiSelectOption[];
  weapon_type: MultiSelectOption[];
  weapon_name: string;
  ptice: number;
  float: number;
  startrack: MultiSelectOption[];
  img_src: string;
  [key: string]: any;
};
