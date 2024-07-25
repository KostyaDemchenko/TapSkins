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

export class User {
  public user_id: number;
  public balance_common: number = 0;
  public balance_purple: number = 0;
  public last_daily_bonus_time_clicked: number = 0;
  public invited_users: number = 0;
  public max_stamina: number = 1000;
  public stamina: number = this.max_stamina;
  public last_click: number = 0;

  private backendAddress: string = process.env.NEXT_PUBLIC_BACKEND_ADDRESS!;
  private staminaStep = 3; // сколько стамины в периоде будет добавляться
  private staminaDecrease = 5;
  public staminaDelay = 1000; // период добавления стамины в секундах

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
    this.balance_purple = obj.balance_purple;
    this.balance_common = obj.balance_common;
    this.last_daily_bonus_time_clicked = obj.last_daily_bonus_time_clicked;
    this.invited_users = obj.invited_users;
    this.last_click = obj.last_click;
    this.stamina = obj.stamina;
    if (obj.max_stamina) this.max_stamina = obj.max_stamina;
  }

  increaseStamina() {
    this.stamina += this.staminaStep;
    if (this.stamina > this.max_stamina) this.stamina = this.max_stamina;
  }

  dereaseStamina() {
    if (this.stamina - this.staminaDecrease >= 0) {
      this.stamina -= this.staminaDecrease;
    } else this.stamina = 0;
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

  // передаем баланс юзера сюда
  constructor(userBalance: number = 0) {
    this.storage = global.window.localStorage;
    this.userBalance = userBalance;
    this.checkLocalStorage();
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
  addToCart(skin: Skin) {
    this.checkLocalStorage();

    const totalCartPrice = this.getTotalPrice() + skin.price;

    if (this.userBalance - totalCartPrice < 0)
      return { success: false, message: "Not enough money on balance!" };

    const skinDuplicat = this.skins!.find((el) => el.item_id === skin.item_id);

    if (skinDuplicat) {
      return {
        success: false,
        message: "Item is already in the cart!",
      };
    }

    this.skins!.push(skin);
    this.storage.setItem(this.storageKey, JSON.stringify(this.skins));

    return {
      success: true,
      message: "Successfully added to cart",
    };
  }

  // так же возвращает:
  // {
  //   success: booolean, сообщает об успехе удаления
  //   message: string текст сообщения
  // }
  deleteFromCart(skin: Skin) {
    this.checkLocalStorage();

    const searchingId = this.skins!.findIndex((el) => el.item_id === skin.item_id);

    if (searchingId === -1) return {
      success: false,
      message: "Strange...there is no such element"
    }

    this.skins!.splice(searchingId, 1);
    this.storage.setItem(this.storageKey, JSON.stringify(this.skins));
    return {
      success: true,
      message: "Deleted successfully!"
    }
  }

  getTotalPrice() {
    this.checkLocalStorage();
    return this.skins!.reduce((accum, currVal) => {
      return accum + currVal.price;
    }, 0);
  }

  getItems() {
    this.checkLocalStorage();
    return this.skins!;
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

export type SuccessDisplay = {
  success: boolean,
  message: string
}
