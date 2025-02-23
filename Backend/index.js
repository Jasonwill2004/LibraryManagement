require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const express = require("express"); // Import express
const app = express(); // Initialize express
const port = 3004; // Port number

const cors = require("cors");

const prisma = new PrismaClient();
app.use(express.json());
app.use(cors());

const verifyApiKey = (req, res, next) => {
    const apiKey = req.header("x-api-key");
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
    }
    next();
  };
  

app.get("/getuser",verifyApiKey, async (req, res) => {
  try {
    const allUsers = await prisma.Member.findMany();
    res.send(allUsers);
  } catch (error) {
    res.send(error);
  }
});

app.post("/adduser",verifyApiKey, async (req, res) => {
  const { mem_name, mem_email, mem_phone } = req.body;
  await prisma.Member.create({
    data: {
      mem_name,
      mem_email,
      mem_phone,
    },
  });

  res.send("User added successfully");
});

app.post("/issuance",verifyApiKey, async (req, res) => {
  const {
    issuance_id,
    book_id,
    issuance_date,
    issuance_member,
    issued_by,
    target_return_date,
    issuance_status,
  } = req.body;
  await prisma.Issuance.create({
    data: {
      issuance_id,
      book_id,
      issuance_date,
      issuance_member,
      issued_by,
      target_return_date,
      issuance_status,
    },
  });

  res.send("Issuance added successfully");
});

app.post("/book",verifyApiKey, async (req, res) => {
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

    res.status(201).json(book);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/member/:date",verifyApiKey, async (req, res) => {
  try {
    const { date } = req.params; // Get the date from URL params

    // Query Issuance table for members with the given return date
    console.log(new Date(date));
    const issuedMembers = await prisma.issuance.findMany({
      where: {
        target_return_date: date,
      },
      select: {
        issuance_member: true,
      },
    });

    console.log(issuedMembers);

    // Extract member IDs
    const memberIds = issuedMembers.map((record) => record.issuance_member);

    // Query Member table for member details
    const members = await prisma.member.findMany({
      where: {
        mem_id: { in: memberIds },
      },
    });

    res.json(members); // Send result as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/books/:id",verifyApiKey, async (req, res) => {
  try {
    const book = await prisma.Book.findUnique({
      where: { book_id: parseInt(req.params.id) },
    });
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/issuance/:id", verifyApiKey, async (req, res) => {
    try {
      const { id } = req.params;
      const { target_return_date } = req.body;
  
      // Validate input
      if (!target_return_date) {
        return res.status(400).json({ error: "target_return_date is required" });
      }
  
      // Check if the issuance record exists
      const existingIssuance = await prisma.Issuance.findUnique({
        where: { issuance_id: parseInt(id) },
      });
  
      if (!existingIssuance) {
        return res.status(404).json({ error: "Issuance record not found" });
      }
  
      // Update only the return date
      const updatedIssuance = await prisma.Issuance.update({
        where: { issuance_id: parseInt(id) },
        data: {
          target_return_date: target_return_date,
        },
      });
  
      res.json({
        message: "Return date updated successfully",
        issuance: updatedIssuance,
      });
    } catch (error) {
      console.error("Error updating return date:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
