import { connectDB } from "../config/mongodb.server";
import Announcement from "../models/announcement.model";

export const loader = async ({ request }) => {
  await connectDB();
  
  const announcementDoc = await Announcement.findOne().lean();

  const data = { 
    announcementText: announcementDoc ? announcementDoc.announcement : "hello world" 
  };

  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};