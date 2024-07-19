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

const truncateName = (str: string, maxLength: number) => {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
};

const truncateFloat = (num: number, precision: number) => {
  return num.toFixed(precision);
};

export { truncateName, truncateFloat };
