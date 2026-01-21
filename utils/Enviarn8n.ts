import { RequestData } from "../interfaces/main";

const enviarServidorn8n = (data: RequestData): Promise<Response> =>
  fetch(
    "https://automation-n8nwithpostgres-491e65-86-48-21-187.traefik.me/webhook-test/megamobilier",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    },
  );

export default enviarServidorn8n;
