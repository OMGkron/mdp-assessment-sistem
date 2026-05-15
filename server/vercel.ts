import { createApp } from "./_core/index.ts";

let cachedApp: any;

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    const { app } = await createApp();
    cachedApp = app;
  }
  
  return cachedApp(req, res);
}
