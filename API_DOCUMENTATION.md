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
