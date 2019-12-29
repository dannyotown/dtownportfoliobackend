const express = require("express");
const app = express();
const sgMail = require("@sendgrid/mail");
const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 8080;
const cors = require("cors");

app.use(cors());
app.options("*", cors());
app.use(express.json());

app.post("/api/email", checkBody(), async (req, res, next) => {
  try {
    sgMail.setApiKey(`${process.env.EMAILKEY}`);
    const msg = {
      to: "dannyotown@gmail.com",
      from: `${req.body.email}`,
      subject: `${req.body.subject}`,
      text: `${req.body.body}`
    };
    await sgMail.send(msg);
    res.status(202).json({ success: "Message sent successfully!" });
  } catch (err) {
    res.status(404).json({ error: "There was An Error Sending The Email" });
  }
});

app.listen(port, host, () => {
  console.log(`Running at http://${host}:${port}`);
});

function checkBody(req, res, next) {
  return (req, res, next) => {
    if (!req.body.email || !req.body.subject || !req.body.body) {
      res.status(404).json({ error: "You are missing required fields" });
    } else {
      req = req;
      next();
    }
  };
}
