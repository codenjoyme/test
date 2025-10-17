# Secure Document Sharing Platform

Platform for secure document exchange with two-channel authentication (link + password).

## Project Structure

```
.
├── backend/          # Spring Boot backend application
├── frontend/         # React frontend application
└── README.md
```

## Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 18+** and npm
- **PostgreSQL 12+** (for production use)

## Backend Setup

### 1. Configure PostgreSQL (Optional for initial testing)

The backend is pre-configured to connect to PostgreSQL. If you want to test with a real database:

1. Install and start PostgreSQL
2. Create database:
```sql
CREATE DATABASE secure_docs;
```

3. Update credentials in `backend/src/main/resources/application.properties` if needed:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/secure_docs
spring.datasource.username=postgres
spring.datasource.password=postgres
```

**Note**: For testing the `/api/ping` endpoint, PostgreSQL is not required. The endpoint works without database connection.

### 2. Build and Run Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on **http://localhost:8080**

### 3. Test Backend Endpoint

```bash
curl http://localhost:8080/api/ping
```

Expected response:
```json
{
  "status": "ok",
  "message": "Backend is running",
  "timestamp": "2025-10-17T12:00:00.000"
}
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The frontend will start on **http://localhost:5173**

### 3. Build for Production

```bash
npm run build
```

Built files will be in `frontend/dist/`

## Testing the Complete Setup

1. **Start Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start Frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open Browser**:
   - Navigate to http://localhost:5173
   - Click "Test Connection" button
   - You should see a successful connection message with backend response

## API Endpoints

### Current Endpoints

- `GET /api/ping` - Health check endpoint
  - Returns: `{ status, message, timestamp }`

## Technology Stack

### Backend
- **Spring Boot 3.2.0** - Application framework
- **Spring Data JPA** - Database ORM
- **PostgreSQL** - Production database
- **H2** - In-memory database for testing
- **Maven** - Build tool

### Frontend
- **React 18** - UI library
- **Vite 5** - Build tool and dev server
- **Modern JavaScript (ES6+)** - Programming language

## Development

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Build

```bash
cd frontend
npm run build
```

## Project Features (Implemented)

✅ Spring Boot application initialized  
✅ Spring Data JPA configured  
✅ PostgreSQL connection configured  
✅ `/api/ping` REST endpoint working  
✅ React application created with Vite  
✅ Ping component for backend connection testing  
✅ CORS configuration for frontend-backend communication  

## Next Steps

- Implement user authentication (JWT)
- Add document upload functionality
- Create secure link generation
- Implement access analytics
- Add document viewer

## License

This project is part of the Secure Document Sharing Platform initiative.
