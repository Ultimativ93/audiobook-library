import express from "express";

const router = express.Router();

router.get("/InteraktivEditor", (req, res) => {
    res.redirect('http://localhost:3000');
});

export default router;