report generator system

A full-stack web application with user authentication and configurable PDF report generation system. This system generates different types of health and fitness assessment reports from pre-existing data without requiring code modifications for new assessment types.

##  Project Overview

This application fulfills the Full Stack Developer Assignment requirements by providing:

- **User Authentication System**: Secure registration and login functionality
- **PDF Report Generation**: Dynamic PDF creation from assessment data
- **Configuration-Driven Flexibility**: Add new assessment types through JSON configuration files only
- **Session-Based Data Processing**: Generate reports using session IDs from existing assessment data

##  Architecture

### Core Challenge Solution
The system achieves maximum flexibility through a configuration-driven approach where:
- **New assessment types** can be added without code changes
- **Data field mappings** are configurable using JSONPath expressions
- **Classification ranges** are defined in configuration files
- **Report sections** are dynamically generated based on assessment type

### Technology Stack
- **Backend**: Node.js with Express
- **Frontend**: React.js with Tailwind CSS
- **PDF Generation**: Puppeteer
- **Authentication**: JWT tokens
- **Data Storage**: In-memory (data.js file)
- **Template Engine**: Handlebars

## Project Structure

```
assessment-management-system/
├── backend/
│   ├── configs/
│   │   ├── as_card_01.json      # Cardiac Assessment Configuration
│   │   └── as_hr_02.json        # Health Assessment Configuration
│   ├── data/
│   │   └── data.js              # Sample assessment data
│   ├── middleware/
│   │   └── authUser.js          # Authentication middleware
│   ├── routes/
│   │   ├── reportRoute.js       # Report generation endpoints
│   │   └── userRoute.js         # User authentication endpoints
│   ├── templates/
│   │   └── shared-template.hbs  # Universal PDF template
│   ├── reports/                 # Generated PDF files
│   ├── utils/
│   │   └── contextBuilder.js    # Configuration processor
│   └── server.js                # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd assessment-management-system
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Start the backend server**
   ```bash
   nodemon server.js
   ```
   
   The backend server will run on `http://localhost:5000`

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:3000`

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Report Generation
- `POST /api/reports/generate` - Generate PDF report
  ```json
  {
    "session_id": "session_001"
  }
  ```

## Sample Data

The system includes two sample assessment sessions:

### Session 1: Health Analysis (as_hr_02)
- **Session ID**: `session_001`
- **Assessment Type**: Health & Fitness Assessment
- **Sections**: Overall Assessment, Key Body Vitals, Cardiovascular Status, Physical Performance, Body Composition, Posture Analysis

### Session 2: Cardiac Analysis (as_card_01)  
- **Session ID**: `session_002`
- **Assessment Type**: Cardiac Assessment
- **Sections**: Overall Assessment, Essential Health Metrics, Cardiovascular Endurance, Physical Composition

## Configuration System

### Adding New Assessment Types

1. **Create Configuration File**
   
   Add a new JSON file in `backend/configs/` following the pattern `as_[type]_[number].json`:

   ```json
   {
     "assessment_id": "as_new_03",
     "assessment_name": "New Assessment Type",
     "sections": [
       {
         "section_name": "Section Name",
         "fields": [
           {
             "label": "Field Label",
             "extractFrom": "$.jsonPath.expression",
             "unit": "unit",
             "classification": {
               "ranges": [
                 { "min": 0, "max": 100, "status": "Normal", "color": "green" }
               ]
             }
           }
         ]
       }
     ]
   }
   ```

2. **Add Sample Data**
   
   Update `backend/data/data.js` with sample data matching your new assessment_id.

3. **No Code Changes Required**
   
   The system automatically detects and processes the new configuration.

### Data Field Mapping

Use JSONPath expressions to extract data from session objects:

- **Simple fields**: `$.accuracy`
- **Nested objects**: `$.vitalsMap.vitals.heart_rate`
- **Array filtering**: `$.exercises[?(@.id == 235)].setList[0].time`
- **String matching**: `$.exercises[?(@.name == 'Frontal body view')].analysisScore`

### Classification Ranges

Define value ranges with color coding:

```json
{
  "classification": {
    "ranges": [
      { "min": 80, "max": 100, "status": "Excellent", "color": "green" },
      { "min": 60, "max": 79, "status": "Good", "color": "blue" },
      { "min": 40, "max": 59, "status": "Average", "color": "yellow" },
      { "min": 0, "max": 39, "status": "Poor", "color": "red" }
    ]
  }
}
```

##  Testing the System

### Manual Testing

1. **Start both backend and frontend servers**
2. **Register a new user** through the frontend interface
3. **Login with your credentials**
4. **Navigate to Generate Report page**
5. **Enter a session ID** (`session_001` or `session_002`)
6. **Click Generate Report**
7. **Check the `backend/reports/` folder** for the generated PDF

### API Testing with cURL

```bash
# Generate report for session_001
curl -X POST http://localhost:5000/api/reports/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"session_id": "session_001"}'
```

##  Assignment Requirements Fulfilled

### User Authentication System
- User registration with validation
- Secure login with JWT tokens
- Backend API endpoints for authentication
- Frontend forms for registration and login

### PDF Report Generation System
- API endpoint for report generation (`/api/reports/generate`)
- Reads existing assessment data from data.js file
- Converts assessment data to formatted PDF reports
- Handles different assessment types with different formats
- Saves PDFs to local filesystem

### Maximum Flexibility Configuration System
- **Section Configuration**: Sections defined per assessment_id in config files
- **Field Mapping**: Dynamic JSONPath mapping for each field
- **Value Classification**: Configurable ranges for field values
- **Template Flexibility**: Single template supports all assessment types
- **No Code Changes**: New assessment types added through configuration only

### Data Processing
- Session-based data retrieval using `session_id`
- Automatic assessment type detection from `assessment_id`
- Dynamic field extraction using JSONPath expressions
- Classification range application

Demonstration Features

The system demonstrates:

1. **User Registration and Login Process**
2. **API Call with Session ID**
3. **PDF Generation and Filesystem Storage**
4. **Different Assessment Types** (Health vs Cardiac)
5. **Configuration Flexibility** (Easy modification of assessment types)

Generated Reports

Reports include:
- **Assessment header** with type and date
- **Dynamic sections** based on configuration
- **Extracted field values** with units
- **Color-coded classifications** (Green/Blue/Yellow/Red)
- **Professional PDF formatting**

Sample Report Sections

Health Analysis Report (as_hr_02)
- Overall Assessment (Health Score, Date)
- Key Body Vitals (Heart Rate, Blood Pressure, Oxygen Saturation)
- Cardiovascular Status (Wellness Score, Cardiac Output, Stress Index)
- Physical Performance (VO2 Max, Cardiovascular Endurance)
- Body Composition (BMI, Body Fat %, Lean Mass)
- Posture Analysis (Frontal View Score, Side View Score)

Cardiac Analysis Report (as_card_01)
- Overall Assessment (Health Score, Date)
- Essential Health Metrics (Heart Rate, Blood Pressure, Oxygen Saturation)
- Cardiovascular Endurance (Wellness Score, Cardiac Output, HRV, Endurance Test)
- Physical Composition (BMI, Lean Mass)

Development Notes

### Configuration System Design
The system uses a three-layer approach:
1. **Configuration Layer**: JSON files define report structure
2. **Processing Layer**: Context builder extracts and classifies data
3. **Presentation Layer**: Handlebars template renders final output

Flexibility Achieved Through
- **JSONPath expressions** for dynamic data extraction
- **Configuration-driven sections** and field definitions
- **Pluggable classification ranges**
- **Universal template system**

Important Notes

- **No Database Required**: System uses in-memory data storage
- **Pre-existing Data**: Assessment data is already provided in data.js
- **Session-based Processing**: Reports generated using session_id lookup
- **Configuration-Only Changes**: New assessment types require no code modifications

License

This project is developed as part of a Full Stack Developer Assignment.

Support
For questions about the configuration system or setup, refer to the detailed configuration documentation included in the repository.
