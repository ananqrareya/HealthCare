import React, { useContext, useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import "./layout.css";
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../../../context/UserContextProvider";

const apiKey = "r9xpc8rq9tgq";

const Page = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  const { getUser1, userId, streamToken, connectToChat,getStreamToken } = useContext(UserContext);
const userIdS = userId ? userId.toString() : null;
  const [isClientReady, setIsClientReady] = useState(false);

  const client = StreamChat.getInstance(apiKey);

  const filters = { type: "messaging", members: { $in: [userIdS] } };

   

useEffect(() => {
  async function setupClient() {
    if (!userId) {
      toast.error("User ID is missing. Please log in again.");
      //navigate("/login");
      return;
    }
     
    try {
      const token = streamToken || (await getStreamToken(userId.toString()));
    const user1Data = await getUser1(userId);
    const user2Data = await getUser1(doctorId);
      
      if (client.userId && client.userId !== userId.toString()) {
        console.log("Disconnecting previous user:", client.userId);
        await client.disconnect();
      }
  
      await connectToChat();

      if (doctorId) {
        const channel = client.channel("messaging", {
          members: [userId.toString(), doctorId],
          name: `Chat with Doctor ${user2Data.first_name}`,
        });

        await channel.watch();
    
      }

      setIsClientReady(true);
    } catch (error) {
      console.error("Error setting up chat client:", error.message || error);
      toast.error("Failed to set up chat. Please try again.");
    }
  }

  setupClient();
}, [doctorId, userId, streamToken, getStreamToken, client, navigate]);


  if (!isClientReady) return <div>Setting up client & connection...</div>;

  return (
    <div className="maincomponent">
      <Chat client={client}>
 
<ChannelList
  filters={filters}
  sort={{ last_message_at: -1 }}
  options={{ limit: 10 }}
  style={{ maxHeight: 'calc(100vh - 100px)' }} // تخصيص الحجم مع إضافة مسافة
/>
<Channel>
  <Window>
    <ChannelHeader />
    <MessageList style={{ maxHeight: 'calc(100vh - 200px)' }} />  {/* تخصيص العرض */}
    <MessageInput />
  </Window>
  <Thread />
</Channel>
      </Chat>
    </div>
  );
};

export default Page;
