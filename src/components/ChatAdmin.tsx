import io, { Socket } from "socket.io-client";
import { useState, useEffect, KeyboardEvent, useRef } from "react";
import { Message } from "@/types/interface";
import Image from "next/image";
import { generateRandomKey } from "@/types/utils";
import NotificationComponent from "./NotificationComponent";
import { timeGenerate } from "./Chat";
export const changeFav = (fav: string) => {
    let link: any = document.querySelector("link[rel~='icon']");
    if (!link) {
        // Create a new link element if it doesn't exist
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = fav;
}
let socket: Socket;
export default function ChatAdmin() {
    const [message, setMessage] = useState('');
    const [tabhidden, setTabhidden] = useState(false)
    const [messagesAndCurChannel, setMessagesAndCurChannel] = useState<{ messages: { [key: string]: Array<Message> }, curChannel: string }>({
        messages: {},
        curChannel: ''
    });//[{ author: 'Chatbot', message: 'Start chat here.' }]
    const chatWindow = useRef<HTMLDivElement>(null);

    const [channels, setChannels] = useState<{ name: string, unreadCount: number, displayName: string, typing?: boolean }[]>([]);

    const handleVisibilityChange = () => {
        setTabhidden(document.hidden);
    };
    useEffect(() => {
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [])
    useEffect(() => {
        socketInitializer();
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);
    const [notificationMessage, setNotificationMessage] = useState('')
    const handleNewIncomingMessage = (msg: Message) => {
        socket.emit("repeatMsg", { channel: msg.channel, author: msg.author, message: msg.message, key: msg.key })
        setMessagesAndCurChannel((currentMsgsAndCurChannel) => {
            if (currentMsgsAndCurChannel.curChannel !== msg.channel) {
                setChannels(prev => {
                    prev = prev.map(chn => (chn.name !== msg.channel ? chn : ({ name: chn.name, unreadCount: chn.unreadCount + 1, displayName: chn.displayName })));
                    prev.sort((a, b) => b.unreadCount - a.unreadCount);
                    return prev;
                })
            } else {
                socket.emit("viewed", { channel: currentMsgsAndCurChannel.curChannel, author: 'Trademarktoday agent', message: 'viewed' })
            }
            const prev_msg = (currentMsgsAndCurChannel.messages && currentMsgsAndCurChannel.messages[msg.channel]) ? currentMsgsAndCurChannel.messages[msg.channel] : []
            return {
                ...currentMsgsAndCurChannel,
                messages: {
                    ...currentMsgsAndCurChannel.messages, [msg.channel]: [...prev_msg, { author: msg.author, message: msg.message, channel: msg.channel, viewed: false, key: msg.key, time: timeGenerate() }]
                }
            }
        })
        setTabhidden((th) => {
            if (th) {
                setNotificationMessage(`${msg.author}:${msg.message}`)
                changeFav('/trademarktoday-badge.ico')
            }
            return th;
        })

    }
    useEffect(() => {
        if (!tabhidden) {
            changeFav('/trademarktoday.ico')
        }
    }, [tabhidden])
    const handleChannelCreated = ({ channel: chn, username }: { channel: string, username: string }) => {
        console.log(channels, chn)
        socket.emit('joinChannel', { channel: chn, username: 'admin' });
        setChannels(prevChannels => {
            if (prevChannels.every(item => item.name !== chn)) {
                return [...prevChannels, { name: chn, unreadCount: 0, displayName: username }];
            }
            return prevChannels;
        });
        setMessagesAndCurChannel((currentMsgsAndCurChannel) => {
            return {
                ...currentMsgsAndCurChannel,
                curChannel: (chn && currentMsgsAndCurChannel.curChannel.trim() === '') ? chn : currentMsgsAndCurChannel.curChannel
            }
        })

    }
    const handleNewIncomingTyping = ({ channel, author, message }: Message) => {
        setChannels(prev => prev.map(chn => (chn.name !== channel ? chn : ({ ...chn, typing: message === 'start' }))))
    }
    const handleNewIncomingViewed = ({ channel, author, message }: Message) => {
        setMessagesAndCurChannel((currentMsgsAndCurChannel) => {
            const prev_msg = (currentMsgsAndCurChannel.messages && currentMsgsAndCurChannel.messages[channel]) ? currentMsgsAndCurChannel.messages[channel] : []
            return {
                ...currentMsgsAndCurChannel,
                messages: {
                    ...currentMsgsAndCurChannel.messages, [channel]: [...prev_msg.map(msg => ({ ...msg, viewed: true }))]
                }
            }
        });
    }
    const handleNewIncomingRepeatMsg = ({ key }: Message) => {
        setMessagesAndCurChannel((currentMsgsAndCurChannel) => {
            const prev_msg = (currentMsgsAndCurChannel.messages && currentMsgsAndCurChannel.messages[currentMsgsAndCurChannel.curChannel]) ? currentMsgsAndCurChannel.messages[currentMsgsAndCurChannel.curChannel] : []
            return {
                ...currentMsgsAndCurChannel,
                messages: {
                    ...currentMsgsAndCurChannel.messages,
                    [currentMsgsAndCurChannel.curChannel]: prev_msg.map(msg => (msg.key === key ? { ...msg, deliveredToClient: true } : msg))
                }

            }
        });
    }
    const handleDeliveredToserver = ({ key }: Message) => {
        setMessagesAndCurChannel((currentMsgsAndCurChannel) => {
            const prev_msg = (currentMsgsAndCurChannel.messages && currentMsgsAndCurChannel.messages[currentMsgsAndCurChannel.curChannel]) ? currentMsgsAndCurChannel.messages[currentMsgsAndCurChannel.curChannel] : []
            return {
                ...currentMsgsAndCurChannel,
                messages: {
                    ...currentMsgsAndCurChannel.messages,
                    [currentMsgsAndCurChannel.curChannel]: prev_msg.map(msg => (msg.key === key ? { ...msg, deliveredToServer: true } : msg))
                }

            }
        });
    }
    // useEffect(() => { //! Check this section.
    //     if (socket) {
    //         socket.on("channelCreated", handleChannelCreated);
    //         socket.on("newIncomingMessage", handleNewIncomingMessage);
    //         socket.on('newIncomingTyping', handleNewIncomingTyping)
    //         socket.on('newIncomingViewed', handleNewIncomingViewed)
    //         socket.on("newIncomingRepeatMsg", handleNewIncomingRepeatMsg);
    //     }
    //     // Clean up the event listener when curChannel changes or component unmounts
    //     return () => {
    //         if (!socket) return;
    //         socket.off("channelCreated", handleChannelCreated);
    //         socket.off("newIncomingMessage", handleNewIncomingMessage);
    //         socket.off('newIncomingTyping', handleNewIncomingTyping)
    //         socket.off('newIncomingViewed', handleNewIncomingViewed)
    //         socket.off("newIncomingRepeatMsg", handleNewIncomingRepeatMsg);
    //     };
    // }, [curChannel, channels])
    const socketInitializer = async () => {
        // We just call it because we don't need anything else out of it
        await fetch(`/api/chatsocket`); // Pass the channel as a query parameter


        socket = io();//io({ query: { channel: JSON.stringify(channels) } }); // Pass the channel as a query parameter when initializing the socket connection
        socket.on("channelCreated", handleChannelCreated);
        socket.on("newIncomingMessage", handleNewIncomingMessage);
        socket.on('deliveredToSerer', handleDeliveredToserver)
        socket.on('newIncomingTyping', handleNewIncomingTyping)
        socket.on('newIncomingViewed', handleNewIncomingViewed)
        socket.on("newIncomingRepeatMsg", handleNewIncomingRepeatMsg)
        socket.emit('joinChannel', { channel: 'admin', username: 'admin_initial' });
        socket.on('updateChannels', (updatedChannels: string[]) => {
            // setChannels(updatedChannels.map(chn => ({ name: chn, unreadCount: 0 })));
        });
        socket.on('disconnected', (msg: Message) => {
            console.log('disconnected');
            alert('disconnected');
        });

    };
    useEffect(() => {
        if ((channels.find(chn => chn.name === messagesAndCurChannel.curChannel)?.unreadCount as number) > 0) {
            socket.emit("viewed", { channel: messagesAndCurChannel.curChannel, author: 'Trademarktoday agent', message: 'viewed' })
        }
        setChannels(prev => prev.map(chn => (chn.name !== messagesAndCurChannel.curChannel ? chn : ({ ...chn, unreadCount: 0 }))))
    }, [messagesAndCurChannel])
    useEffect(() => {
        if (chatWindow.current) {
            chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
        }
    }, [messagesAndCurChannel])
    const sendMessage = async () => {
        if (message.trim() === '') return;
        // channels.filter(chn => chn !== 'admin').forEach(chn => socket.emit("createdMessage", { channel: chn, author: 'Trademarktoday agent', message }))
        const key = generateRandomKey(16);
        socket.emit("createdMessage", { channel: messagesAndCurChannel.curChannel, author: 'Trademarktoday agent', message, key })
        setMessagesAndCurChannel((currentMsgsAndCurChannel) => {
            const prev_msg = (currentMsgsAndCurChannel.messages && currentMsgsAndCurChannel.messages[currentMsgsAndCurChannel.curChannel]) ? currentMsgsAndCurChannel.messages[currentMsgsAndCurChannel.curChannel] : []
            return {
                ...currentMsgsAndCurChannel,
                messages: {
                    ...currentMsgsAndCurChannel.messages,
                    [currentMsgsAndCurChannel.curChannel]:
                        [...prev_msg,
                        { author: 'admin', message: message, channel: 'admin', key, viewed: false, deliveredToClient: false, deliveredToServer: false, time: timeGenerate() }]
                }

            }
        });
        setMessage("");
    };
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const handleToutTypeEnd = () => {
        timeoutRef.current = null;
        socket.emit("typing", { channel: messagesAndCurChannel.curChannel, author: 'admin', message: 'end' });
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
            socket.emit("typing", { channel: messagesAndCurChannel.curChannel, author: 'admin', message: 'start' });
            timeoutRef.current = setTimeout(handleToutTypeEnd, 1000);
        }
    };




    return (
        <>
            <NotificationComponent msg={notificationMessage} />
            <div className="w-full h-full flex gap-4">
                <div className="flex flex-col gap-1 justify-start px-4 w-2/5 h-full pt-4">
                    {channels.filter(chn => chn.name !== 'admin').map((chn, i) =>
                        <div key={i} onClick={() => setMessagesAndCurChannel(prev => ({ ...prev, curChannel: chn.name }))} className={`border border-[#ddd] p-3 break-all rounded-md cursor-pointer relative ${messagesAndCurChannel.curChannel === chn.name ? 'bg-[#373f86] text-white' : ''} hover:bg-[#ddd] transition-all ease-in-out duration-700`}>
                            {chn.displayName}
                            {chn.unreadCount > 0 &&
                                <div className="w-fit min-w-[20px] h-5 flex justify-center items-center rounded-full bg-pink-600 absolute right-0 top-0 text-white p-1 text-xs">{chn.unreadCount}</div>
                            }
                            {chn.typing && <Image className="absolute -right-6 top-0" alt="image" loading='lazy' src='/typing2.gif' width={20} height={20} />}
                        </div>
                    )}
                </div>
                <div className="w-full">
                    <main className={`p-3 transition-all ease-in-out duration-700 h-[500px] opacity-100 `}>
                        <div className="flex flex-col overflow-hidden justify-end bg-white h-full w-full rounded-md shadow-[0_0_2px_2px_#999]">
                            <div className="flex justify-between cursor-pointer bg-[#373f86]">
                                <div className="flex items-center gap-4 px-2 h-12 ">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <h6 className="text-white text-sm">{messagesAndCurChannel.curChannel} {channels.find(chn => chn.name === messagesAndCurChannel.curChannel)?.typing && <span> is typing...</span>}</h6>
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
                                {messagesAndCurChannel.messages[messagesAndCurChannel.curChannel]?.map((msg, i) => {
                                    return (
                                        <div key={i}>
                                            {(msg.author !== 'admin') ?
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
                                                            <div className="chat-content break-words break-all w-fit py-1 px-2 pr-6 bg-blue-500 text-white rounded-md mx-4 overflow-visible" >
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
                                channels.find(chn => chn.name === messagesAndCurChannel.curChannel)?.typing &&
                                <div className="flex items-center pl-4">typing<Image alt="image" loading='lazy' src='/typing2.gif' width={20} height={20} style={{ height: '20px' }} /></div>
                            }
                            <div className="border-t border-gray-300 w-full flex rounded-bl-md items-center">

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
                    </main>
                </div>
            </div>
        </>
    );
}
