import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = "https://ultxiwqbtdxnocaxtpyc.supabase.co";
const supabaseKey = "sb_publishable_ecZn1KYrAH7AXnrf9PwN1w_vkDkrCFV";
const supabase = createClient(supabaseUrl, supabaseKey);

export const saveWish = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const wish = data?.data || data;
    try {
      // 1. Save to Supabase Cloud
      const { error } = await supabase.from('wishes').insert([{ wish: wish.toString() }]);
      if (error) console.error("Supabase Error:", error);

      // 2. Save locally (for local dev server)
      try {
        const filePath = path.join(process.cwd(), "wishes.json");
        let wishes: any[] = [];
        if (fs.existsSync(filePath)) {
          wishes = JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");
        }
        wishes.push({ wish, timestamp: new Date().toISOString() });
        fs.writeFileSync(filePath, JSON.stringify(wishes, null, 2));
      } catch (e) {
        // Ignore local filesystem errors in Vercel
      }

      return { success: true };
    } catch (e) {
      console.error("Failed to save wish:", e);
      return { success: false, error: "Failed to save wish" };
    }
  });
