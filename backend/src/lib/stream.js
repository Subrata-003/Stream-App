import {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if(!apiKey || !apiSecret) {
  console.error("STREAM_API_KEY and STREAM_API_SECRET must be set in environment variables");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error in upsertUser:", error);
    }
};

export const generateStreamToken=(userId)=>{
    try {
        const userIdStr=userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error generating stream token",error);
    }
}