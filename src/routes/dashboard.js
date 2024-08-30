import { Router } from "express";
import db from "../utils/db.js";
import student_dashboard from "./student_dashboard.js";
import prof_dashboard from "./prof_dashboard.js";

const router = Router();

// TODO: 4. make mapping for student and prof

router.use(student_dashboard);
router.use(prof_dashboard);

function isStudent(email) {
    const studentEmailPattern = /^[a-zA-Z]+[0-9]{5}@iiitd\.ac\.in$/;
    return studentEmailPattern.test(email);
}

router.get("/dashboard", (req, res) => {
    console.log(req.user);
    if (req.isAuthenticated()) {
        try {
            if (isStudent(req.user.email_id)) {
                res.redirect("/student_dashboard");
            }
            else
                res.redirect("/prof_dashboard");
        } catch (err) {
            console.log(err);
            res.status(500).send("Server error");
        }
    } else {
        res.redirect("/login");
    }
});

export default router;
