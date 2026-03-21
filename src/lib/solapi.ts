import { SolapiMessageService } from "solapi";

const apiKey = process.env.SOLAPI_API_KEY!;
const apiSecret = process.env.SOLAPI_API_SECRET!;

export const messageService = new SolapiMessageService(apiKey, apiSecret);

export async function sendSMS({
  to,
  text,
  from = "01023906547",
}: {
  to: string;
  text: string;
  from?: string;
}) {
  const result = await messageService.sendOne({
    to: to.replace(/-/g, ""),
    from: from.replace(/-/g, ""),
    text,
  });
  return result;
}
