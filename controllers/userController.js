const { ObjectId } = require('mongoose').Types;
const {User} = require('../models');

const usersController = {
    
    //create 
    createUser({body}, res) {
        User.create(body)
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => res.status(400).json(err));
    },

    //get All
    getUsers(req, res) {
        User.find({})
        .populate({path: 'thoughts', select: '-__v'})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
    
        .then(dbUsersData => res.json(dbUsersData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    //get user by ID
    getSingleUser({params}, res) {
        Users.findOne({_id: params.id })
        .populate({path: 'thoughts', select: '-__v'})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({message: 'No User with this ID!'});
                return; 
            }
            res.json(dbUsersData)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },

    //update user
    updateUser({params, body}, res) {
        Users.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({message: 'No User with this ID!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.json(err))
    },

    deleteUser({params}, res) {
        Users.findOneAndDelete({_id: params.id})
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({message: 'No User with this ID!'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.status(400).json(err));
    },

    addFriend({params}, res) {
        Users.findOneAndUpdate({_id: params.id}, {$push: { friends: params.friendId}}, {new: true})
        .populate({path: 'friends', select: ('-__v')})
        .select('-__v')
        .then(dbUsersData => {
            if (!dbUsersData) {
                res.status(404).json({message: 'No User with this ID!'});
                return;
            }
        res.json(dbUsersData);
        })
        .catch(err => res.json(err));
    },

    //delete friend
    deleteFriend({ params }, res) {
        Users.findOneAndUpdate({_id: params.id}, {$pull: { friends: params.friendId}}, {new: true})
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then(dbUsersData => {
            if(!dbUsersData) {
                res.status(404).json({message: 'No User with this ID!'});
                return;
            }
            res.json(dbUsersData);
        })
        .catch(err => res.status(400).json(err));
    }

};

module.exports = usersController; 

// const { ObjectId } = require('mongoose').Types;
// const { Student, Course } = require('../models');

// // Aggregate function to get the number of students overall
// const headCount = async () =>
//   Student.aggregate()
//     .count('studentCount')
//     .then((numberOfStudents) => numberOfStudents);

// // Aggregate function for getting the overall grade using $avg
// const grade = async (studentId) =>
//   Student.aggregate([
//     // only include the given student by using $match
//     { $match: { _id: ObjectId(studentId) } },
//     {
//       $unwind: '$assignments',
//     },
//     {
//       $group: {
//         _id: ObjectId(studentId),
//         overallGrade: { $avg: '$assignments.score' },
//       },
//     },
//   ]);

// module.exports = {
//   // Get all students
//   getStudents(req, res) {
//     Student.find()
//       .then(async (students) => {
//         const studentObj = {
//           students,
//           headCount: await headCount(),
//         };
//         return res.json(studentObj);
//       })
//       .catch((err) => {
//         console.log(err);
//         return res.status(500).json(err);
//       });
//   },
//   // Get a single student
//   getSingleStudent(req, res) {
//     Student.findOne({ _id: req.params.studentId })
//       .select('-__v')
//       .then(async (student) =>
//         !student
//           ? res.status(404).json({ message: 'No student with that ID' })
//           : res.json({
//               student,
//               grade: await grade(req.params.studentId),
//             })
//       )
//       .catch((err) => {
//         console.log(err);
//         return res.status(500).json(err);
//       });
//   },
//   // create a new student
//   createStudent(req, res) {
//     Student.create(req.body)
//       .then((student) => res.json(student))
//       .catch((err) => res.status(500).json(err));
//   },
//   // Delete a student and remove them from the course
//   deleteStudent(req, res) {
//     Student.findOneAndRemove({ _id: req.params.studentId })
//       .then((student) =>
//         !student
//           ? res.status(404).json({ message: 'No such student exists' })
//           : Course.findOneAndUpdate(
//               { students: req.params.studentId },
//               { $pull: { students: req.params.studentId } },
//               { new: true }
//             )
//       )
//       .then((course) =>
//         !course
//           ? res.status(404).json({
//               message: 'Student deleted, but no courses found',
//             })
//           : res.json({ message: 'Student successfully deleted' })
//       )
//       .catch((err) => {
//         console.log(err);
//         res.status(500).json(err);
//       });
//   },

//   // Add an assignment to a student
//   addAssignment(req, res) {
//     console.log('You are adding an assignment');
//     console.log(req.body);
//     Student.findOneAndUpdate(
//       { _id: req.params.studentId },
//       { $addToSet: { assignments: req.body } },
//       { runValidators: true, new: true }
//     )
//       .then((student) =>
//         !student
//           ? res
//               .status(404)
//               .json({ message: 'No student found with that ID :(' })
//           : res.json(student)
//       )
//       .catch((err) => res.status(500).json(err));
//   },
//   // Remove assignment from a student
//   removeAssignment(req, res) {
//     Student.findOneAndUpdate(
//       { _id: req.params.studentId },
//       { $pull: { assignment: { assignmentId: req.params.assignmentId } } },
//       { runValidators: true, new: true }
//     )
//       .then((student) =>
//         !student
//           ? res
//               .status(404)
//               .json({ message: 'No student found with that ID :(' })
//           : res.json(student)
//       )
//       .catch((err) => res.status(500).json(err));
//   },
// };
