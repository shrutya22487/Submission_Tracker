import { Router } from "express";
import db from "../utils/db.js";
import student_dashboard from "./student_routes/student_dashboard.js";
import prof_dashboard from "./prof_routes/prof_dashboard.js";

const router = Router();

router.use(student_dashboard);
router.use(prof_dashboard);

function isStudent(email) {
    const studentEmailPattern = /^[a-zA-Z]+[0-9]{5}@iiitd\.ac\.in$/;
    return studentEmailPattern.test(email);
}

router.get("/dashboard", (req, res) => {
    // console.log(req.user);
    if (req.isAuthenticated()) {
        try {
            if (isStudent(req.user.email_id)) {
                res.redirect("/student_dashboard/profs");
            }
            else
                res.redirect("/prof_dashboard/students");
        } catch (err) {
            console.log(err);
            res.status(500).send("Server error");
        }
    } else {
        res.redirect("/login");
    }
});

router.post('/delete_job/:id', async (req, res) => {
    const jobId = req.params.id;
    try {
        // Assuming you have a jobs table in your database
        await db.query('DELETE FROM jobs WHERE id = $1', [jobId]);

        // Redirect back to the student dashboard after deletion
        res.redirect('/student_dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


export default router;
