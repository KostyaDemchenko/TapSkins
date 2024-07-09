export class User {
  public user_id: number;
  public experience: number = 0;
  public balance_common: number = 0;
  public ballance_purple: number = 0;
  public last_daily_bonus_time_clicked: number = 0;
  public invited_users: number = 0;

  constructor(user_id: number) {
    this.user_id = user_id;
  }

  exchangeBallance() {}
  // loginning user into tap skins
  async authUser() {
    
  }
}

export type Weapon = {
  item_id: string;
  name: string;
  rarity: string;
  price: number;
  float: number;
  weapon_type: string;
  weapon_name: string;
  startrack: boolean;
  image_src: string;
};

export type HistoryItem = Weapon & {
  status: string;
  link_to_trade: string;
};
export type History = {
  items: HistoryItem[];
  user_id: number;
};

export type completeTasks = {
  tasks_completed: [
    {
      taks_id: string;
      date_completed: number;
    }
  ];
  user_id: number;
};

export class Task {
  public reward: number;
  public name: string;
  public icon: string;
  public type: string;
  public link_to_join: string;
  public task_id: string;

  constructor({
    reward,
    name,
    icon,
    type,
    link_to_join,
    task_id,
  }: {
    reward: number;
    name: string;
    icon: string;
    type: string;
    link_to_join: string;
    task_id: string;
  }) {
    this.reward = reward;
    this.name = name;
    this.icon = icon;
    this.type = type;
    this.link_to_join = link_to_join;
    this.task_id = task_id;
  }

  completeTask() {}
  getReward() {}
}
