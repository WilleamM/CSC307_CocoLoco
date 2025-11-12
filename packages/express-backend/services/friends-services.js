import './db-connection.js';
import User from '../schema/user.js';

function addFriend(userId, friendId) {
  const update1 = User.findByIdAndUpdate(userId, {
    $addToSet: { friendIds: friendId },
  });
  const update2 = User.findByIdAndUpdate(friendId, {
    $addToSet: { friendIds: userId },
  });
  return Promise.all([update1, update2]);
}

function removeFriend(userId, friendId) {
  const update1 = User.findByIdAndUpdate(userId, {
    $pull: { friendIds: friendId },
  });

  const update2 = User.findByIdAndUpdate(friendId, {
    $pull: { friendIds: userId },
  });

  return Promise.all([update1, update2]);
}

export default { addFriend, removeFriend };
