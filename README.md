# Agent List Distributor

A comprehensive full-stack MERN application for managing agents and distributing contact lists among them. This application allows administrators to upload CSV files containing contact information and automatically distribute the contacts equally among registered agents with advanced features for task management and distribution viewing.

## 🚀 Key Features

### 🔐 **Admin Authentication System**
- **Secure Login**: JWT-based authentication with token management
- **Session Management**: Automatic token refresh and logout functionality
- **Protected Routes**: All admin features are secured with authentication middleware
- **Default Credentials**: Pre-configured admin account for easy setup

### 👥 **Agent Management System**
- **Agent Creation**: Add new agents with complete profile information
- **Mobile Validation**: Strict international mobile number format validation (+country code)
- **Agent Listing**: View all registered agents with their details
- **Agent Deletion**: Remove agents and manage their assigned tasks
- **Default Agents**: System automatically creates 5 default agents for immediate use

### 📊 **Advanced List Distribution**
- **Smart Distribution**: Automatically distributes tasks equally among 5 agents
- **Remainder Handling**: Sequential distribution of remaining items when not evenly divisible
- **Real-time Updates**: Live distribution updates as agents are added/removed
- **Distribution Tracking**: Complete audit trail of all distributed items

### 📁 **File Upload & Processing**
- **Multi-format Support**: CSV, XLSX, and XLS file uploads
- **File Validation**: Comprehensive validation for file type, size, and content
- **Data Processing**: Automatic parsing and cleaning of uploaded data
- **Error Handling**: Detailed error messages for invalid files or data

### 👁️ **Interactive Distribution Viewing**
- **Agent Cards**: Individual agent cards showing assigned items count
- **View Items Toggle**: Click to expand/collapse individual agent items
- **Item Management**: Delete individual tasks with confirmation
- **Agent Management**: Delete entire agents and their assigned tasks
- **Detailed View**: Comprehensive overview of all distributions

### 🎨 **Modern User Interface**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Clean Interface**: Icon-based buttons with tooltips for better UX
- **Progressive Disclosure**: Information revealed on demand to reduce clutter
- **Visual Feedback**: Loading states, success/error messages, and interactive elements
- **Company Branding**: Professional header with company information

### 🔧 **Technical Features**
- **Real-time Updates**: Live data synchronization across all components
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Data Validation**: Both frontend and backend validation for data integrity
- **Security**: Password hashing, JWT tokens, and input sanitization
- **Performance**: Optimized queries and efficient data processing

## 🛠️ Technology Stack

### **Backend Technologies**
- **Node.js** (v14+) - JavaScript runtime environment for server-side development
- **Express.js** - Fast, unopinionated web framework for Node.js
- **MongoDB** - NoSQL document database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling for Node.js
- **JWT (jsonwebtoken)** - Secure token-based authentication
- **Bcryptjs** - Password hashing and security
- **Multer** - Middleware for handling multipart/form-data (file uploads)
- **CSV Parser** - Fast CSV parsing library
- **XLSX** - Excel file processing and manipulation
- **CORS** - Cross-Origin Resource Sharing middleware
- **Dotenv** - Environment variable management

### **Frontend Technologies**
- **React.js** (v18+) - Modern JavaScript library for building user interfaces
- **React Router** (v6+) - Declarative routing for React applications
- **Axios** - Promise-based HTTP client for API communication
- **React Context API** - State management for authentication and global state
- **CSS3** - Custom styling with modern CSS features
- **HTML5** - Semantic markup and modern web standards

### **Development Tools**
- **Concurrently** - Run multiple commands concurrently
- **Nodemon** - Automatic server restart during development
- **React Scripts** - Create React App build tools
- **ESLint** - Code linting and quality assurance
- **Git** - Version control system

### **Database & Storage**
- **MongoDB Atlas** - Cloud-hosted MongoDB database
- **Mongoose Schemas** - Data modeling and validation
- **GridFS** - File storage for large files (if needed)

### **Security & Authentication**
- **JWT Tokens** - Secure authentication tokens
- **Password Hashing** - Bcrypt for secure password storage
- **Input Validation** - Both client-side and server-side validation
- **CORS Protection** - Cross-origin request security
- **Environment Variables** - Secure configuration management

### **File Processing**
- **CSV Parsing** - Automatic CSV file processing
- **Excel Support** - XLSX and XLS file handling
- **File Validation** - Type, size, and content validation
- **Data Cleaning** - Automatic data sanitization and formatting

### **Deployment & Production**
- **Vercel** - Cloud platform for deployment
- **MongoDB Atlas** - Production database hosting
- **Environment Configuration** - Production-ready environment setup
- **Build Optimization** - Production build optimization

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd agent-list-distributor
```

### 2. Install Dependencies

Install dependencies for both server and client:

```bash
# Install all dependencies
npm run install-all

# Or install separately
npm run install-server
npm run install-client
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```bash
cd server
cp config.env .env
```

Edit the `.env` file with your configuration:

```env
MONGO_URI=mongodb://localhost:27017/agent-list-distributor
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# Start MongoDB (if not already running)
mongod
```

The application will automatically create the database and collections when you first run it.

### 5. Create Admin User

The application comes with a pre-configured admin user. You can also create additional admin users using the seed script:

**Default Admin Credentials:**
- **Email**: `admin@kavya.com`
- **Password**: `kavya@123`

**To create the admin user, run:**
```bash
cd server
node seed.js
```

This will create the default admin user with the credentials above.

**To create additional admin users manually:**
```javascript
// Run in MongoDB shell or MongoDB Compass
use agent-list-distributor
db.admins.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password: "password"
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## Running the Application

### Development Mode

Run both server and client concurrently:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Production Mode

1. **Build the client:**
```bash
cd client
npm run build
```

2. **Start the server:**
```bash
cd server
npm start
```

### Running Separately

**Backend only:**
```bash
cd server
npm run dev
```

**Frontend only:**
```bash
cd client
npm start
```

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login

### Agent Management
- `GET /api/agents` - Get all agents
- `POST /api/agents/add` - Create new agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### List Management
- `POST /api/list/upload` - Upload and distribute CSV file
- `GET /api/list/agents` - Get distributed lists

## CSV File Format

Your CSV file must contain the following columns:

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| FirstName | Text | Yes | Contact's first name |
| Phone | Number | Yes | Phone number (numbers only) |
| Notes | Text | No | Additional notes |

### Example CSV Format:

```csv
FirstName,Phone,Notes
John Doe,1234567890,Important client
Jane Smith,0987654321,Follow up needed
Mike Johnson,1122334455,
```

## File Upload Requirements

- **Supported formats**: CSV, XLSX, XLS
- **Maximum file size**: 5MB
- **Required columns**: FirstName, Phone, Notes
- **Phone validation**: Must contain only numbers

## Distribution Logic

The application distributes items equally among all registered agents:

- If you have 5 agents and 25 items, each agent gets 5 items
- If the total is not evenly divisible, remaining items are distributed sequentially
- Example: 23 items with 5 agents = 4 agents get 5 items, 1 agent gets 3 items

## Project Structure

```
agent-list-distributor/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── utils/             # Utility functions
│   ├── uploads/           # File upload directory
│   ├── server.js
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🏗️ Application Architecture

### **MVC Pattern Implementation**
- **Models**: Mongoose schemas for Admin, Agent, and ListItem
- **Views**: React components for UI rendering
- **Controllers**: Express route handlers for business logic

### **Component Structure**
```
client/src/
├── components/          # React UI components
│   ├── Login.js        # Authentication component
│   ├── Dashboard.js    # Main dashboard
│   ├── AddAgent.js     # Agent management
│   ├── UploadList.js   # File upload interface
│   └── AgentListView.js # Distribution viewing
├── context/            # React Context for state management
│   └── AuthContext.js  # Authentication state
├── utils/              # Utility functions
│   └── api.js         # Centralized API configuration
└── App.js             # Main application component
```

### **Backend Architecture**
```
server/
├── controllers/        # Business logic handlers
├── middleware/         # Custom middleware (auth, validation)
├── models/            # Database schemas
├── routes/            # API endpoint definitions
├── utils/             # Utility functions (JWT, validation)
└── server.js          # Main server file
```

## 📖 Usage Guide

### **1. 🔐 Admin Login**
- Navigate to `http://localhost:3000`
- Use the default credentials:
  - **Email**: `admin@kavya.com`
  - **Password**: `kavya@123`
- You'll be redirected to the dashboard upon successful login

### **2. 👥 Agent Management**
- **View Agents**: Dashboard shows all registered agents
- **Add New Agent**: 
  - Go to "Add Agent" section
  - Fill in agent details (name, email, mobile with country code, password)
  - Mobile number must be in international format (e.g., +1234567890)
  - Click "Add Agent" to create the agent
- **Delete Agent**: Use the 🗑️ button to remove agents and their tasks

### **3. 📁 File Upload & Distribution**
- **Upload File**: 
  - Go to "Upload List" section
  - Select a CSV, XLSX, or XLS file (max 5MB)
  - Click "Upload and Distribute"
- **Automatic Distribution**: 
  - System automatically distributes items equally among 5 agents
  - Remaining items are distributed sequentially
  - Real-time distribution updates

### **4. 👁️ View Distribution**
- **Agent Cards**: Each agent shows their assigned items count
- **View Items**: Click the 👁️ button to expand and see individual items
- **Item Management**: 
  - View individual tasks with delete buttons
  - Delete specific tasks using the 🗑️ button
  - Hide items by clicking the 👁️‍🗨️ button
- **Agent Management**: Delete entire agents and their assigned tasks

### **5. 📊 Dashboard Overview**
- **Statistics**: View total agents, total items, and recent uploads
- **Quick Navigation**: Access all features from the main dashboard
- **Real-time Updates**: Live data synchronization across all components

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGO_URI in your .env file

2. **Port Already in Use**
   - Change the PORT in your .env file
   - Kill processes using the port: `lsof -ti:5000 | xargs kill -9`

3. **File Upload Errors**
   - Check file format (CSV, XLSX, XLS only)
   - Ensure file size is under 5MB
   - Verify CSV has required columns

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in .env file
   - Ensure admin user exists in database

### Development Tips

- Use browser developer tools to debug API calls
- Check server console for error messages
- Use MongoDB Compass to inspect database
- Clear browser cache if experiencing issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the troubleshooting section
- Review the API documentation
- Create an issue in the repository

## 🚀 Deployment

### **Vercel Deployment**
The application is configured for easy deployment on Vercel:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy the application
vercel

# Deploy to production
vercel --prod
```

### **Environment Variables for Production**
Set the following environment variables in your Vercel dashboard:
- `MONGO_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A strong, random secret key for JWT authentication
- `NODE_ENV`: Set to `production`

### **Database Setup for Production**
1. Create a MongoDB Atlas cluster
2. Update the `MONGO_URI` in your environment variables
3. Run the seed script to create the admin user:
   ```bash
   node server/seed.js
   ```

## 🎥 Video Demonstration

*This section will be updated with a video demonstration of the application features and usage.*

## 📋 Project Status

### **✅ Completed Features**
- [x] Admin authentication system
- [x] Agent management (CRUD operations)
- [x] CSV/Excel file upload and processing
- [x] Automatic distribution algorithm
- [x] Interactive distribution viewing
- [x] Mobile number validation
- [x] Responsive design
- [x] Error handling and validation
- [x] Vercel deployment configuration

### **🔧 Technical Achievements**
- [x] MERN stack implementation
- [x] JWT authentication
- [x] File upload handling
- [x] Database modeling with Mongoose
- [x] React Context for state management
- [x] Centralized API configuration
- [x] CORS configuration
- [x] Environment variable management

---


## 🏢 **CSTech Infosolutions Private Limited**

*Agent List Distributor System - A comprehensive solution for managing and distributing contact lists among agents with advanced features and modern technology stack.*
