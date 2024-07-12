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

export { logs };
