import io, { Socket } from "socket.io-client";
import { useState, useEffect, KeyboardEvent, useRef, ChangeEvent } from "react";
import { Message } from "@/types/interface";
import Image from "next/image";
import { generateRandomKey, validateEmail } from "@/types/utils";
import NotificationComponent from "./NotificationComponent";
import { changeFav } from "./ChatAdmin";
let socket: Socket | undefined;
export const timeGenerate = () => (new Date()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([{ author: 'Chatbot', message: 'Joining to agent...', channel: 'admin', viewed: true, key: generateRandomKey(16), time: timeGenerate() }]);
  //toLocaleDateString("en-US", { /* weekday: 'long', */ year: 'numeric', month: 'long', day: 'numeric' })
  const chatWindow = useRef<HTMLDivElement>(null);
  const [minimized, setMinimized] = useState(true);
  const [showChatAgent, setShowChatAgent] = useState(false)
  const [validEmail, setValidEmail] = useState(true)
  const [validUserName, setValidUserName] = useState(true)
  const [typing, setTyping] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    email: ''
  })
  const [tabhidden, setTabhidden] = useState(false)
  useEffect(() => {
    if (!tabhidden) {
      changeFav('/trademarktoday.ico')
    }
  }, [tabhidden])
  const [notificationMessage, setNotificationMessage] = useState('')
  const handleUserData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  }
  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabhidden(document.hidden)
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [])
  useEffect(() => {
    return () => {
      if (socket) {
        // socket.disconnect();
        socket = undefined;
      }
    };
  }, []);

  const socketInitializer = async ({ username, email }: any) => {
    // We just call it because we don't need anything else out of it
    await fetch(`/api/chatsocket`); // Pass the channel as a query parameter

    socket = io();//io({ query: { channel: JSON.stringify(channels) } }); // Pass the channel as a query parameter when initializing the socket connection
    socket.emit('joinChannel', { channel: email, username });

    socket.on('newIncomingTyping', ({ channel, author, message }: Message) => {
      setTyping(message == 'start');
    });
    socket.on('newIncomingViewed', ({ channel, author, message }: Message) => {
      setMessages(prev => prev.map(msg => ({ ...msg, viewed: true })))
    })
    socket.on('deliveredToSerer', ({ key }: Message) => {
      setMessages(prev => prev.map(msg => (msg.key === key ? { ...msg, deliveredToServer: true } : msg)))
    })
    socket.on("newIncomingRepeatMsg", ({ key }: Message) => {

      setMessages(prev => prev.map(msg => (msg.key === key ? { ...msg, deliveredToClient: true } : msg)))
    });
    socket.on("newIncomingMessage", (msg: Message) => {
      socket?.emit("repeatMsg", { channel: msg.channel, author: username, message: msg.message, key: msg.key })
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: msg.author, message: msg.message, channel: email, viewed: false, key: msg.key, time: timeGenerate() },
      ]);
      setTabhidden((th) => {
        if (th) {
            setNotificationMessage(`${msg.author}:${msg.message}`)
            changeFav('/trademarktoday-badge.ico')
        }
        return th;
    })
      socket?.emit("viewed", { channel: email, author: username, message: 'viewed' })
    });
    socket.on('disconnected', (msg: Message) => {
      console.log('disconnected');
      alert('disconnected');
    });

  };
  useEffect(() => {
    if (chatWindow.current) {
      chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
    }
    if (messages.length > 1) {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, [messages])
  const sendMessage = async () => {
    if (message.trim() === '') return;
    const key = generateRandomKey(16)
    socket?.emit("createdMessage", { channel: userData.email, author: userData.username, message, key });
    setMessages((currentMsg) => [
      ...currentMsg,
      { author: userData.username, channel: userData.email, message, key, viewed: false, deliveredToClient: false, deliveredToServer: false, time: timeGenerate() }
    ]);
    setMessage("");
  };
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleToutTypeEnd = () => {
    timeoutRef.current = null;
    socket?.emit("typing", { channel: userData.email, author: userData.username, message: 'end' });
  }
  const handleKeypress = (e: KeyboardEvent<HTMLInputElement>) => {
    //it triggers by pressing the enter key
    if (e.keyCode === 13) {
      if (message) {
        sendMessage();
      }
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(handleToutTypeEnd, 1000);
    } else {
      socket?.emit("typing", { channel: userData.email, author: userData.username, message: 'start' });
      timeoutRef.current = setTimeout(handleToutTypeEnd, 1000);
    }
  };

  const handleShowChat = () => {
    const _json = JSON.parse(localStorage.getItem('userData') as string);
    const _messages = JSON.parse(localStorage.getItem('messages') as string);
    if (_messages && !(Object.keys(_messages).length === 0 && _messages.constructor === Object)) {
      setMessages(_messages);
    }
    if (_json && !(Object.keys(_json).length === 0 && _json.constructor === Object)) {
      setUserData(_json);
    }
    if (!socket) {// 
      if (_json && !(Object.keys(_json).length === 0 && _json.constructor === Object)) {
        socketInitializer({ username: _json.username, email: _json.email });
        setMinimized(false)
      } else {
        setShowChatAgent(true)
      }
    } else {
      socket.emit('joinChannel', { channel: _json.email, username: _json.username });
      setMinimized(false)
    }
    console.log(socket)
  }
  const handleInitChat = () => {
    setValidUserName(userData.username.trim() !== '');
    setValidEmail(validateEmail(userData.email));
    if (userData.username.trim() === '' || !validateEmail(userData.email)) {
      return;
    }
    localStorage.setItem('userData', JSON.stringify(userData));
    socketInitializer({ username: userData.username, email: userData.email });
    setShowChatAgent(false)
    setMinimized(false)
  }
  return (
    <>
      <NotificationComponent msg={notificationMessage} />
      <button onClick={handleShowChat} className="flex justify-center items-center rounded-full w-12 h-12 overflow-hidden cursor-pointer bg-white fixed right-3 bottom-3 shadow-[0_0_2px_2px_#888] hover:w-16 hover:h-16 transition-all ease-in-out duration-500 z-30 ">
        <Image src="/message.gif" loading='lazy' alt="Logo" width={40} height={40} />
      </button>
      <div className={`flex flex-col gap-2 justify-center items-center rounded-sm w-60 py-4 overflow-hidden bg-white fixed right-3 bottom-3 shadow-[0_0_2px_2px_#888] transition-all ease-in-out duration-500 ${showChatAgent ? 'h-[260px] opacity-100 z-[31]' : 'h-0 opacity-0 -z-10'}`}>
        <div className="w-full flex items-center">
          <div className="w-full text-center">Talk to agent please...</div>
          <div onClick={() => setShowChatAgent(false)} className="text-2xl w-8 flex justify-center mr-1 rounded-md cursor-pointer hover:bg-purple-500 hover:text-white transition-all ease-in-out duration-700">&times;</div>
        </div>
        <div className="flex flex-col">
          <input name='username' value={userData.username} onChange={handleUserData} className="border border-slate-300 rounded-sm p-2" placeholder="username" />
          <span className={`text-red-600 text-xs leading-6 w-full ${validUserName ? 'hidden' : ''}`}>Enter username.</span>
        </div>
        <div className="flex flex-col">
          <input name='email' value={userData.email} onChange={handleUserData} className="border border-slate-300 rounded-sm p-2" placeholder="email" />
          <span className={`text-red-600 text-xs leading-6 w-full ${validEmail ? 'hidden' : ''}`}>Invalid email</span>
        </div>
        <button onClick={handleInitChat} className="p-2 bg-yellow-600 text-white rounded-md hover:bg-purple-400 transition-all ease-in-out duration-700 active:bg-red-600">Chat with Agent</button>
      </div>
      <main className={`max-w-sm p-3 transition-all ease-in-out duration-700 ${minimized ? 'h-0 opacity-0 -z-10' : 'h-[500px] opacity-100 z-[32]'} fixed right-0 bottom-0`}>
        <div className="flex flex-col overflow-hidden justify-end bg-white h-full min-w-[33%] max-w-[100%] rounded-md shadow-[0_0_2px_2px_#999]">
          <div onClick={() => setMinimized(true)} className="flex justify-between cursor-pointer bg-[#373f86]">
            <div className="flex items-center gap-4 px-2 h-12 ">
              <div className={`w-2 h-2 ${true ? 'bg-green-500' : 'bg-gray-300'} rounded-full`} />
              <h6 className="text-white text-sm">Trademarktoday Agent</h6>
            </div>
            <h6 className="flex items-center p-2 text-xl text-white hover:bg-blue-600 transition-all ease-in-out"> &times; </h6>
          </div>
          <div ref={chatWindow} className="h-full last:border-b-0 overflow-y-auto overflow-x-clip aside-scrollbars-gray scroll-smooth">
            <style jsx>{`
                    .aside-scrollbars-gray::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                    }
                    .aside-scrollbars-gray::-webkit-scrollbar-thumb {
                      border-radius: 0.25rem;
                      background-color: #8d8d8d;
                    }
                    .aside-scrollbars-gray::-webkit-scrollbar-track {
                      background-color: #e2e2e2;
                    }
                `}</style>
            {messages.map((msg, i) => {
              return (
                <div key={i}>
                  {(msg.author !== userData.username) ?
                    <>
                      <h6 className="w-full text-left px-4 text-[12px]">From:{msg.author}</h6>
                      <div className="flex justify-start border-b border-gray-200 pb-2">
                        <div className="relative w-fit max-w-[90%]">
                          <div className="chat-content break-words break-all w-fit py-1 px-2 bg-yellow-700 text-white rounded-md mx-4 overflow-visible" >
                            {msg.message} <small className="text-[0.5rem]">{msg.time}</small>
                          </div>
                          <div className="absolute bottom-[0px] left-[9px] w-3 h-3 bg-yellow-700" />
                          <div className="absolute bottom-[0px] -left-[4px] w-5 h-5 bg-white rounded-full" />
                        </div>
                      </div>
                    </> :
                    <>
                      <h6 className="w-full text-right px-4 text-[12px]">Me</h6>
                      <div className="flex justify-end border-b border-gray-200 pb-2">
                        <div className="relative w-fit max-w-[90%]">
                          <div className={`chat-content break-words break-all w-fit py-1 px-2 pr-6 ${true /* msg.deliveredToServer */ ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'}  rounded-md mx-4 overflow-visible`} >
                            {msg.message} <small className="text-[0.5rem]">{msg.time}</small>
                          </div>
                          {msg.deliveredToClient &&
                            <div className="absolute bottom-[6px] right-[20px] w-3 h-3 z-50 text-white text-xs" >&#10003;</div>
                          }
                          {msg.viewed &&
                            <div className="absolute bottom-[6px] right-[17px] w-3 h-3 z-50 text-white text-xs" >&#10003;</div>
                          }
                          <div className="absolute bottom-[0px] right-[9px] w-3 h-3 bg-blue-500" />
                          <div className="absolute bottom-[0px] -right-[4px] w-5 h-5 bg-white rounded-full" />
                        </div>
                      </div>
                    </>
                  }
                </div>
              );
            })}
          </div>
          {
            typing &&
            <div className="flex items-center pl-4">typing<Image alt="image" loading='lazy' src='/typing2.gif' width={20} height={20} style={{ height: '20px' }} /></div>
          }
          <div className="border-t border-gray-300 w-full flex rounded-bl-md">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              className="outline-none py-2 px-2 rounded-bl-md flex-1"
              onChange={(e) => setMessage(e.target.value)}
              onKeyUp={handleKeypress}
            />
            <div className="border-l border-gray-300 flex justify-center items-center  rounded-br-md group hover:bg-purple-500 transition-all">
              <button
                className="group-hover:text-white px-3 h-full"
                onClick={() => {
                  sendMessage();
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </main >
    </>
  );
}
