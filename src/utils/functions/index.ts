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

const colorMap: { [key: string]: { color: string; shadow: string } } = {
  Common: { color: "#BAC9DA", shadow: "rgba(186, 201, 218, 0.75)" },
  Uncommon: { color: "#5899D3", shadow: "rgba(88, 153, 211, 0.75)" },
  Rare: { color: "#4362E6", shadow: "rgba(67, 98, 230, 0.75)" },
  Mythical: { color: "#713BDB", shadow: "rgba(113, 59, 219, 0.75)" },
  Legendary: { color: "#CD2ADB", shadow: "rgba(205, 42, 219, 0.75)" },
  Ancient: { color: "#D13E3E", shadow: "rgba(209, 62, 62, 0.75)" },
  ExcedinglyRare: { color: "#E5A725", shadow: "rgba(229, 167, 37, 0.75)" },
};

export { truncateName, truncateFloat, colorMap };
