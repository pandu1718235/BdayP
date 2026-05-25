import { createServerFn } from "@tanstack/react-start";
import * as fs from "fs";
import * as path from "path";

export const saveWish = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const wish = data?.data || data;
    try {
      const filePath = path.join(process.cwd(), "wishes.json");
      let wishes: any[] = [];
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        if (fileContent) {
          wishes = JSON.parse(fileContent);
        }
      }
      wishes.push({ wish, timestamp: new Date().toISOString() });
      fs.writeFileSync(filePath, JSON.stringify(wishes, null, 2));
      return { success: true };
    } catch (e) {
      console.error("Failed to save wish:", e);
      return { success: false, error: "Failed to save wish" };
    }
  });
