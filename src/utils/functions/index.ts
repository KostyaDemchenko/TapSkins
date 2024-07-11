const backendAddress = process.env.NEXT_PUBLIC_BACKEND_ADDRESS;

const logs = (obj: object) => {
  fetch(`${backendAddress}/log`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ obj }),
  });
};

const checkSubscription = (user_id: number, channelId: `@${string}`) => {
  return new Promise(async (res, rej) => {
    const response = await fetch(`${backendAddress}/subscription`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({
        user_id, channelId
      }),
    });

    if (!response.ok) {
      console.log("Error!", response);
      rej(null);
      return;
    }

    const data = await response.json();
    res(data.subscribed);
  });
};

export { logs, checkSubscription };
