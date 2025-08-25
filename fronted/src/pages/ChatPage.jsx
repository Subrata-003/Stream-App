import { useEffect, useState } from "react";
import { useParams } from "react-router"
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import CallButton from "../components/CallButton";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader"

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser //this will run iff authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      
      if (!tokenData?.token || !authUser) return;
      try {
        console.log("Initializing stream chat client .....")
        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser({
          id: authUser.user._id,
          name: authUser.user.fullName,
          image: authUser.user.profilePic
        }, tokenData.token)

        const channelId = [authUser.user._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser.user._id, targetUserId],
        });

        await currChannel.watch();
        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat: ", error)
        toast.error("Couldn't connect the chat,try again");
      } finally {
        setLoading(false);
      }
    }
    initChat();
  }
    , [tokenData, authUser, targetUserId])

    const handleVideoCall=()=>{
      if(channel){
        const callUrl=`${window.location.origin}/call/${channel.id}`;
        channel.sendMessage({
          text:`I've started a video call. Join me here: ${callUrl}`
        });
        toast.success("Video call link sent successfully!")
      }
    }
  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall}/>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage
