# CSGUILD Backend - Computer Science Guild Management System

A comprehensive NestJS backend system for the Computer Science Guild featuring:

- **PostgreSQL** database with **Prisma** ORM
- JWT Authentication (Access & Refresh tokens)
- **Student Registration** with enhanced fields
- **Email Verification** system with SMTP
- **RFID Authentication** for student access
- Google OAuth2 integration
- **Email Service** with HTML templates
- Cookie-based token storage
- TypeScript support
- Docker setup for development
- **Complete Swagger/OpenAPI documentation**

## Features

- 🎓 **Student Registration** with comprehensive fields (username, firstName, lastName, birthdate, course)
- 📧 **Email Verification** system with 6-digit codes
- 🔐 **RFID Authentication** for student access cards
- 🔑 JWT Authentication with refresh tokens
- 🚀 Google OAuth2 integration with auto-registration
- 📬 **Email Service** with HTML templates (verification, welcome, password reset)
- 🐘 PostgreSQL with Prisma ORM
- 🍪 HTTP-only cookie authentication
- 🛡️ Guards for route protection
- 🔄 Automatic token refresh
- 🐳 Docker development environment
- 📝 TypeScript throughout
- 📚 **Complete API documentation with Swagger**
- 🧪 Comprehensive guard and strategy documentation

## Prerequisites

- Node.js (v18+ recommended)
- Bun (package manager)
- Docker (for database)
- PostgreSQL (if not using Docker)
- SMTP server for email functionality

## Installation

1. **Install dependencies:**

```bash
bun install
```

2. **Start the PostgreSQL database:**

```bash
docker-compose up -d
```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/csguild?schema=public"

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET="your-super-secret-access-token-key"
JWT_REFRESH_TOKEN_SECRET="your-super-secret-refresh-token-key"
JWT_ACCESS_TOKEN_EXPIRATION_MS="3600000"
JWT_REFRESH_TOKEN_EXPIRATION_MS="86400000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Auth UI Redirect
AUTH_UI_REDIRECT="http://localhost:3000/dashboard"

# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@csguild.com"
FROM_NAME="CSGUILD"

# Environment
NODE_ENV="development"
```

4. **Generate Prisma client and run migrations:**

```bash
bun run db:generate
bun run db:migrate
```

## Running the Application

```bash
# Development mode
bun run start:dev

# Production mode
bun run start:prod

# Debug mode
bun run start:debug
```

The application will be available at `http://localhost:3000`

## 📚 API Documentation

### Swagger UI

Once the application is running, access the interactive API documentation at:

**🔗 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

The Swagger UI provides:

- Interactive API testing
- Complete endpoint documentation
- Request/response schemas
- Authentication examples
- Guard and strategy explanations

### Documentation Features

- **Complete API Coverage**: All endpoints documented with examples
- **Authentication Guide**: Step-by-step auth flow documentation
- **Student Registration**: Complete student onboarding flow
- **Email Verification**: Email verification workflow
- **RFID Integration**: RFID card registration and authentication
- **Error Responses**: Detailed error codes and messages
- **Cookie Authentication**: HTTP-only cookie setup explained
- **OAuth Flow**: Google OAuth integration walkthrough
- **Guard Documentation**: When and how to use each guard
- **Strategy Details**: Authentication strategy implementations

### Quick API Reference

#### Authentication Endpoints

- `POST /auth/login` - Login with email/password (requires email verification)
- `POST /auth/rfid-login` - Login with RFID card
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout and clear tokens
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Google OAuth callback

#### Student Endpoints

- `POST /users` - Register new student
- `GET /users` - Get all students (protected)
- `GET /users/:id` - Get individual student (protected)
- `POST /users/verify-email` - Verify email with 6-digit code
- `POST /users/resend-verification` - Resend email verification code
- `POST /users/register-rfid` - Register RFID card (authenticated)
- `POST /users/rfid-login` - Login using RFID card

## 🎓 Student Registration System

### Registration Flow

1. **Student Registration**: `POST /users` with complete student information
2. **Email Verification**: System sends 6-digit verification code
3. **Verify Email**: `POST /users/verify-email` with verification code
4. **Login**: `POST /auth/login` with verified account
5. **RFID Registration**: `POST /users/register-rfid` to link RFID card

### Student Fields

- `email` - Student's email address (unique)
- `username` - Unique username (auto-generated if not provided)
- `password` - Secure password (hashed)
- `firstName` - Student's first name
- `lastName` - Student's last name
- `birthdate` - Date of birth
- `course` - Academic course/program
- `roles` - User roles (defaults to STUDENT)

### Email Verification

- 6-digit verification codes
- Automatic email sending with HTML templates
- Resend functionality
- Required for login authentication

### RFID Integration

- Link RFID cards to student accounts
- Quick authentication using RFID
- Secure card registration process
- RFID-based login system

## 📧 Email Service

The system includes a comprehensive email service with:

- **HTML Templates**: Professional email templates using Handlebars
- **SMTP Configuration**: Support for various email providers
- **Email Types**:
  - Email verification with 6-digit codes
  - Welcome emails for new students
  - Password reset notifications
  - RFID registration confirmations

### Email Templates

- `email-verification.hbs` - Email verification codes
- `welcome.hbs` - Welcome new students
- `password-reset.hbs` - Password reset instructions
- `rfid-registration.hbs` - RFID card registration confirmation

## Database Management

The template includes helpful Prisma scripts:

```bash
# Generate Prisma client
bun run db:generate

# Run migrations
bun run db:migrate

# Push schema changes (for prototyping)
bun run db:push

# Open Prisma Studio (database GUI)
bun run db:studio

# Reset database
bun run db:reset
```

## 🛡️ Authentication System

### Guards Documentation

Detailed documentation for all authentication guards:

- **[Guards README](src/auth/guards/README.md)** - Complete guard documentation
- `LocalAuthGuard` - Email/password authentication
- `JwtAuthGuard` - JWT token validation
- `JwtRefreshAuthGuard` - Refresh token validation
- `GoogleAuthGuard` - Google OAuth flow

### Strategies Documentation

Comprehensive strategy implementation details:

- **[Strategies README](src/auth/strategies/README.md)** - Complete strategy documentation
- `LocalStrategy` - Credential validation
- `JwtStrategy` - Access token processing
- `JwtRefreshStrategy` - Refresh token handling
- `GoogleStrategy` - OAuth 2.0 flow with student auto-registration

### Authentication Flow

1. **Student Registration**: `POST /users` with complete student information
2. **Email Verification**: Verify email with 6-digit code
3. **Login**: `POST /auth/login` with verified credentials
4. **Access Protected Routes**: Automatic cookie-based auth
5. **Token Refresh**: `POST /auth/refresh` when token expires
6. **Google OAuth**: `GET /auth/google` for social login with auto-registration
7. **RFID Authentication**: `POST /auth/rfid-login` for card-based access

## Project Structure

```
src/
├── auth/
│   ├── dto/                # Request/response DTOs
│   ├── guards/             # Authentication guards
│   │   └── README.md       # 📚 Guards documentation
│   ├── strategies/         # Passport strategies
│   │   └── README.md       # 📚 Strategies documentation
│   ├── auth.controller.ts  # Auth endpoints
│   ├── auth.service.ts     # Auth business logic
│   └── auth.module.ts      # Auth module
├── users/
│   ├── dto/               # User DTOs
│   │   ├── create-user.request.ts
│   │   ├── user-response.dto.ts
│   │   ├── email-verification.dto.ts
│   │   └── rfid-registration.dto.ts
│   ├── models/            # User interfaces
│   ├── users.controller.ts # Student endpoints
│   ├── users.service.ts   # Student business logic
│   └── users.module.ts    # Users module
├── common/
│   └── email/             # Email service
│       ├── email.service.ts
│       ├── email.module.ts
│       └── templates/     # HTML email templates
├── prisma/
│   ├── prisma.service.ts
│   └── prisma.module.ts
└── main.ts               # Swagger configuration
```

## Environment Variables

| Variable                          | Description                  | Default        |
| --------------------------------- | ---------------------------- | -------------- |
| `DATABASE_URL`                    | PostgreSQL connection string | Required       |
| `JWT_ACCESS_TOKEN_SECRET`         | JWT access token secret      | Required       |
| `JWT_REFRESH_TOKEN_SECRET`        | JWT refresh token secret     | Required       |
| `JWT_ACCESS_TOKEN_EXPIRATION_MS`  | Access token expiration      | 3600000 (1h)   |
| `JWT_REFRESH_TOKEN_EXPIRATION_MS` | Refresh token expiration     | 86400000 (24h) |
| `GOOGLE_CLIENT_ID`                | Google OAuth client ID       | Optional       |
| `GOOGLE_CLIENT_SECRET`            | Google OAuth client secret   | Optional       |
| `AUTH_UI_REDIRECT`                | Redirect URL after auth      | Required       |
| `SMTP_HOST`                       | SMTP server host             | Required       |
| `SMTP_PORT`                       | SMTP server port             | Required       |
| `SMTP_USER`                       | SMTP username                | Required       |
| `SMTP_PASS`                       | SMTP password                | Required       |
| `FROM_EMAIL`                      | From email address           | Required       |
| `FROM_NAME`                       | From name                    | Required       |
| `NODE_ENV`                        | Environment                  | development    |

## Testing

```bash
# Unit tests
bun run test

# E2E tests
bun run test:e2e

# Test coverage
bun run test:cov
```

## 🚀 Development Workflow

### 1. API Development

1. View API docs at `http://localhost:3000/api-docs`
2. Test endpoints interactively in Swagger UI
3. Check authentication flows and responses
4. Validate request/response schemas

### 2. Student Registration Testing

1. Create student via `POST /users`
2. Check email for verification code
3. Verify email via `POST /users/verify-email`
4. Login via `POST /auth/login`
5. Test protected routes with cookies
6. Register RFID card via `POST /users/register-rfid`
7. Test RFID login via `POST /auth/rfid-login`

### 3. Email Service Testing

1. Configure SMTP settings in `.env`
2. Test email verification flow
3. Check HTML email templates
4. Verify email delivery

### 4. Database Changes

1. Update `prisma/schema.prisma`
2. Run `bun run db:migrate`
3. Update DTOs and services
4. Test in Swagger UI

## 🔧 Customization

### Adding New Endpoints

1. Create DTOs with `@ApiProperty()` decorators
2. Add Swagger decorators to controllers
3. Update documentation in method descriptions
4. Test in Swagger UI

### Adding New Guards

1. Create guard extending `AuthGuard`
2. Document in `src/auth/guards/README.md`
3. Add usage examples
4. Update Swagger descriptions

### OAuth Providers

1. Add new strategy (e.g., Facebook, GitHub)
2. Create corresponding guard
3. Document in strategies README
4. Add Swagger documentation

### Email Templates

1. Create new Handlebars templates in `src/common/email/templates/`
2. Add corresponding service methods
3. Test email rendering
4. Update email service documentation

## 🎓 CSGUILD Features

### Student Management

- Complete student registration with academic information
- Email verification system for account security
- RFID card integration for physical access
- Role-based access control (STUDENT role)
- Google OAuth for easy registration

### Email Communication

- Automated email verification
- Welcome emails for new students
- Password reset functionality
- RFID registration confirmations
- Professional HTML email templates

### Security Features

- Email verification required for login
- RFID-based authentication
- JWT token management
- Secure password hashing
- HTTP-only cookie authentication

## Migration from Template

This system has been customized from a generic NestJS authentication template to serve the Computer Science Guild:

- Added comprehensive student fields
- Implemented email verification system
- Added RFID authentication
- Created email service with templates
- Enhanced Google OAuth with auto-registration
- Updated all branding to CSGUILD

## 📋 API Endpoints Documentation

### Authentication Endpoints

| Method | Endpoint                | Description               | Authentication | Request Body                          | Response Body                                                                                                                            | Notes                                                                                      |
| ------ | ----------------------- | ------------------------- | -------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `POST` | `/auth/login`           | Login with email/password | None           | `{ email: string, password: string }` | `201` - `{ message: "Login successful", statusCode: 201 }`                                                                               | Requires email verification. Sets HTTP-only cookies. Rate limited (5 attempts per 15 min). |
| `POST` | `/auth/rfid-login`      | Login with RFID card      | None           | `{ rfidId: string }`                  | `200` - `{ message: "RFID login successful", statusCode: 200, student: { id, email, username, firstName, lastName, course, imageUrl } }` | Quick authentication for terminals. Returns student info.                                  |
| `POST` | `/auth/refresh`         | Refresh access token      | Refresh Cookie | None                                  | `201` - `{ message: "Tokens refreshed successfully", statusCode: 201 }`                                                                  | Uses refresh token from cookie. Updates both tokens.                                       |
| `POST` | `/auth/logout`          | Logout user               | JWT Cookie     | None                                  | `200` - `{ message: "Logout successful", statusCode: 200 }`                                                                              | Clears tokens and cookies. Invalidates refresh token.                                      |
| `GET`  | `/auth/google`          | Initiate Google OAuth     | None           | None                                  | `302` - HTTP redirect to Google OAuth consent screen                                                                                     | Redirects to Google consent screen.                                                        |
| `GET`  | `/auth/google/callback` | Google OAuth callback     | None           | None                                  | `302` - HTTP redirect to frontend with authentication cookies set                                                                        | Handles OAuth callback. Auto-registers users.                                              |

### Student Management Endpoints

| Method | Endpoint                     | Description                 | Authentication           | Request Body                                  | Response Body                                                                                                                                                                                           | Notes                                                              |
| ------ | ---------------------------- | --------------------------- | ------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `POST` | `/users`                     | Register new student        | None                     | `CreateUserRequest`                           | `201` - `{ message: "Student registration successful. Please check your email for verification instructions.", statusCode: 201, details: "A verification email has been sent to your email address." }` | Sends verification email. Auto-generates username if not provided. |
| `POST` | `/users/verify-email`        | Verify email address        | None                     | `{ email: string, verificationCode: string }` | `200` - `{ message: "Email verified successfully", statusCode: 200, details: "Welcome to CSGUILD! You can now access all features." }`                                                                  | 6-digit verification code. Sends welcome email.                    |
| `POST` | `/users/resend-verification` | Resend verification code    | None                     | `{ email: string }`                           | `200` - `{ message: "Email verification code sent successfully", statusCode: 200, details: "Please check your email for the new verification code." }`                                                  | Generates new 6-digit code.                                        |
| `POST` | `/users/register-rfid`       | Register RFID card          | JWT Cookie               | `{ rfidId: string }`                          | `201` - `{ message: "RFID card registered successfully", statusCode: 201, details: "You can now use your RFID card to access CSGUILD services." }`                                                      | Links RFID to student account. Sends confirmation email.           |
| `POST` | `/users/rfid-login`          | Login with RFID (duplicate) | None                     | `{ rfidId: string }`                          | `200` - `{ message: "RFID login successful", statusCode: 200, student: { id, email, username, firstName, lastName } }`                                                                                  | Returns student info without creating session.                     |
| `GET`  | `/users`                     | Get all students            | JWT Cookie + STAFF/ADMIN | None                                          | `200` - Array of `UserResponseDto` objects with full student data                                                                                                                                       | Protected endpoint. Returns comprehensive student data.            |
| `GET`  | `/users/:id`                 | Get student by ID           | JWT Cookie               | None                                          | `200` - Single `UserResponseDto` object with full student data                                                                                                                                          | Students can only access own data. Staff/Admin can access any.     |

### Facility Management Endpoints

| Method   | Endpoint          | Description               | Authentication           | Request Body        | Response Body                                                                                                                        | Notes                                                            |
| -------- | ----------------- | ------------------------- | ------------------------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `POST`   | `/facilities`     | Create facility           | JWT Cookie + STAFF/ADMIN | `CreateFacilityDto` | `201` - `FacilityResponseDto` with `{ id, name, description, location, capacity, currentOccupancy, isActive, createdAt, updatedAt }` | Name must be unique. Includes occupancy info.                    |
| `GET`    | `/facilities`     | Get all active facilities | None                     | None                | `200` - Array of `FacilityResponseDto` objects with current occupancy data                                                           | Public endpoint. Includes current occupancy.                     |
| `GET`    | `/facilities/:id` | Get facility by ID        | None                     | None                | `200` - Single `FacilityResponseDto` object with real-time occupancy                                                                 | Public endpoint. Includes real-time occupancy.                   |
| `PUT`    | `/facilities/:id` | Update facility           | JWT Cookie + STAFF/ADMIN | `UpdateFacilityDto` | `200` - Updated `FacilityResponseDto` object                                                                                         | Can update name, description, location, capacity, active status. |
| `DELETE` | `/facilities/:id` | Delete facility           | JWT Cookie + STAFF/ADMIN | None                | `204` - No content (empty response body)                                                                                             | Soft delete. Cannot delete with active sessions.                 |

### Facility Access Control Endpoints

| Method | Endpoint                          | Description                 | Authentication           | Request Body                             | Response Body                                                                                                                                                                                                                                                   | Notes                                          |
| ------ | --------------------------------- | --------------------------- | ------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `POST` | `/facilities/toggle`              | Toggle facility access      | None                     | `{ rfidId: string, facilityId: string }` | `200/201` - `FacilityToggleResponseDto` with `{ message, statusCode, action, details, student: { id, firstName, lastName, username, email, imageUrl, course }, facility: { id, name, location }, session: { id, timeIn, timeOut, isActive, durationMinutes } }` | Smart endpoint: auto-detects time-in/time-out. |
| `POST` | `/facilities/status`              | Check facility usage status | None                     | `{ rfidId: string, facilityId: string }` | `200` - `{ message: "Usage status retrieved successfully", statusCode: 200, isCurrentlyInFacility: boolean, currentSession: FacilityUsageResponseDto \| null }`                                                                                                 | Check if student is in facility.               |
| `GET`  | `/facilities/:id/active-sessions` | Get active sessions         | JWT Cookie + STAFF/ADMIN | None                                     | `200` - Array of `FacilityUsageResponseDto` objects with `{ id, student: { id, firstName, lastName, username, email }, facility: { id, name, location }, timeIn, timeOut, isActive, durationMinutes }`                                                          | Real-time facility occupancy.                  |
| `GET`  | `/facilities/:id/usage-history`   | Get facility usage history  | JWT Cookie + STAFF/ADMIN | Query: `page`, `limit`                   | `200` - `{ data: FacilityUsageResponseDto[], total: number, page: number, limit: number }` where each usage record contains student info, facility info, session times, and duration                                                                            | Historical usage data with pagination.         |

### System Endpoints

| Method | Endpoint  | Description          | Authentication | Request Body | Response Body                                                         | Notes                  |
| ------ | --------- | -------------------- | -------------- | ------------ | --------------------------------------------------------------------- | ---------------------- |
| `GET`  | `/health` | Check server health  | None           | None         | `200` - `{ status: "ok" }` or similar health status object            | Health check endpoint. |
| `GET`  | `/logs`   | Log viewer interface | None           | None         | `200` - HTML document with tabbed interface for real-time log viewing | Real-time log viewer.  |

### Request/Response Examples

#### Student Registration (`POST /users`)

**Request:**

```json
{
  "email": "john.doe@example.com",
  "username": "johndoe123",
  "password": "MyStr0ngP@ssw0rd!",
  "firstName": "John",
  "lastName": "Doe",
  "birthdate": "2000-01-15",
  "course": "Bachelor of Science in Computer Science",
  "rfidId": "RF001234567"
}
```

**Response:**

```json
{
  "message": "Student registration successful. Please check your email for verification instructions.",
  "statusCode": 201,
  "details": "A verification email has been sent to your email address."
}
```

#### Login (`POST /auth/login`)

**Request:**

```json
{
  "email": "john.doe@example.com",
  "password": "MyStr0ngP@ssw0rd!"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "statusCode": 201
}
```

#### Facility Toggle (`POST /facilities/toggle`)

**Request:**

```json
{
  "rfidId": "RF001234567",
  "facilityId": "clm7x8k9e0000v8og4n2h5k7s"
}
```

**Response (Time-In):**

```json
{
  "message": "Time-in successful",
  "statusCode": 201,
  "action": "time-in",
  "details": "Successfully checked in to Computer Lab 1",
  "student": {
    "id": "clm7x8k9e0000v8og4n2h5k7s",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe123",
    "email": "john.doe@example.com",
    "imageUrl": "https://example.com/avatar.jpg",
    "course": "Bachelor of Science in Computer Science"
  },
  "facility": {
    "id": "clm7x8k9e0000v8og4n2h5k7s",
    "name": "Computer Lab 1",
    "location": "Building A, 2nd Floor"
  },
  "session": {
    "id": "clm7x8k9e0000v8og4n2h5k7s",
    "timeIn": "2024-07-05T05:36:19.000Z",
    "timeOut": null,
    "isActive": true,
    "durationMinutes": null
  }
}
```

#### Create Facility (`POST /facilities`)

**Request:**

```json
{
  "name": "Computer Lab 1",
  "description": "Main computer laboratory with 30 workstations",
  "location": "Building A, 2nd Floor",
  "capacity": 30,
  "isActive": true
}
```

**Response:**

```json
{
  "id": "clm7x8k9e0000v8og4n2h5k7s",
  "name": "Computer Lab 1",
  "description": "Main computer laboratory with 30 workstations",
  "location": "Building A, 2nd Floor",
  "capacity": 30,
  "currentOccupancy": 0,
  "isActive": true,
  "createdAt": "2024-07-05T05:36:19.000Z",
  "updatedAt": "2024-07-05T05:36:19.000Z"
}
```

#### Get Student Data (`GET /users/:id`)

**Response:**

```json
{
  "id": "clm7x8k9e0000v8og4n2h5k7s",
  "email": "john.doe@example.com",
  "username": "johndoe123",
  "firstName": "John",
  "lastName": "Doe",
  "birthdate": "2000-01-15T00:00:00.000Z",
  "course": "Bachelor of Science in Computer Science",
  "imageUrl": "https://lh3.googleusercontent.com/a/default-user=s96-c",
  "emailVerified": true,
  "hasRefreshToken": true,
  "hasRfidCard": true,
  "roles": ["STUDENT"],
  "signupMethod": "EMAIL",
  "createdAt": "2024-07-05T05:36:19.000Z",
  "updatedAt": "2024-07-05T05:36:19.000Z"
}
```

#### Email Verification (`POST /users/verify-email`)

**Request:**

```json
{
  "email": "john.doe@example.com",
  "verificationCode": "123456"
}
```

**Response:**

```json
{
  "message": "Email verified successfully",
  "statusCode": 200,
  "details": "Welcome to CSGUILD! You can now access all features."
}
```

### Authentication Methods

1. **JWT Cookies**:
   - `Authentication`: Access token (1 hour)
   - `Refresh`: Refresh token (24 hours)
   - HTTP-only, secure cookies

2. **RFID Authentication**:
   - No session required
   - Direct card-to-student mapping
   - Requires email verification

3. **Google OAuth**:
   - Automatic account creation
   - Email auto-verification
   - Seamless login flow

### Role-Based Access Control

- **STUDENT**: Default role, basic access
- **STAFF**: Facility management, student data access
- **ADMIN**: Full system access

### Rate Limiting

- **Login attempts**: 5 per IP per 15 minutes
- **Email verification**: Standard rate limiting
- **RFID operations**: No rate limiting (hardware integration)

### Error Handling

All endpoints return standardized error responses:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Security Features

- **Password Requirements**: Strong passwords with mixed case, numbers, special characters
- **Email Verification**: Required before full access
- **RFID Validation**: Unique card registration
- **Token Security**: HTTP-only cookies, refresh rotation
- **Role Protection**: Endpoint-level authorization

## License

This project is [MIT licensed](LICENSE).

## Support

For support with the CSGUILD backend system, please contact the development team or create an issue in the repository.
