import { SolapiMessageService } from "solapi";
import fs from "fs";

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

export async function sendMMS({
  to,
  text,
  imagePath,
  from = "01023906547",
}: {
  to: string;
  text: string;
  imagePath: string;
  from?: string;
}) {
  // uploadFile(filePath, type, name)
  const storageRes = await messageService.uploadFile(imagePath, "MMS", "card.png");
  const fileId = storageRes.fileId;

  const result = await messageService.send([
    {
      to: to.replace(/-/g, ""),
      from: from.replace(/-/g, ""),
      text,
      type: "MMS",
      imageId: fileId,
    },
  ]);
  return result;
}
