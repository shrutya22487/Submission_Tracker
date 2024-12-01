import express from 'express';
import { Router } from "express";
import db from "../utils/db.js";
import bodyParser from "body-parser";
import {check_authentication} from "../utils/utility_functions.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());

// adding a new prof
router.post("/admin/add_prof",check_authentication, async (req, res) => {
    const { name, email } = req.body;
    try {
        await db.query('INSERT INTO professor (name, email_id) VALUES ($1, $2)', [name, email]);
        res.status(201).send('Professor added');
    } catch (error) {
        console.error('Error adding professor:', error);
        res.status(500).send("Internal server error");
    }
});

// adding a new student
router.post("/admin/add_student",check_authentication, async (req, res) => {
    const { name, email } = req.body;
    try {
        await db.query('INSERT INTO Student (name, email_id) VALUES ($1, $2)', [name, email]);
        res.status(201).send('Student added');
    } catch (error) {
        console.error('Error adding professor:', error);
        res.status(500).send("Internal server error");
    }
});

router.put("/admin/edit_prof/:id", check_authentication, async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const result = await db.query(
            'UPDATE professor SET name = $1, email_id = $2 WHERE id = $3',
            [name, email, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send("Professor not found");
        }

        res.status(200).send('Professor details updated');
    } catch (error) {
        console.error('Error editing professor:', error);
        res.status(500).send("Internal server error");
    }
});

router.post("/admin/delete_prof/:id", check_authentication, async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM professor WHERE id = $1', [id]);
        res.status(200).send("Professor deleted successfully");
    } catch (error) {
        console.error('Error deleting professor:', error);
        res.status(500).send("Internal server error");
    }
});

router.post("/admin/delete_student/:id", check_authentication, async (req, res) => {
    const { id } = req.params;

    try {
        await db.query('DELETE FROM student WHERE id = $1', [id]);

        res.status(200).send("Student deleted successfully");
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send("Internal server error");
    }
});

router.put("/admin/edit_student/:id", check_authentication, async (req, res) => {
    const { id } = req.params;
    const { name, email, type } = req.body;

    try {
        const result = await db.query(
            'UPDATE student SET name = $1, email_id = $2, type = $3 WHERE id = $4',
            [name, email, type, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send("Student not found");
        }

        res.status(200).send('Student details updated');
    } catch (error) {
        console.error('Error editing student:', error);
        res.status(500).send("Internal server error");
    }
});

router.get('/admin',check_authentication, async (req, res) => {
    if (req.user.admin){
        try {
            const students = await db.query('SELECT * FROM student;');
            const professors = await db.query('SELECT * FROM professor;');

            res.render("admin.ejs", {students:students.rows, professors: professors.rows});
        } catch (error) {
            console.error("Error executing query:", error);
            res.status(500).send("Internal server error");
        }
    }
    else{
        res.redirect(`/login`);
    }

});


export default router;