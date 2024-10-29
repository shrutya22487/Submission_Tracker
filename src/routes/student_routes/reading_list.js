import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";
import {check_authentication, get_student_id} from "../../utils/utility_functions.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

// Route to delete a book from the reading list
router.post('/student_dashboard/delete_book', async (req, res) => {
    try {
        const { book_id } = req.body;

        await db.query('DELETE FROM reading_list_student WHERE id = $1', [book_id]);

        res.redirect('/student_dashboard/reading_list'); // Redirect to the reading list after deleting
    } catch (error) {
        console.error("Error deleting book from reading list:", error);
        res.status(500).send("Internal server error");
    }
});

// Route to add a new book to the reading list
router.post('/student_dashboard/add_book', async (req, res) => {
    try {
        const { title, genre, conference, status, link_1, link_2 } = req.body;
        const studentId = await get_student_id(req, res); // Get student ID

        await db.query(
            'INSERT INTO reading_list_student (title, genre, student_id, conference, status, link_1, link_2) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [title, genre, studentId, conference, status, link_1, link_2]
        );

        res.redirect('/student_dashboard/reading_list'); // Redirect to the reading list after adding
    } catch (error) {
        console.error("Error adding book to reading list:", error);
        res.status(500).send("Internal server error");
    }
});


// Route to fetch reading list, grouped by genre and render it
router.get('/student_dashboard/reading_list', check_authentication,async (req, res) => {
    try {
        const studentId = await utils.get_student_id(req, res);
        const query = `
            SELECT genre, array_agg(json_build_object(
                'id', id,
                'title', title,
                'conference', conference,
                'status', status,
                'link_1', link_1,
                'link_2', link_2
            )) AS books
            FROM reading_list_student
            WHERE student_id = $1
            GROUP BY genre;
        `;
        const { rows: groupedBooks } = await db.query(query, [studentId]);

        // Render the EJS template, passing the groupedBooks data
        res.render('reading_list_student.ejs', { groupedBooks : groupedBooks});
    } catch (error) {
        console.error("Error fetching reading list:", error);
        res.status(500).send("Internal server error");
    }
});

export default router;