const {Thought, Users} = require('../models');

const thoughtsController = {

    //create thought
    createThought({params, body}, res) {
        Thoughts.create(body)
        .then(({_id}) => {
            return Users.findOneAndUpdate({ _id: params.userId}, {$push: {thoughts: _id}}, {new: true});
        })
        .then(dbThoughtsData => {
            if(!dbThoughtsData) {
                res.status(404).json({message: 'No thoughts with this ID!'});
                return;
            }
            res.json(dbThoughtsData)
        })
        .catch(err => res.json(err)); 
    },

    //get all thoughts
    getThoughts(req,res) {
        Thoughts.find({})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtsData => res.json(dbThoughtsData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    //get thought by ID
    getSingleThought({params}, res) {
        Thoughts.findOne({ _id: params.id })
        .populate({path: 'reactions',select: '-__v'})
        .select('-__v')
        .then(dbThoughtsData => {
            if(!dbThoughtsData) {
            res.status(404).json({message: 'No thoughts with this ID!'});
            return;
        }
        res.json(dbThoughtsData)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    //update thought
    updateThought({params, body}, res) {
        Thoughts.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
        .populate({path: 'reactions', select: '-__v'})
        .select('-___v')
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({message: 'No thoughts with this ID!'});
                return;
            }
                res.json(dbThoughtsData);
        })
        .catch(err => res.json(err));
    },

    //delete thought
    deleteThought({params}, res) {
        Thoughts.findOneAndDelete({_id: params.id})
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({message: 'No thoughts with this particular ID!'});
                return;
            }
            res.json(dbThoughtsData);
            })
            .catch(err => res.status(400).json(err));
    },

    //add reaction
    addReaction({params, body}, res) {
        Thoughts.findOneAndUpdate({_id: params.thoughtId}, {$push: {reactions: body}}, {new: true, runValidators: true})
        .populate({path: 'reactions', select: '-__v'})
        .select('-__v')
        .then(dbThoughtsData => {
        if (!dbThoughtsData) {
            res.status(404).json({message: 'No thoughts with this ID!'});
            return;
        }
        res.json(dbThoughtsData);
        })
        .catch(err => res.status(400).json(err))

    },

    //delete reaction
    deleteReaction({params}, res) {
        Thoughts.findOneAndUpdate({_id: params.thoughtId}, {$pull: {reactions: {reactionId: params.reactionId}}}, {new : true})
        .then(dbThoughtsData => {
            if (!dbThoughtsData) {
                res.status(404).json({message: 'No thoughts with this ID!'});
                return;
            }
            res.json(dbThoughtsData);
        })
        .catch(err => res.status(400).json(err));
    }

};

module.exports = thoughtsController;

///////////////////////////////////
// const { Course, Student } = require('../models');

// module.exports = {
//   // Get all courses
//   getCourses(req, res) {
//     Course.find()
//       .then((courses) => res.json(courses))
//       .catch((err) => res.status(500).json(err));
//   },
//   // Get a course
//   getSingleCourse(req, res) {
//     Course.findOne({ _id: req.params.courseId })
//       .select('-__v')
//       .then((course) =>
//         !course
//           ? res.status(404).json({ message: 'No course with that ID' })
//           : res.json(course)
//       )
//       .catch((err) => res.status(500).json(err));
//   },
//   // Create a course
//   createCourse(req, res) {
//     Course.create(req.body)
//       .then((course) => res.json(course))
//       .catch((err) => {
//         console.log(err);
//         return res.status(500).json(err);
//       });
//   },
//   // Delete a course
//   deleteCourse(req, res) {
//     Course.findOneAndDelete({ _id: req.params.courseId })
//       .then((course) =>
//         !course
//           ? res.status(404).json({ message: 'No course with that ID' })
//           : Student.deleteMany({ _id: { $in: course.students } })
//       )
//       .then(() => res.json({ message: 'Course and students deleted!' }))
//       .catch((err) => res.status(500).json(err));
//   },
//   // Update a course
//   updateCourse(req, res) {
//     Course.findOneAndUpdate(
//       { _id: req.params.courseId },
//       { $set: req.body },
//       { runValidators: true, new: true }
//     )
//       .then((course) =>
//         !course
//           ? res.status(404).json({ message: 'No course with this id!' })
//           : res.json(course)
//       )
//       .catch((err) => res.status(500).json(err));
//   },
// };
