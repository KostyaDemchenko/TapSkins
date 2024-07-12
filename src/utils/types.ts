import { logs } from "./functions";

export type UserObj = {
  user_id: number;
  balance_common: number;
  ballance_purple: number;
  last_daily_bonus_time_clicked: number;
  invited_users: number;
  last_click: number;
  stamina: number;
  [key: string]: number;
};

export class User {
  public user_id: number;
  public balance_common: number = 0;
  public ballance_purple: number = 0;
  public last_daily_bonus_time_clicked: number = 0;
  public invited_users: number = 0;
  public max_stamina: number = 1000;
  public stamina: number = this.max_stamina;
  public last_click: number = 0;

  private backendAddress: string = process.env.NEXT_PUBLIC_BACKEND_ADDRESS!;
  private staminaStep = 3; // сколько стамины в периоде будет добавляться

  constructor(user_id: number) {
    this.user_id = user_id;
  }

  exchangeBallance() {}
  // loginning user into tap skins
  // will return true if everything is okay, and false is everything is bad
  async authUser(tg: WebApp) {
    // проверяем подлинность данных телеграмма, получаем пользователя и\или создаем его,
    // устанавливаем webSocket соединение
    const initData = tg.initData;
    const hash = tg.initDataUnsafe.hash;

    const backendAddress = process.env.NEXT_PUBLIC_BACKEND_ADDRESS;

    const response = await fetch(`${backendAddress}/auth`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hash, initData }),
    });

    if (!response.ok) {
      console.log("Error to auth", response);
      return false;
    }

    const data = (await response.json()) as UserObj;

    if (!data) {
      console.log("Error ocured due to getting user");
      return false;
    }
    this.setUser(data);

    return true;
  }

  // async increaseBallance(wss: WebSocket) {
  //   if (!wss) {
  //     console.log("There is no connection!");
  //     return false;
  //   }

  //   try {
  //     this.dereaseStamina();
  //     wss.send(
  //       JSON.stringify({
  //         user_id: this.user_id,
  //         last_click: Date.now(),
  //         stamina: this.stamina,
  //       })
  //     );
  //     return true;
  //   } catch (e) {
  //     console.log(e);
  //     return false;
  //   }
  // }

  checkSubscription(channelId: `@${string}`) {
    const { user_id } = this;
    return new Promise(async (res, rej) => {
      const response = await fetch(`${this.backendAddress}/subscription`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "post",
        body: JSON.stringify({
          user_id,
          channelId,
        }),
      });

      if (!response.ok) {
        console.log("Error!", response);
        res(null);
        return;
      }

      const data = await response.json();
      res(data.subscribed);
    });
  }

  setUser(obj: UserObj | User) {
    this.user_id = obj.user_id;
    this.ballance_purple = obj.ballance_purple;
    this.balance_common = obj.balance_common;
    this.last_daily_bonus_time_clicked = obj.last_daily_bonus_time_clicked;
    this.invited_users = obj.invited_users;
    this.last_click = obj.last_click;
    this.stamina = obj.stamina;
    if (obj.max_stamina) this.max_stamina = obj.max_stamina;
  }

  increaseStamina() {
    this.stamina += 3;
    if (this.stamina > this.max_stamina) this.stamina = this.max_stamina;
  }

  dereaseStamina() {
    if (this.stamina - 1 >= 0) {
      this.stamina -= 1;
    }
  }

  addPassiveStamina() {
    const secondsScinceLastClick = Math.floor(
      (Date.now() - this.last_click) / 1000
    );
    const totalStamina = this.staminaStep * secondsScinceLastClick;

    this.stamina += totalStamina;
    if (this.stamina > this.max_stamina) this.stamina = this.max_stamina;
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
