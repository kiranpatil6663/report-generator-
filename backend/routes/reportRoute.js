// routes/reportRoute.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import { findSessionById } from '../data/data.js';
import buildContextFromConfig from '../utils/contextBuilder.js';
import authUser from '../middleware/authUser.js';

const router = express.Router();


const reportsFilePath = path.join(process.cwd(), 'reports-metadata.json');

// Helper function to read reports 
const readReports = () => {
  try {
    if (!fs.existsSync(reportsFilePath)) {
      return [];
    }
    const data = fs.readFileSync(reportsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Error reading reports:', error);
    return [];
  }
};

// Helper function to write reports 
const writeReports = (reports) => {
  try {
    fs.writeFileSync(reportsFilePath, JSON.stringify(reports, null, 2));
  } catch (error) {
    console.log('Error writing reports:', error);
  }
};

//  function to get file size
const getFileSize = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
    return `${fileSizeInMB} MB`;
  } catch (error) {
    return 'Unknown';
  }
};

//  function to determine assessment type from session data
const getAssessmentType = (sessionData) => {
  const assessmentTypes = {
    'as_hr_02': 'HR Assessment',
    'as_card_01': 'Card Sorting',
    'skills': 'Skills Assessment'
  };
  return assessmentTypes[sessionData.assessment_id] || 'Assessment';
};

/**
 * GET /api/reports - Get all reports for authenticated user
 */
const getUserReports = async (req, res) => {
  try {
    const reports = readReports();
    
  
    const userReports = reports.map(report => ({
      ...report,
      // Ensure file still exists
      exists: fs.existsSync(report.filePath)
    }));

    res.json({
      success: true,
      reports: userReports
    });
  } catch (error) {
    console.log('Error in getting reports:', error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * POST /api/reports/generate - Generate new report
 */
const generateReport = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.json({ success: false, message: "Session ID required" });
    }

    const sessionData = findSessionById(sessionId);
    if (!sessionData) {
      return res.json({ success: false, message: "Session not found" });
    }

    const configPath = path.join(
      process.cwd(),
      "configs",
      `${sessionData.assessment_id}.json`
    );
    
    if (!fs.existsSync(configPath)) {
      return res.json({ success: false, message: "Config not found" });
    }

    const assessmentConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
    const context = buildContextFromConfig(sessionData, assessmentConfig);

    const templatePath = path.join(
      process.cwd(),
      "templates",
      `${sessionData.assessment_id}.hbs`
    );
    
    if (!fs.existsSync(templatePath)) {
      return res.json({ success: false, message: "Template not found" });
    }

    const templateSource = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(templateSource);
    const html = template(context);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        bottom: "20px",
        left: "20px",
        right: "20px",
      },
    });

    await browser.close();

    // Save PDF to reports folder
    const fileName = `report-${sessionId}-${Date.now()}.pdf`;
    const filePath = path.join(process.cwd(), "reports", fileName);
    
    // Ensure reports directory exists
    const reportsDir = path.join(process.cwd(), "reports");
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, pdfBuffer);

    // Create report metadata
    const reportData = {
      id: Date.now(),
      sessionId,
      assessmentType: getAssessmentType(sessionData),
      fileName,
      filePath,
      generatedAt: new Date().toISOString(),
      fileSize: getFileSize(filePath),
      status: 'completed',
      userId: req.userId // from auth middleware
    };

    // Save metadata
    const reports = readReports();
    reports.unshift(reportData); 
    writeReports(reports);

    res.json({
      success: true,
      message: "PDF generated successfully",
      report: reportData
    });

  } catch (error) {
    console.log("PDF generation error:", error);
    res.json({ success: false, message: error.message });
  }
};

/**
 * GET /api/reports/download/:id - Download report by ID
 */
const downloadReport = async (req, res) => {
  try {
    const { id } = req.params;
    const reports = readReports();
    const report = reports.find(r => r.id == id);

    if (!report) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    if (!fs.existsSync(report.filePath)) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${report.fileName}"`);
    res.sendFile(path.resolve(report.filePath));

  } catch (error) {
    console.log('Error downloading report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/reports/:id - Delete report
 */
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const reports = readReports();
    const reportIndex = reports.findIndex(r => r.id == id);

    if (reportIndex === -1) {
      return res.status(404).json({ success: false, message: "Report not found" });
    }

    const report = reports[reportIndex];

    // Delete file if exists
    if (fs.existsSync(report.filePath)) {
      fs.unlinkSync(report.filePath);
    }

    // Remove from metadata
    reports.splice(reportIndex, 1);
    writeReports(reports);

    res.json({ success: true, message: "Report deleted successfully" });

  } catch (error) {
    console.log('Error deleting report:', error);
    res.json({ success: false, message: error.message });
  }
};

// Routes
// Routes (shortened)
router.get('/', authUser, getUserReports);            // GET /api/reports
router.post('/generate', authUser, generateReport);   // POST /api/reports/generate
router.get('/download/:id', authUser, downloadReport); // GET /api/reports/download/:id
router.delete('/:id', authUser, deleteReport);         // DELETE /api/reports/:id


export default router;