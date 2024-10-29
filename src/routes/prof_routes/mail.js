import express from 'express';
import { Router } from "express";
import db from "../../utils/db.js";
import bodyParser from "body-parser";
import * as utils from "../../utils/utility_functions.js";
import {check_authentication, get_prof_id} from "../../utils/utility_functions.js";
import {google} from "googleapis";
import {oauth2Client} from "../../../index.js";

const router = Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.json());


// Route to fetch starred emails
router.get("/prof_dashboard/mails", check_authentication, async (req, res) => {
    try {
        if (!req.user || !req.user.accessToken) {
            return res.redirect("/login");
        }

        oauth2Client.setCredentials({
            access_token: req.user.accessToken,
            refresh_token: req.user.refreshToken,
        });

        const gmail = google.gmail({ version: "v1", auth: oauth2Client });
        const response = await gmail.users.messages.list({
            userId: "me",
            q: "is:starred",
        });

        const messages = response.data.messages || [];

        // Fetch and decode each email's content
        const starredEmails = await Promise.all(
            messages.map(async (msg) => {
                const emailData = await gmail.users.messages.get({
                    userId: "me",
                    id: msg.id,
                });

                let emailBody = "";
                const payload = emailData.data.payload;

                if (payload.parts) {
                    // Check each part for the email body
                    for (const part of payload.parts) {
                        if (part.mimeType === "text/plain" || part.mimeType === "text/html") {
                            const bodyData = part.body.data;
                            if (bodyData) {
                                // Decode Base64 email content
                                const decodedBody = Buffer.from(bodyData, "base64").toString("utf-8");
                                emailBody += decodedBody;
                            }
                        }
                    }
                } else if (payload.body && payload.body.data) {
                    // Single-part message body
                    emailBody = Buffer.from(payload.body.data, "base64").toString("utf-8");
                }

                return {
                    ...emailData.data,
                    body: emailBody,
                };
            })
        );

        res.render("mail_prof.ejs", { starredEmails });
    } catch (error) {
        console.error("Error fetching starred emails:", error);
        res.status(500).send("Error fetching starred emails.");
    }
});

export default router;