const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  deleteUser,
  updateUser,
  addFriend,
  deleteFriend,
  
} = require('../../controllers/userController');

// /api/user
router.route('/').get(getUsers).post(createUser);

// /api/user/:userId
router.route('/:userId').get(getSingleUser).put(updateUser).delete(deleteUser);

router.route('/:userID/friends/:friendId').post(addFriend).delete(deleteFriend)

module.exports = router;


