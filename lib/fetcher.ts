export const fetcher = (url: string) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcyNDU2MzI0OCwiZXhwIjoxNzI1MTY4MDQ4fQ.95aT-d4Qozc5NivPjBKbrGTqxJRzPqmosVd6mujTk-g",
      "ngrok-skip-browser-warning": true,
    },
  }).then((res) => res.json());

const NOCO = "https://b460-1-162-140-219.ngrok-free.app";
const DIFY = "https://2989-1-162-140-219.ngrok-free.app";

export const requestURL = {
  articles: `${NOCO}/api/articles:list`,
  article: `${NOCO}/api/articles:get`,
  create: `${DIFY}/v1/workflows/run`,
};
