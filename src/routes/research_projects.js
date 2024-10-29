import { Router } from "express";
import db from "../utils/db.js";

const router = Router();

// Route to render the conferences dashboard
router.get('/research_projects', async (req, res) => {
    try {
        // const conferencesResult = await db.query(`SELECT * FROM conferences`);
        res.render("research_projects_prof.ejs");
    } catch (err) {
        console.error("Error fetching sampleboard:", err);
        res.status(500).send("Server error");
    }
});

export default router;