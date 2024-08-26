import { Server, Socket } from "socket.io";
import { Request, Response } from "express";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
let channels: { channel: string, username: string }[] = [];
export default function SocketHandler(req: any, res: any) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  const onConnection = async (socket: Socket) => {
    // const { channel: _chanelArr } = socket.handshake.query; // Extract the channel from the handshake query
    // const channels: string[] = JSON.parse(_chanelArr as string);

    //! here to handle START
    socket.on("createdMessage", ({ channel, author, message, key }: { channel: string, author: string, message: string, key: string }) => {
      socket.to(channel).emit(`newIncomingMessage`, { channel, author, message, key });
      socket.emit('deliveredToServer', { channel, author, message, key });
    });
    socket.on('typing', ({ channel, author, message }: { channel: string, author: string, message: 'start' | 'end' }) => {
      socket.to(channel).emit(`newIncomingTyping`, { channel, author, message });
    })
    socket.on('viewed', ({ channel, author, message }: { channel: string, author: string, message: string }) => {
      socket.to(channel).emit(`newIncomingViewed`, { channel, author, message });
    })
    socket.on('repeatMsg', ({ channel, author, message, key }: { channel: string, author: string, message: string, key: string }) => {
      socket.to(channel).emit(`newIncomingRepeatMsg`, { channel, author, message, key });
    })
    socket.on('joinChannel', ({ channel, username }) => {
      socket.join(channel);
      if (username !== 'admin' && !(new Set(channels.map(chs => chs.channel))).has(channel)) {
        channels = Array.from(new Set([...channels, { channel, username }])); // Add channel to the list only if it's not already present
      }
      if (username !== 'admin') {
        socket.to('admin').emit(`channelCreated`, { channel, username })
      }
      // io.emit('updateChannels', channels); // Notify all clients about the updated channel list
      if (username === 'admin_initial') {
        // socket.to('admin').emit(`updateChannels`, channels)
        console.log(channels);
        channels.filter(chn => chn.channel !== 'admin').forEach(chn => io.emit(`channelCreated`, { channel: chn.channel, username: chn.username }))
      }
      console.log('rooms', socket.rooms);
    });
    socket.on('disconnect', () => {
      console.log(`User disconnected: socket's Id = ${socket.id}`);
    });
    socket.emit('updateChannels', channels);
    //! here to handle END
  };

  // Define actions inside
  io.on("connection", onConnection);

  console.log("Setting up socket");
  res.end();
}