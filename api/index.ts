export default async function handler(req: any, res: any) {
  const mod = await import("../server/_core/index.ts");
  const { createApp } = mod;

  const { app } = await createApp();

  return app(req, res);
}