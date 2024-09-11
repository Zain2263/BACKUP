const express = require("express");
const { BatchCommentsRight, reqSignIn } = require("../../middlewares/auth");
const { addComment, getAllComments, updateComment, deleteComment, addReply, updateReply, getAllReplies, deleteReply } = require("../../controllers/lms/btch_comment_cntrl");
const router = express.Router();


// admins & cords
router.post("/add-comment/:batchId", reqSignIn, BatchCommentsRight, addComment );
router.get('/all-comments/:batchId', reqSignIn, BatchCommentsRight, getAllComments )
router.put("/update-comment/:id", reqSignIn, BatchCommentsRight, updateComment );
router.delete("/delete-comment/:id", reqSignIn, BatchCommentsRight, deleteComment);

// replies routers
router.post("/add-reply/:id", reqSignIn, BatchCommentsRight, addReply);
router.get('/all-replies/:id', reqSignIn, BatchCommentsRight,getAllReplies )
router.put("/update-reply/:id", reqSignIn, BatchCommentsRight, updateReply);
router.delete("/delete-reply/:id", reqSignIn, BatchCommentsRight, deleteReply);



module.exports = router;
