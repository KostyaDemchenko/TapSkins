const logs = (obj: object) => {
  fetch("http://localhost:8080/log", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ obj }),
  });
};

export { logs };
