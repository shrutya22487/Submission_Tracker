import db from "../utils/db.js";
import router from "../routes/prof_routes/under_review_papers.js";

export async function get_prof_id(req, res) {
    try {
        const prof_id_result = await db.query(
            `SELECT id FROM Professor WHERE email_id = $1`,
            [req.user.email_id]
        );

        if (prof_id_result.rows.length === 0) {
            console.log("No Professor found with the given email. Redirecting to login...");
            return res.redirect('/login'); // Redirect to login page
        }

        return prof_id_result.rows[0].id; // Return the professor ID
    } catch (error) {
        console.error("Error retrieving professor ID:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function get_student_id(req, res) {
    try {
        const student_id_result = await db.query(
            `SELECT id FROM Student WHERE email_id = $1`,
            [req.user.email_id]
        );

        if (student_id_result.rows.length === 0) {
            console.log("No Student found with the given email. Redirecting to login...");
            return res.redirect('/login'); // Redirect to login page
        }

        return student_id_result.rows[0].id; // Return the student ID
    } catch (error) {
        console.error("Error retrieving student ID:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export function check_authentication(req, res, next) {
    if (req.isAuthenticated()) {
        return next();

    } else {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
}

export async function get_prof_name(req, res, id) {
    try {
        const data = await db.query(
            `SELECT Name FROM Professor WHERE id = $1`, [id,]);
        return data.rows[0];
    } catch (error) {
        console.error("Error executing query:", error);
        res.status(500).send("Internal server error");
    }
}