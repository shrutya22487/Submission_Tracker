import { Router } from "express";
import db from "../utils/db.js";

const router = Router();

// Route to render the conferences dashboard
router.get('/conferences', async (req, res) => {
    try {
        const conferencesResult = await db.query(`SELECT * FROM conferences`);
        res.render("prof_conferences.ejs", { conferences: conferencesResult.rows });
    } catch (err) {
        console.error("Error fetching conferences:", err);
        res.status(500).send("Server error");
    }
});

// Route to add a new conference
router.post('/conferences', async (req, res) => {
    const { conference_name, deadline, website_link } = req.body;

    try {
        await db.query(
            `INSERT INTO conferences (conference_name, deadline, website_link) VALUES ($1, $2, $3)`,
            [conference_name, deadline, website_link]
        );
        res.redirect("/conferences");
    } catch (err) {
        console.error("Error adding conference:", err);
        res.status(500).send("Server error");
    }
});

// Route to delete a conference
router.post('/delete_conference/:id', async (req, res) => {
    const conferenceId = req.params.id;

    try {
        await db.query(`DELETE FROM conferences WHERE conference_id = $1`, [conferenceId]);
        res.redirect("/conferences");
    } catch (err) {
        console.error("Error deleting conference:", err);
        res.status(500).send("Server error");
    }
});

export default router;
