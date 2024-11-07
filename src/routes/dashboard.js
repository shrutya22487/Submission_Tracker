import { Router } from "express";
import db from "../utils/db.js";
import student_dashboard from "./student_routes/student_dashboard.js";
import prof_dashboard from "./prof_routes/prof_dashboard.js";

const router = Router();

router.use(student_dashboard);
router.use(prof_dashboard);

router.get("/dashboard", (req, res) => {
    if (req.isAuthenticated()) {

        try {
            if (req.user.student) {
                // Redirect student to the student dashboard
                res.redirect("/student_dashboard/profs");
            } else {
                // Redirect professor to the professor dashboard
                res.redirect("/prof_dashboard/students");
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Server error");
        }
    } else {
        res.redirect("/login");
    }
});

export default router;
