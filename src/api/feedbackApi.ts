import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = "https://ultxiwqbtdxnocaxtpyc.supabase.co";
const supabaseKey = "sb_publishable_ecZn1KYrAH7AXnrf9PwN1w_vkDkrCFV";
const supabase = createClient(supabaseUrl, supabaseKey);

export const saveFeedback = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const feedback = data?.data || data;
    try {
      // 1. Save to Supabase Cloud
      const { error } = await supabase.from('feedback').insert([{ 
        experience: feedback.experience || '', 
        about_me: feedback.aboutMe || '' 
      }]);
      if (error) console.error("Supabase Error:", error);

      // 2. Save locally (for local dev server)
      try {
        const filePath = path.join(process.cwd(), "feedback.json");
        let feedbacks: any[] = [];
        if (fs.existsSync(filePath)) {
          feedbacks = JSON.parse(fs.readFileSync(filePath, "utf-8") || "[]");
        }
        feedbacks.push({ ...feedback, timestamp: new Date().toISOString() });
        fs.writeFileSync(filePath, JSON.stringify(feedbacks, null, 2));
      } catch (e) {
        // Ignore local filesystem errors in Vercel
      }

      return { success: true };
    } catch (e) {
      console.error("Failed to save feedback:", e);
      return { success: false, error: "Failed to save feedback" };
    }
  });
