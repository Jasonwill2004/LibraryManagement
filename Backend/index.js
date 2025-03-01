require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const express = require("express");
const cors = require("cors");
const { logger, logWithFunctionName } = require("./logger");

const app = express();
const port = process.env.PORT || 3004;
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Middleware for logging all requests
app.use((req, res, next) => {
  logWithFunctionName("info", `[${req.method}] ${req.url} - Request received`, "RequestLogger");
  next();
});

// API Key Middleware
const verifyApiKey = (req, res, next) => {
  const apiKey = req.header("x-api-key");
  if (!apiKey || apiKey !== process.env.API_KEY) {
    logWithFunctionName("warn", `[${req.method}] ${req.url} - Unauthorized API Key`, "verifyApiKey");
    return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
  }
  next();
};

// Get all members
app.get("/getuser", verifyApiKey, async (req, res) => {
  try {
    const allUsers = await prisma.Member.findMany();
    logWithFunctionName("info", "[GET /getuser] - Retrieved all members", "getAllMembers");
    res.json(allUsers);
  } catch (error) {
    logWithFunctionName("error", "[GET /getuser] - Error fetching members: " + error.message, "getAllMembers");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Add a new member
app.post("/adduser", verifyApiKey, async (req, res) => {
  try {
    const { mem_name, mem_email, mem_phone } = req.body;
    await prisma.Member.create({ data: { mem_name, mem_email, mem_phone } });

    logWithFunctionName("info", `[POST /adduser] - User added: ${mem_name}`, "addUser");
    res.status(201).send("User added successfully");
  } catch (error) {
    logWithFunctionName("error", "[POST /adduser] - Error adding user: " + error.message, "addUser");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Issue a book
// Adding this line to show that some changes are made and simulate the deployment process
app.post("/issuance", verifyApiKey, async (req, res) => {
  try {
    const { book_id, issuance_date, issuance_member, issued_by, target_return_date, issuance_status } = req.body;
    await prisma.Issuance.create({
      data: { book_id, issuance_date, issuance_member, issued_by, target_return_date, issuance_status },
    });

    logWithFunctionName("info", `[POST /issuance] - Issued book ${book_id} to member ${issuance_member}`, "issueBook");
    res.status(201).send("Issuance added successfully");
  } catch (error) {
    logWithFunctionName("error", "[POST /issuance] - Error issuing book: " + error.message, "issueBook");
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// postig a book
app.post("/book", verifyApiKey, async (req, res) => {
  try {
    const { book_name, book_launch_date, book_publisher } = req.body;
    console.log(req.body);

    // Check if required fields are missing
    if (!book_name || !book_launch_date || !book_publisher) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const book = await prisma.Book.create({
      data: {
        book_name,
        book_launch_date: new Date(book_launch_date), // Convert to Date
        book_publisher,
      },
    });
    logWithFunctionName("info", `[POST /book] - added book ${book_name}`, "addBook");
    res.status(201).json(book);
  } catch (error) {
    logWithFunctionName("error", "[POST /book] - Error adding book: " + error.message, "addBook");
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch books
app.get("/books/:id", verifyApiKey, async (req, res) => {
  try {
    const book = await prisma.Book.findUnique({
      where: { book_id: parseInt(req.params.id) },
    });
    if (!book) {
      logWithFunctionName("warn", `[GET /books/${req.params.id}] - Book not found`, "getBookById");
      return res.status(404).json({ error: "Book not found" });
    }

    logWithFunctionName("info", `[GET /books/${req.params.id}] - Book details retrieved`, "getBookById");
    res.json(book);
  } catch (error) {
    logWithFunctionName("error", "[GET /books/:id] - Error fetching book: " + error.message, "getBookById");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch members with pending returns on a specific Date
app.get("/member/:date", verifyApiKey, async (req, res) => {
  try {
    const { date } = req.params;
    const issuedMembers = await prisma.Issuance.findMany({
      where: { target_return_date: date },
      select: { issuance_member: true },
    });

    const memberIds = issuedMembers.map((record) => record.issuance_member);
    const members = await prisma.Member.findMany({ where: { mem_id: { in: memberIds } } });

    logWithFunctionName("info", `[GET /member/${date}] - Retrieved members with pending returns`, "getMembersWithPendingReturns");
    res.json(members);
  } catch (error) {
    logWithFunctionName("error", "[GET /member/:date] - Error fetching members: " + error.message, "getMembersWithPendingReturns");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update issuance return date
app.put("/issuance/:id", verifyApiKey, async (req, res) => {
  try {
    const { id } = req.params;
    const { target_return_date } = req.body;

    if (!target_return_date) {
      logWithFunctionName("warn", `[PUT /issuance/${id}] - target_return_date is required`, "updateIssuanceReturnDate");
      return res.status(400).json({ error: "target_return_date is required" });
    }

    const existingIssuance = await prisma.Issuance.findUnique({ where: { issuance_id: parseInt(id) } });

    if (!existingIssuance) {
      logWithFunctionName("warn", `[PUT /issuance/${id}] - Issuance record not found`, "updateIssuanceReturnDate");
      return res.status(404).json({ error: "Issuance record not found" });
    }

    await prisma.Issuance.update({
      where: { issuance_id: parseInt(id) },
      data: { target_return_date },
    });

    logWithFunctionName("info", `[PUT /issuance/${id}] - Updated return date to ${target_return_date}`, "updateIssuanceReturnDate");
    res.json({ message: "Return date updated successfully" });
  } catch (error) {
    logWithFunctionName("error", "[PUT /issuance/:id] - Error updating return date: " + error.message, "updateIssuanceReturnDate");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  logWithFunctionName("info", `[Server] - Application started on port ${port}`, "startServer");
  console.log(`Server running on http://localhost:${port}`);
});