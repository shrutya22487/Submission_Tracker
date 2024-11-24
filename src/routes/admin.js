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