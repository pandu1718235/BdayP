import { createServerFn } from "@tanstack/react-start";
import * as fs from "fs";
import * as path from "path";

export const saveFeedback = createServerFn({ method: "POST" })
  .handler(async ({ data }: { data: any }) => {
    const feedback = data?.data || data;
    try {
      const filePath = path.join(process.cwd(), "feedback.json");
      let feedbacks: any[] = [];
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        if (fileContent) {
          feedbacks = JSON.parse(fileContent);
        }
      }
      feedbacks.push({ ...feedback, timestamp: new Date().toISOString() });
      fs.writeFileSync(filePath, JSON.stringify(feedbacks, null, 2));
      return { success: true };
    } catch (e) {
      console.error("Failed to save feedback:", e);
      return { success: false, error: "Failed to save feedback" };
    }
  });
