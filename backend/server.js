import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import reportRoute from "./routes/reportRoute.js"
import authUser from "./middleware/authUser.js";
import { findSessionById } from "./data/data.js";
import fs from "fs";     
import path from "path";
import buildContextFromConfig from "./utils/contextBuilder.js";


// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Routes
app.use("/api/auth", userRoute);
app.use("/api/reports", reportRoute); // This handles /api/reports/* routes



// Session routes
app.get("/api/session/:sessionId", (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionData = findSessionById(sessionId);

    if (!sessionData) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.json({
      success: true,
       session: sessionData,
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Assessment config route
const getConfig = async (req, res) => {
  try {
    const { assessmentId } = req.params;

    if (!assessmentId) {
      return res.json({ success: false, message: "Assessment ID required" });
    }

    const configFilePath = path.join(
      process.cwd(),
      "configs",
      `${assessmentId}.json`
    );

    if (!fs.existsSync(configFilePath)) {
      return res.json({
        success: false,
        message: "Assessment config not found",
      });
    }

    const configData = fs.readFileSync(configFilePath, "utf8");
    const assessmentConfig = JSON.parse(configData);

    res.json({ success: true, config: assessmentConfig });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

app.get("/api/config/:assessmentId", getConfig);

// Test context route
app.get("/api/test-context/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const sessionData = findSessionById(sessionId);
    
    if (!sessionData) {
      return res.json({ success: false, message: "Session not found" });
    }

    const configPath = path.join(
      process.cwd(),
      "configs",
      `${sessionData.assessment_id}.json`
    );
    const assessmentConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const context = buildContextFromConfig(sessionData, assessmentConfig);

    res.json({
      success: true,
      context: context,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
});


app.post("/api/reports/generate-report", async (req, res) => {
  try {
    const { session_id } = req.body;
    
    if (!session_id) {
      return res.json({ success: false, message: "Session ID required" });
    }

    // Find session data
    const sessionData = findSessionById(session_id);
    if (!sessionData) {
      return res.json({ success: false, message: "Session not found" });
    }

    // TODO: generate PDF and save in /reports
    const reportPath = path.join(__dirname, "reports", `${session_id}_report.pdf`);
    
    // send response with file URL
    res.json({
      success: true,
      message: "Report generated successfully",
      reportUrl: `/reports/${session_id}_report.pdf`
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.json({ success: false, message: error.message });
  }
});
// Serve static report files (for direct access)
app.get("/reports/:fileName", (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(process.cwd(), "reports", fileName);

    if (fs.existsSync(filePath)) {
      res.sendFile(path.resolve(filePath));
    } else {
      res.status(404).json({ success: false, message: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Root route
app.get("/api/profile", authUser, (req, res) => {
  try {
    // Read users.json
    const usersPath = path.join(process.cwd(), "users.json");
    const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

    // Find user by id
    const user = users.find(u => u.id === req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

  
    const { password, ...safeUser } = user;

    res.json({
      success: true,
      userData: safeUser 
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});