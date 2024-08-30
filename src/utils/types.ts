import { SkinStoreDataStructured } from "@/typing";
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

type ConfigFields = {
  yellow_coin_per_tap: number;
  max_user_stamina: number;
  exchange_coefficient: number;
  stamina_decrease_per_tap: number;
  stamina_increase: number;
  stamina_regen_time: number;
};

export type registerUserResponse = {
  user: User;
  bonus?: { balance_common: number; balance_purple: number } | null;
  success: boolean;
  config: ConfigFields;
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

  public backendAddress: string = process.env.NEXT_PUBLIC_BACKEND_ADDRESS!;
  public balance_icnrease_amnt = 1000;
  public staminaDecrease = 5;
  public exchangeCoeff = 10000; // сколько золотых монеток нужно чтобы получить 1 фиолетовую
  public stamina_regen_time = 1000; // период в миллисекундах, за которое будет добавляться стамина

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
      console.error("Error to auth", await response.json());
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
    this.setUser(data.user, data.config);

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
  protected setUser(obj: User, config?: ConfigFields) {
    this.user_id = obj.user_id;
    this.balance_purple = obj.balance_purple;
    this.balance_common = obj.balance_common;
    this.last_daily_bonus_time_clicked = obj.last_daily_bonus_time_clicked;
    this.invited_users = obj.invited_users;
    this.last_click = obj.last_click;
    this.stamina = obj.stamina;

    if (config) {
      this.balance_icnrease_amnt = config.yellow_coin_per_tap;
      this.staminaDecrease = config.stamina_decrease_per_tap;
      this.exchangeCoeff = config.exchange_coefficient;
      this.max_stamina = config.max_user_stamina;
      this.stamina_regen_time = config.stamina_regen_time;
    }

    if (obj.max_stamina) this.max_stamina = obj.max_stamina;
  }

  increaseBalance() {
    if (this.stamina - this.staminaDecrease >= 0) {
      this.balance_common += this.balance_icnrease_amnt;
    }
  }

  getBalanceCommon() {
    return this.balance_common;
  }
  getBalancePurple() {
    return this.balance_purple;
  }

  async getSkins() {
    const response = await fetch(`${this.backendAddress}/skins`);

    return await response.json();
  }
  async buySkins(
    orderId: number,
    currentTimestamp: number,
    storedTradeLink: string
  ): Promise<SuccessDisplay> {
    const response = await fetch(`${this.backendAddress}/skins/buy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        initData: this.initData,
        last_order_id: orderId,
        last_order_timestamp: currentTimestamp,
        stored_trade_link: storedTradeLink,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      console.error(data);
      return data;
    }

    return await response.json();
  }

  // получение награды за приглашенных пользователей
  async getReward(reward: Reward): Promise<SuccessDisplay> {
    const response = await fetch(
      `${this.backendAddress}/reward/invited-users/${reward.reward_id}`,
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
  async completeTask(task_id: number): Promise<SuccessDisplay> {
    const res = await postFetch(`${this.backendAddress}/tasks/${task_id}`, {
      initData: this.initData,
    });

    if (!res.ok) {
      console.error("Some error occured with completing task...");
      return {
        success: false,
        message: "",
      };
    }

    try {
      return await res.json();
    } catch (e) {
      console.error(e);
      return {
        success: false,
        message: "",
      };
    }
  }

  async getRewardsForCompletedTasks() {
    const res = await fetch(
      `${this.backendAddress}/tasks/completed?${this.initData}`
    );

    if (!res.ok) {
      console.error(res);
      return {
        success: false,
      };
    }

    return await res.json();
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

  async buyNowSkin(
    skin_id: number,
    user_trade_link: string
  ): Promise<SuccessDisplay> {
    const response = await postFetch(
      `${this.backendAddress}/skins/${skin_id}`,
      {
        initData: this.initData,
        user_trade_link,
        status: "In Progress", // Добавляем статус в тело запроса
      }
    );
    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return data;
    }

    return data;
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
  public userBalance: number = 0;
  private backendAddress: string = process.env.NEXT_PUBLIC_BACKEND_ADDRESS!;
  private totalPrice: number = 0;

  // передаем баланс юзера сюда
  constructor(userBalance: number = 0) {
    this.userBalance = userBalance;
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
    // this.skins = [];
    // this.storage.removeItem(this.storageKey);
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
