import './db-connection.js';
import Group from '../schema/group.js';
import User from '../schema/user.js';

function getAllGroups() {
  return Group.find().lean();
}

function createGroup({
  groupName,
  visibility = 'private',
  password = '',
  description = '',
  iconUrl = '',
  ownerId,
}) {
  return Group.create({
    groupName,
    visibility,
    password,
    description,
    iconUrl,
    userIds: [ownerId],
    ownerIds: [ownerId],
  });
}

// you need the group password to join a group
function joinGroup({ groupId, userId, password = '' }) {
  return Group.findById(groupId).then((group) => {
    if (!group) throw new Error('Group not found');
    if (group.visibility === 'private') throw new Error('Group is private');
    if (group.password && group.password !== password)
      throw new Error('Incorrect password');

    // Return both updates as a combined Promise
    const groupUpdate = Group.findByIdAndUpdate(groupId, {
      $addToSet: { userIds: userId },
    });
    const userUpdate = User.findByIdAndUpdate(userId, {
      $addToSet: { groupIds: groupId },
    });

    return Promise.all([groupUpdate, userUpdate]);
  });
}

export default {
  getAllGroups,
  createGroup,
  joinGroup,
};
