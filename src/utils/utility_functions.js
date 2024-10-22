import db from "../utils/db.js";
import router from "../routes/prof_routes/under_review_papers.js";

export async function get_prof_id(req, res) {
    const prof_id_result = await db.query(
        `SELECT id FROM Professor WHERE email_id = $1`,
        [req.user.email_id]
    );
    if (prof_id_result.rows.length === 0) {
        console.log("No Professor found with the given email.");
        return res.status(404).send("Professor not found");
    }
    return prof_id_result.rows[0].id;
}

export async function get_unarchived_students(req, res) {
    let prof_id = await get_prof_id(req, res);
    return await db.query('SELECT * FROM Student WHERE id IN (SELECT Mapping.student_id FROM Mapping WHERE prof_id = $1 AND archived = FALSE)', [prof_id]);
}

export async function get_archived_students(req, res) {
    let prof_id = await get_prof_id(req, res);
    return await db.query('SELECT * FROM Student WHERE id IN (SELECT Mapping.student_id FROM Mapping WHERE prof_id = $1 AND archived = TRUE)', [prof_id]);
}

export async function get_unarchived_jobs(req, res) {
    let prof_id = await get_prof_id(req, res);
    return await db.query('SELECT * FROM Job WHERE student_id IN (SELECT id FROM Student WHERE id IN (SELECT Mapping.student_id FROM Mapping WHERE prof_id = $1 AND archived = FALSE)) AND archived = FALSE ORDER BY date DESC', [prof_id]);
}

export async function get_archived_jobs(req, res) {
    let prof_id = await get_prof_id(req, res);
    return await db.query('SELECT * FROM Job WHERE student_id IN (SELECT id FROM Student WHERE id IN (SELECT Mapping.student_id FROM Mapping WHERE prof_id = $1 AND archived = TRUE)) OR archived = TRUE ORDER BY date DESC', [prof_id]);
}

export function check_authentication_prof(req, res, next) {
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