const redisClient = require('../redis');


module.exports.authorizeUser = (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log("Bad request!");
    next(new Error("Not authorized"));
  } else {
    next();
  }
};

module.exports.initializeUser = async socket => {
  socket.user = { ...socket.request.session.user };
  socket.join(socket.user.userid)
  await redisClient.hset(
    `userid:${socket.user.username}`,
    "userid",
    socket.user.userid,
    "connected",
    true
  );
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  const parsedFriendList = await parseFriendList(friendList)
  const friendRooms = parsedFriendList.map(friend => friend.userid);
  if (friendRooms.length > 0) {
    socket.to(friendRooms).emit("connected", true, socket.user.username);
  }

  socket.emit("friends", parsedFriendList);

  const msgQuery = await redisClient.lrange(`chat:${socket.user.userid}`,
  0,
  -1
  );
  const messages = msgQuery.map(msgStr => {
    const parsedStr = msgStr.split(".");
    return {to: parsedStr[0], from: parsedStr[1], content: parsedStr[2] };
  });
  if (messages && messages.length > 0) {
    socket.emit("messages", messages);
  }
};


module.exports.addFriend = async (socket, friendName, cb) => {
  if (friendName === socket.user.username) {
    cb({done:false, errorMsg: "Cannot add self!"})
    return;
  }
  const friend = await redisClient.hgetall(
    `userid:${friendName}`
  );
  const currentFriendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );

  if (!friend.userid) {
    cb({done:false, errorMsg: "User does not exist!"})
    return;
  }
  const friendKey = `${friendName}.${friend.userid}`;
  if (currentFriendList && currentFriendList.includes(friendKey)) {
    cb({done:false, errorMsg: "Friend already added!"})
    return;
  }

  await redisClient.lpush(
    `friends:${socket.user.username}`,
    [friendName, friend.userid].join(".")
  );
  const newFriend = {
    username: friendName,
    userid: friend.userid,
    connected: friend.connected,
  }
  cb({ done: true, newFriend });
};

module.exports.onDisconnect = async (socket) => {
  await redisClient.hset(`userid:${socket.user.username}`,
  "connected",
  false
  );
  const friendList = await redisClient.lrange(`friends:${socket.user.username}`,
  0, -1);
  const friendRooms = await parseFriendList(friendList).then(friends => friends.map(friend => friend.userid))
  socket.to(friendRooms).emit("connected", false, socket.user.username);
}

const parseFriendList = async friendList => {
  const newFriendList = [];
  for (let friend of friendList) {
    const parseFriend = friend.split(".")
    const friendConnected = await redisClient.hget(`userid:${parseFriend[0]}`, "connected")
    newFriendList.push({
      username: parseFriend[0],
      userid: parseFriend[1],
      connected: friendConnected,
    });
  }
  return newFriendList;
};