import { SkinStoreDataStructured, TaskStoreDataStructured } from "@/typing";
import { postFetch } from "./functions";

export type UserObj = {
  user_id: number;
  balance_common: number;
  balance_purple: number;
  last_daily_bonus_time_clicked: number;
  invited_users: number;
  last_click: number;
  stamina: number;
  [key: string]: number;
};

export type registerUserResponse = {
  user: User;
  bonus?: { balance_common: number; balance_purple: number } | null;
  success: boolean;
};

export class User {
  public user_id: number;
  protected balance_common: number = 0;
  protected balance_purple: number = 0;
  public last_daily_bonus_time_clicked: number = 0;
  public invited_users: number = 0;
  public max_stamina: number = 1000;
  public stamina: number = this.max_stamina;
  public last_click: number = 0;
  private initData: string;
  public receivedBonus: {
    balance_common: number;
    balance_purple: number;
  } | null = null;

  private backendAddress: string = process.env.NEXT_PUBLIC_BACKEND_ADDRESS!;
  private staminaStep = 3; // сколько стамины в периоде будет добавляться
  private balance_icnrease_amnt: number = 1000;
  private staminaDecrease = 5;
  public staminaDelay = 1000; // период добавления стамины в секундах
  private exchangeCoeff = 10000; // сколько золотых монеток нужно чтобы получить 1 фиолетовую

  constructor(user_id: number, initData: string) {
    this.user_id = user_id;
    this.initData = initData;
  }

  getExchangeBallance() {
    const purpleAmnt = Math.floor(this.balance_common / this.exchangeCoeff);
    return purpleAmnt;
  }
  getInitData() {
    return this.initData;
  }
  // возвращает SuccessDisplay
  async exchangeBallance() {
    const res = await fetch(`${this.backendAddress}/convert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initData: this.initData }),
    });

    if (!res.ok) {
      return {
        success: false,
        message: "Error with converting!",
        loading: false,
      };
    }

    try {
      const { success, result } = await res.json();
      console.log(result);
      this.balance_common = result.balance_common;
      this.balance_purple = result.balance_purple;
      return success as SuccessDisplay;
    } catch (e) {
      console.error(e);
      return {
        success: false,
        message: "Something went wrong!",
        loading: false,
      };
    }
  }
  // loginning user into tap skins
  // will return true if everything is okay, and false is everything is bad
  async authUser(tg: WebApp, referalId?: string | null, mainPage?: boolean) {
    // проверяем подлинность данных телеграмма, получаем пользователя и\или создаем его,
    // устанавливаем webSocket соединение
    const initData = tg.initData;
    const hash = tg.initDataUnsafe.hash;

    const backendAddress = process.env.NEXT_PUBLIC_BACKEND_ADDRESS;

    const response = await fetch(
      `${backendAddress}/auth${
        referalId === "undefined" ? "" : `?referalId=${referalId}`
      }`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hash, initData, mainPage }),
      }
    );

    if (!response.ok) {
      console.log("Error to auth", response);
      return {
        success: false,
        bonus: null,
        user: null,
      };
    }

    const data = <registerUserResponse>await response.json();

    if (!data) {
      console.log("Error ocured due to getting user");
      return false;
    }
    this.setUser(data.user);

    return data;
  }

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

  protected setUser(obj: User) {
    this.user_id = obj.user_id;
    this.balance_purple = obj.balance_purple;
    this.balance_common = obj.balance_common;
    this.last_daily_bonus_time_clicked = obj.last_daily_bonus_time_clicked;
    this.invited_users = obj.invited_users;
    this.last_click = obj.last_click;
    this.stamina = obj.stamina;

    if (obj.max_stamina) this.max_stamina = obj.max_stamina;
  }

  increaseBalance() {
    if (this.stamina - this.staminaDecrease >= 0) {
      this.balance_common += this.balance_icnrease_amnt;
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
  dereaseStamina() {
    if (this.stamina - this.staminaDecrease < 0) return;
    if (this.stamina - this.staminaDecrease >= 0) {
      this.stamina -= this.staminaDecrease;
    } else this.stamina = 0;
  }
  increaseStamina() {
    this.stamina += this.staminaStep;
    if (this.stamina > this.max_stamina) this.stamina = this.max_stamina;
  }

  getBalanceCommon() {
    return this.balance_common;
  }
  getBalancePurple() {
    return this.balance_purple;
  }

  // потом тип поменяешь аргумента
  async getSkins() {
    const response = await fetch(`${this.backendAddress}/skins`);

    return await response.json();
  }
  async buySkins(skins: Skin[]) {
    const skinIds = skins.map((el) => el.item_id).join(",");

    try {
      const response = await fetch(`${this.backendAddress}/check-skins`, {
        body: JSON.stringify({ skinIds, initData: this.initData }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.text();
      if (data.trim() === "") {
        return {
          message: "We've received your order!",
          success: true,
          loading: false,
        };
      } else {
        const productEnum = <string[]>[];
        data.split(",").forEach((id) => {
          const element = skins.find((el) => el.item_id === parseInt(id));
          if (element) productEnum.push(element.skin_name);
        });

        return {
          message: `We're sorry, but such skins has reserved:\n${productEnum.join(
            ", "
          )}`,
          success: false,
          loading: false,
        };
      }
      // return data;
    } catch (error) {
      console.error("Error occurred while buying skins:", error);
      return {
        message: "Error to check",
        success: false,
        loading: false,
      };
    }
  }

  async getReward(reward: Reward): Promise<SuccessDisplay> {
    const response = await fetch(
      `${this.backendAddress}/reward/${reward.reward_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ initData: this.initData }),
      }
    );

    if (!response.ok) {
      console.log(response);

      return {
        message: "Can't claim reward!",
        success: false,
      };
      // return false;
    }

    const data = await response.json();
    this.invited_users -= reward.referal_amount;
    return data;
  }
  async getDailyReward(): Promise<SuccessDisplay> {
    const response = await fetch(`${this.backendAddress}/daily-reward`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initData: this.initData }),
    });

    console.log(response);

    if (!response.ok) {
      console.log(response);
      return {
        message: "Error occured! Try again",
        success: false,
      };
    }

    const data = await response.json();
    console.log(data);

    return data;
  }

  async getTasks(): Promise<{
    unCompletedTasks: TaskProps[];
    tasks: {
      completed: number;
      total: number;
    };
  }> {
    const response = await fetch(
      `${this.backendAddress}/tasks?${this.initData}`
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error("Some error!", errorResponse);
      return errorResponse;
    }

    const data = await response.json();
    return data;
  }

  async getRewardsForCompletedTasks() {
    fetch(`${this.backendAddress}/tasks/completed?${this.initData}`)
      .then((d) => d.json())
      .then((d) => {
        console.log(d);
      });
  }

  async assemblyReferalLink(): Promise<SuccessDisplay> {
    const response = await fetch(
      `${this.backendAddress}/referal-link?${this.initData}`
    );

    if (!response.ok) {
      console.error("Error with referal link!", response);
      try {
        console.error(await response.json());
      } catch (e) {
        console.log(e);
      }
      return {
        success: false,
        message: "Some error occured!",
      };
    }

    const referalLink = await response.text();

    return {
      success: true,
      message: referalLink,
    };
  }
}

export type Skin = {
  item_id: number;
  skin_name: string;
  weapon_name: string;
  image_src: string;
  price: number;
  float: number;
  rarity: string;
  weapon_type: string;
  startrack: string;
};

export type Reward = {
  reward_id: number;
  reward_name: string;
  reward_type: string;
  reward: number;
  referal_icon: string;
  referal_amount: number;
};

//! Функционал:
// - добавление одного элемента в корзину, то есть запись в localStorage,
// пока нету бекенда, проверка на актуальность товара выполнена не будет
// - получение элементов из локального хранилища
// - удаление элементов из локального хранилища
export class Cart {
  private skins: Skin[] | null = null;
  public userBalance: number = 0;
  private storage;
  private storageKey = "skins-cart";
  private backendAddress: string = process.env.NEXT_PUBLIC_BACKEND_ADDRESS!;
  private totalPrice: number = 0;

  // передаем баланс юзера сюда
  constructor(userBalance: number = 0) {
    this.storage = global.window.localStorage;
    this.userBalance = userBalance;

    // this.checkLocalStorage();
  }

  // берем все что в localStorage хранится и записываем себе
  private checkLocalStorage() {
    if (this.storage.getItem("skins-cart")) {
      this.skins = JSON.parse(this.storage.getItem(this.storageKey)!) as Skin[];
    } else {
      this.skins = [];
    }
  }

  // Возвращает объект:
  // {
  //   success: booolean, сообщает об успехе добавления
  //   message: string текст сообщения, (недостаточно денег, товар занят, успешное добавление и тд)
  // }
  async addToCart(skin: Skin, initData: string): Promise<SuccessDisplay> {
    const response = await postFetch(
      `${this.backendAddress}/cart/add/${skin.item_id}`,
      { initData: initData }
    );

    if (!response.ok) {
      console.error(response);
      return {
        message: "Some error occured!",
        success: false,
        loading: false,
      };
    }

    const data = (await response.json()) as SuccessDisplay;

    return data;
  }

  // так же возвращает:
  // {
  //   success: booolean, сообщает об успехе удаления
  //   message: string текст сообщения
  // }
  async deleteFromCart(skin: Skin, initData: string): Promise<SuccessDisplay> {
    const response = await postFetch(
      `${this.backendAddress}/cart/remove/${skin.item_id}`,
      { initData: initData }
    );

    if (!response.ok) {
      return await response.json();
    }

    const result = (await response.json()) as SuccessDisplay;

    return result;
  }

  clearCart() {
    this.skins = [];
    this.storage.removeItem(this.storageKey);
  }

  getTotalPrice() {
    return this.totalPrice;
  }

  async getItems(initData: string) {
    const response = await fetch(`${this.backendAddress}/cart?${initData}`);

    const data = await response.json();
    if (!response.ok) {
      console.error(data);
    }

    const totalPrice = (data.items as SkinStoreDataStructured[]).reduce(
      (accum, curval) => accum + curval.price,
      0
    );

    this.totalPrice = totalPrice;

    return data.items;
  }
}

export type HistoryItem = Skin & {
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

export type TaskProps = {
  task_id: number;
  task_name: string;
  platform_type: string;
  reward_type: "purple_coin" | "yellow_coin";
  reward: number;
  link_to_join: string;
  social_icon: string;
};

export class Task {
  public taskField: TaskProps;

  constructor(task: TaskProps) {
    this.taskField = task;
  }

  completeTask() {}
  getReward() {}
}

export type SuccessDisplay = {
  success: boolean;
  message: string;
  loading?: boolean;
  details?: string;
};

export type OrderHistiryData = {
  skin_name: string;
  image_src: string;
  user_trade_link: string;
  item_id: number;
  user_id: number;
  order_id: number;
  price: number;
  float: number;
  rarity: string;
  status: string;
  startrack: string;
  [key: string]: any;
};
