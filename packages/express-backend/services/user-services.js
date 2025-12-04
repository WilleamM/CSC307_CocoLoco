import './db-connection.js';
import User from '../schema/user.js';

function getAllUsers() {
  return User.find().lean();
}

function findUserById(id) {
  return User.findById(id).lean();
}

function findUserByIdForUpdate(id) {
  return User.findById(id); // Returns Mongoose document (not lean) for updates
}

function addUser(new_user) {
  return User.create(new_user);
}

function deleteUserById(id) {
  return User.findByIdAndDelete(id);
}

function updateUser(id, updates) {
  //this will update the User data if needed
  return User.findByIdAndUpdate(id, updates, { new: true });
}

function findUserByUserName(userName) {
  return User.findOne({ userName }).lean();
}

function getSuggestedUsers(userId) {
  return User.findById(userId)
    .then((user) => {
      if (!user) throw new Error('User not found');
      const followingIds = Array.isArray(user.following) ? user.following : [];

      return User.aggregate([
        { $match: { _id: { $ne: userId } } }, // excludes the logged-in user
        { $match: { _id: { $nin: followingIds } } }, // excludes followed users
        { $sample: { size: 3 } }, // randomly gets 3 users
        { $project: { userName: 1, displayName: 1, avatarUrl: 1 } }, // only the fields needed
      ]);
    })
    .catch((err) => {
      console.error('Error fetching suggested users:', err);
    });
}

function toggleFollow(userId, targetUserId) {
  if (String(userId) === String(targetUserId)) {
    return Promise.resolve({ updated: null, following: false });
  }

  let actingUser;
  let targetUser;

  return User.findById(userId)
    .then((user) => {
      actingUser = user;
      return User.findById(targetUserId);
    })
    .then((target) => {
      targetUser = target;
      if (!actingUser || !targetUser) {
        return null;
      }

      const isFollowing = (actingUser.friendIds || []).some(
        (id) => String(id) === String(targetUserId)
      );

      if (isFollowing) {
        actingUser.friendIds = (actingUser.friendIds || []).filter(
          (id) => String(id) !== String(targetUserId)
        );
        actingUser.following = Math.max((actingUser.following || 0) - 1, 0);
        targetUser.followers = Math.max((targetUser.followers || 0) - 1, 0);
      } else {
        actingUser.friendIds = [...(actingUser.friendIds || []), targetUserId];
        actingUser.following = (actingUser.following || 0) + 1;
        targetUser.followers = (targetUser.followers || 0) + 1;
      }

      return Promise.all([actingUser.save(), targetUser.save()]).then(() => ({
        updated: actingUser,
        following: !isFollowing,
        followers: targetUser.followers,
        followingCount: actingUser.following,
      }));
    });
}

export default {
  addUser,
  getAllUsers,
  findUserById,
  findUserByIdForUpdate,
  deleteUserById,
  updateUser,
  getSuggestedUsers,
  findUserByUserName,
  toggleFollow,
};
