## 📋 API Endpoints Documentation

### Authentication Endpoints

| Method | Endpoint                | Description               | Authentication | Request Body                             | Response Body                                                                                                                            | Notes                                                                                        |
| ------ | ----------------------- | ------------------------- | -------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `POST` | `/auth/login`           | Login with email/password | None           | `{ email: string, password: string }`    | `201` - `{ message: "Login successful", statusCode: 201 }`                                                                               | Requires email verification. Sets HTTP-only cookies. Rate limited (5 attempts per 15 min).   |
| `POST` | `/auth/rfid-login`      | Login with RFID card      | None           | `{ rfidId: string }`                     | `200` - `{ message: "RFID login successful", statusCode: 200, student: { id, email, username, firstName, lastName, course, imageUrl } }` | Quick authentication for terminals. Returns student info.                                    |
| `POST` | `/auth/refresh`         | Refresh access token      | Refresh Cookie | None                                     | `201` - `{ message: "Tokens refreshed successfully", statusCode: 201 }`                                                                  | Uses refresh token from cookie. Updates both tokens.                                         |
| `POST` | `/auth/logout`          | Logout user               | JWT Cookie     | None                                     | `200` - `{ message: "Logout successful", statusCode: 200 }`                                                                              | Clears tokens and cookies. Invalidates refresh token.                                        |
| `POST` | `/auth/forgot-password` | Request password reset    | None           | `{ email: string }`                      | `200` - `{ message: "Password reset email sent if the email exists in our system", statusCode: 200 }`                                    | Sends reset link via email. No information leakage about email existence. 1-hour expiration. |
| `POST` | `/auth/reset-password`  | Reset password with token | None           | `{ token: string, newPassword: string }` | `200` - `{ message: "Password reset successful. Please log in with your new password.", statusCode: 200 }`                               | One-time use token. Invalidates all sessions. Minimum 8 characters for new password.         |
| `GET`  | `/auth/google`          | Initiate Google OAuth     | None           | None                                     | `302` - HTTP redirect to Google OAuth consent screen                                                                                     | Redirects to Google consent screen.                                                          |
| `GET`  | `/auth/google/callback` | Google OAuth callback     | None           | None                                     | `302` - HTTP redirect to frontend with authentication cookies set                                                                        | Handles OAuth callback. Auto-registers users.                                                |
| `GET`  | `/auth/me`              | Get current user          | JWT Cookie     | None                                     | `200` - `UserResponseDto` with current user details                                                                                      | Returns current authenticated user information.                                              |

### Student Management Endpoints

| Method  | Endpoint                     | Description                 | Authentication           | Request Body                                  | Response Body                                                                                                                                                                                           | Notes                                                              |
| ------- | ---------------------------- | --------------------------- | ------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `POST`  | `/users`                     | Register new student        | None                     | `CreateUserRequest`                           | `201` - `{ message: "Student registration successful. Please check your email for verification instructions.", statusCode: 201, details: "A verification email has been sent to your email address." }` | Sends verification email. Auto-generates username if not provided. |
| `POST`  | `/users/verify-email`        | Verify email address        | None                     | `{ email: string, verificationCode: string }` | `200` - `{ message: "Email verified successfully", statusCode: 200, details: "Welcome to CSGUILD! You can now access all features." }`                                                                  | 6-digit verification code. Sends welcome email.                    |
| `POST`  | `/users/resend-verification` | Resend verification code    | None                     | `{ email: string }`                           | `200` - `{ message: "Email verification code sent successfully", statusCode: 200, details: "Please check your email for the new verification code." }`                                                  | Generates new 6-digit code.                                        |
| `POST`  | `/users/register-rfid`       | Register RFID card          | JWT Cookie               | `{ rfidId: string }`                          | `201` - `{ message: "RFID card registered successfully", statusCode: 201, details: "You can now use your RFID card to access CSGUILD services." }`                                                      | Links RFID to student account. Sends confirmation email.           |
| `POST`  | `/users/rfid-login`          | Login with RFID (duplicate) | None                     | `{ rfidId: string }`                          | `200` - `{ message: "RFID login successful", statusCode: 200, student: { id, email, username, firstName, lastName } }`                                                                                  | Returns student info without creating session.                     |
| `GET`   | `/users`                     | Get all students            | JWT Cookie + STAFF/ADMIN | None                                          | `200` - Array of `UserResponseDto` objects with full student data                                                                                                                                       | Protected endpoint. Returns comprehensive student data.            |
| `GET`   | `/users/:id`                 | Get student by ID           | JWT Cookie               | None                                          | `200` - Single `UserResponseDto` object with full student data                                                                                                                                          | Students can only access own data. Staff/Admin can access any.     |
| `PATCH` | `/users/profile`             | Update user profile         | JWT Cookie               | `UpdateUserRequest`                           | `200` - Updated `UserResponseDto` object with updated user data                                                                                                                                         | Users can update their own profile information.                    |

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

### Project Management Endpoints

| Method   | Endpoint                                             | Description                       | Authentication             | Request Body             | Response Body                                                                                          | Notes                                                                                                                                                                                                       |
| -------- | ---------------------------------------------------- | --------------------------------- | -------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST`   | `/projects`                                          | Create new project                | JWT Cookie                 | `CreateProjectDto`       | `201` - `ProjectCreateResponseDto` with project details including roles, owner info, and member counts | Requires title, description, tags, dueDate, and at least 1 role. Auto-generates slug.                                                                                                                       |
| `GET`    | `/projects`                                          | Get all projects with filters     | None/JWT Cookie (optional) | Query parameters         | `200` - `ProjectListResponse` with pagination and filtering options                                    | Supports filtering by status, tags, search, ownerSlug, pinned. Public endpoint. Max 100 items per page. **Default behavior excludes pinned projects**. Use ?pinned=true with auth for pinned projects only. |
| `GET`    | `/projects/my-projects`                              | Get current user's projects       | JWT Cookie                 | None                     | `200` - `MyProjectsResponseDto` with owned and member projects separated                               | Shows projects user owns or is a member of.                                                                                                                                                                 |
| `GET`    | `/projects/my-applications`                          | Get current user's applications   | JWT Cookie                 | None                     | `200` - `MyApplicationsResponseDto` with application status and project details                        | Shows all applications user has submitted.                                                                                                                                                                  |
| `GET`    | `/projects/saved`                                    | Get saved projects                | JWT Cookie                 | Query: pagination params | `200` - `ProjectListResponse` with saved projects and pagination                                       | Shows projects saved by current user with pagination.                                                                                                                                                       |
| `GET`    | `/projects/:slug`                                    | Get project by slug               | None                       | None                     | `200` - `ProjectDetailResponse` with complete project details, members, applications, and roles        | Full project details including team composition. Public endpoint.                                                                                                                                           |
| `GET`    | `/projects/:slug/basic`                              | Get basic project info            | None                       | None                     | `200` - Basic `Project` object without members or applications                                         | Lightweight endpoint for basic project info.                                                                                                                                                                |
| `GET`    | `/projects/:slug/applications`                       | Get project applications          | None                       | Query: `roleSlug`        | `200` - Array of `ProjectApplication` objects                                                          | Public endpoint. Can filter by role slug.                                                                                                                                                                   |
| `GET`    | `/projects/:slug/members`                            | Get project members               | None                       | Query: `roleSlug`        | `200` - Array of `ProjectMember` objects                                                               | Public endpoint. Can filter by role slug.                                                                                                                                                                   |
| `PATCH`  | `/projects/:slug`                                    | Update project                    | JWT Cookie                 | `UpdateProjectDto`       | `200` - `ProjectUpdateResponseDto` with updated project details                                        | Only project owner can update. Can modify roles.                                                                                                                                                            |
| `PATCH`  | `/projects/:slug/status`                             | Update project status             | JWT Cookie                 | `UpdateProjectStatusDto` | `200` - `ProjectStatusUpdateResponseDto` with updated project                                          | Only project owner can change status.                                                                                                                                                                       |
| `DELETE` | `/projects/:slug`                                    | Delete project                    | JWT Cookie                 | None                     | `200` - `ProjectDeleteResponseDto` with success message                                                | Only project owner can delete. Cascade deletes.                                                                                                                                                             |
| `POST`   | `/projects/join`                                     | Apply to join project             | JWT Cookie                 | `JoinProjectDto`         | `201` - `JoinProjectResponseDto` with application details                                              | Uses projectSlug and roleSlug. Prevents duplicate applications.                                                                                                                                             |
| `POST`   | `/projects/applications/review`                      | Review project application        | JWT Cookie                 | `ReviewApplicationDto`   | `200` - `ReviewApplicationResponseDto` with review details                                             | Only project owner can review. Approves/rejects apps.                                                                                                                                                       |
| `DELETE` | `/projects/:slug/members/:memberUserSlug`            | Remove project member             | JWT Cookie                 | None                     | `200` - `RemoveProjectMemberResponseDto` with success message                                          | Only project owner can remove members. Cannot remove self.                                                                                                                                                  |
| `PATCH`  | `/projects/:slug/members/:memberUserSlug/reactivate` | Reactivate removed project member | JWT Cookie                 | None                     | `200` - `ReactivateProjectMemberResponseDto` with success message                                      | Only project owner can reactivate. Role must have capacity.                                                                                                                                                 |
| `POST`   | `/projects/:slug/pin`                                | Pin project (Admin only)          | JWT Cookie + ADMIN         | None                     | `201` - `PinProjectResponseDto` with success message                                                   | Global pinning for visibility. Max 6 pinned projects. Pinned projects are excluded from regular listings.                                                                                                   |
| `DELETE` | `/projects/:slug/unpin`                              | Unpin project (Admin only)        | JWT Cookie + ADMIN         | None                     | `200` - `UnpinProjectResponseDto` with success message                                                 | Remove from global pinned list. Project will appear in regular listings again.                                                                                                                              |
| `POST`   | `/projects/:slug/save`                               | Save project                      | JWT Cookie                 | None                     | `201` - `SaveProjectResponseDto` with saved project details                                            | Personal save for later access.                                                                                                                                                                             |
| `DELETE` | `/projects/:slug/unsave`                             | Unsave project                    | JWT Cookie                 | None                     | `200` - `UnsaveProjectResponseDto` with success message                                                | Remove from personal saved list.                                                                                                                                                                            |

### Role Management Endpoints

| Method   | Endpoint       | Description                | Authentication           | Request Body     | Response Body                                                       | Notes                                                     |
| -------- | -------------- | -------------------------- | ------------------------ | ---------------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| `GET`    | `/roles`       | Get all roles with filters | None                     | Query parameters | `200` - `RoleListResponseDto` with pagination and filtering options | Public endpoint. Supports search, pagination, sorting.    |
| `GET`    | `/roles/:slug` | Get role by slug           | None                     | None             | `200` - `RoleResponseDto` with role details                         | Public endpoint. Uses slug as identifier.                 |
| `POST`   | `/roles`       | Create new role            | JWT Cookie + STAFF/ADMIN | `CreateRoleDto`  | `201` - `CreateRoleResponseDto` with created role details           | Only staff/admin can create. Auto-generates slug.         |
| `PATCH`  | `/roles/:slug` | Update role                | JWT Cookie + STAFF/ADMIN | `UpdateRoleDto`  | `200` - `UpdateRoleResponseDto` with updated role details           | Only staff/admin can update. Validates uniqueness.        |
| `DELETE` | `/roles/:slug` | Delete role                | JWT Cookie + STAFF/ADMIN | None             | `200` - `{ message: "Role deleted successfully" }`                  | Only staff/admin can delete. Prevents deletion if in use. |

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

#### Forgot Password (`POST /auth/forgot-password`)

**Request:**

```json
{
  "email": "john.doe@example.com"
}
```

**Response:**

```json
{
  "message": "Password reset email sent if the email exists in our system",
  "statusCode": 200
}
```

#### Get Current User (`GET /auth/me`)

**Authentication Required:** JWT Cookie in `Authentication` header

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
  "rfidId": "RF001234567",
  "roles": ["STUDENT"],
  "signupMethod": "EMAIL",
  "currentFacilityId": null,
  "createdAt": "2024-07-05T05:36:19.000Z",
  "updatedAt": "2024-07-05T05:36:19.000Z"
}
```

#### Reset Password (`POST /auth/reset-password`)

**Request:**

```json
{
  "token": "abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
  "newPassword": "MyNewStr0ngP@ssw0rd!"
}
```

**Response:**

```json
{
  "message": "Password reset successful. Please log in with your new password.",
  "statusCode": 200
}
```

#### Create Project (`POST /projects`)

**Authentication Required:** JWT Cookie in `Authentication` header

**Request:**

```json
{
  "title": "CS Guild Mobile App Development",
  "description": "We are looking for developers to help build a mobile application for the CS Guild community. The app will include features for project collaboration, event management, and member networking.",
  "tags": ["mobile", "react-native", "typescript", "collaboration"],
  "dueDate": "2024-12-31T23:59:59.000Z",
  "roles": [
    {
      "roleSlug": "frontend-developer",
      "maxMembers": 2,
      "requirements": "Experience with React Native and TypeScript required"
    },
    {
      "roleSlug": "ui-ux-designer",
      "maxMembers": 1,
      "requirements": "UI/UX design experience with mobile applications"
    }
  ]
}
```

**Response:**

```json
{
  "message": "Project created successfully",
  "statusCode": 201,
  "project": {
    "id": "clm7x8k9e0000v8og4n2h5k7s",
    "title": "CS Guild Mobile App Development",
    "slug": "cs-guild-mobile-app-development",
    "description": "We are looking for developers to help build a mobile application for the CS Guild community.",
    "tags": ["mobile", "react-native", "typescript", "collaboration"],
    "dueDate": "2024-12-31T23:59:59.000Z",
    "status": "OPEN",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "owner": {
      "id": "clm7x8k9e0000v8og4n2h5k7s",
      "username": "johndoe123",
      "firstName": "John",
      "lastName": "Doe",
      "imageUrl": "https://example.com/avatar.jpg"
    },
    "roles": [
      {
        "id": "clm7x8k9e0000v8og4n2h5k7s",
        "role": {
          "id": "clm7x8k9e0000v8og4n2h5k7s",
          "name": "Frontend Developer",
          "slug": "frontend-developer"
        },
        "maxMembers": 2,
        "currentMembers": 0,
        "requirements": "Experience with React Native and TypeScript required"
      }
    ],
    "memberCount": 0,
    "applicationCount": 0
  }
}
```

#### Join Project (`POST /projects/join`)

**Authentication Required:** JWT Cookie in `Authentication` header

**Request:**

```json
{
  "projectSlug": "cs-guild-mobile-app-development",
  "roleSlug": "frontend-developer",
  "message": "I have 3 years of experience with React Native and would love to contribute to this project. I have previously worked on similar mobile applications and am excited about the CS Guild community."
}
```

**Response:**

```json
{
  "message": "Application submitted successfully",
  "statusCode": 201,
  "application": {
    "id": "clm7x8k9e0000v8og4n2h5k7s",
    "user": {
      "id": "clm7x8k9e0000v8og4n2h5k7s",
      "username": "janedoe456",
      "firstName": "Jane",
      "lastName": "Doe",
      "imageUrl": "https://example.com/jane-avatar.jpg"
    },
    "projectRole": {
      "id": "clm7x8k9e0000v8og4n2h5k7t",
      "role": {
        "id": "clm7x8k9e0000v8og4n2h5k7s",
        "name": "Frontend Developer",
        "slug": "frontend-developer"
      }
    },
    "message": "I have 3 years of experience with React Native and would love to contribute to this project.",
    "status": "PENDING",
    "appliedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

#### Get Projects with Filtering (`GET /projects`)

**Authentication Required:** None (Public endpoint), Optional JWT Cookie for pinned projects

**Query Parameters:**

- `status` - Filter by project status (OPEN, IN_PROGRESS, COMPLETED, CANCELLED)
- `tags` - Comma-separated list of tags to filter by
- `search` - Search in project title and description
- `ownerSlug` - Filter by project owner username
- `page` - Page number for pagination (default: 1)
- `limit` - Number of items per page (default: 10, max: 100)
- `sortBy` - Field to sort by (createdAt, updatedAt, dueDate, title, default: createdAt)
- `sortOrder` - Sort direction (asc, desc, default: desc)
- `pinned` - Filter to show only pinned projects (requires authentication)

**Important Behavior:**

- **Default behavior**: Returns all projects **excluding** pinned projects to avoid duplication
- **With `pinned=true`**: Returns **only** globally pinned projects (requires authentication)
- **With `pinned=false`**: Returns all projects excluding pinned projects (same as default)

**Example Request (Regular Projects - Excludes Pinned):**
`GET /projects?status=OPEN&tags=mobile,typescript&page=1&limit=5&sortBy=createdAt&sortOrder=desc`

**Example Request (Pinned Projects Only):**
`GET /projects?pinned=true` (requires authentication)

**Response:**

```json
{
  "message": "Projects retrieved successfully",
  "statusCode": 200,
  "data": [
    {
      "id": "clm7x8k9e0000v8og4n2h5k7s",
      "title": "CS Guild Mobile App Development",
      "slug": "cs-guild-mobile-app-development",
      "description": "We are looking for developers to help build a mobile application for the CS Guild community.",
      "tags": ["mobile", "react-native", "typescript", "collaboration"],
      "dueDate": "2024-12-31T23:59:59.000Z",
      "status": "OPEN",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "owner": {
        "id": "clm7x8k9e0000v8og4n2h5k7s",
        "username": "johndoe123",
        "firstName": "John",
        "lastName": "Doe",
        "imageUrl": "https://example.com/avatar.jpg"
      },
      "roles": [
        {
          "id": "clm7x8k9e0000v8og4n2h5k7s",
          "role": {
            "name": "Frontend Developer",
            "slug": "frontend-developer"
          },
          "maxMembers": 2,
          "currentMembers": 1
        }
      ],
      "memberCount": 1,
      "applicationCount": 3
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 5,
  "totalPages": 3
}
```

**Note:** This response shows regular projects only. Pinned projects are excluded from the default listing and must be requested separately using `?pinned=true`.

#### Review Application (`POST /projects/applications/review`)

**Authentication Required:** JWT Cookie in `Authentication` header

**Request:**

```json
{
  "applicationId": "clm7x8k9e0000v8og4n2h5k7s",
  "decision": "APPROVED",
  "reviewMessage": "Welcome to the team! Your experience looks great."
}
```

**Response:**

```json
{
  "message": "Application reviewed successfully",
  "statusCode": 200,
  "application": {
    "id": "clm7x8k9e0000v8og4n2h5k7s",
    "user": {
      "id": "clm7x8k9e0000v8og4n2h5k7s",
      "username": "janedoe456",
      "firstName": "Jane",
      "lastName": "Doe",
      "imageUrl": "https://example.com/jane-avatar.jpg"
    },
    "projectRole": {
      "id": "clm7x8k9e0000v8og4n2h5k7t",
      "role": {
        "id": "clm7x8k9e0000v8og4n2h5k7s",
        "name": "Frontend Developer",
        "slug": "frontend-developer"
      }
    },
    "message": "I have 3 years of experience with React Native and would love to contribute to this project.",
    "status": "APPROVED",
    "appliedAt": "2024-01-02T00:00:00.000Z",
    "reviewedAt": "2024-01-03T00:00:00.000Z",
    "reviewMessage": "Welcome to the team! Your experience looks great.",
    "reviewer": {
      "id": "clm7x8k9e0000v8og4n2h5k7s",
      "username": "johndoe123",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

#### Get My Projects (`GET /projects/my-projects`)

**Authentication Required:** JWT Cookie in `Authentication` header

**Response:**

```json
{
  "statusCode": 200,
  "message": "User projects retrieved successfully",
  "ownedProjects": [
    {
      "id": "clm7x8k9e0000v8og4n2h5k7s",
      "slug": "cs-guild-mobile-app-development",
      "title": "CS Guild Mobile App Development",
      "description": "Building a mobile app for the CS Guild community",
      "tags": ["mobile", "react-native", "typescript"],
      "dueDate": "2024-12-31T23:59:59.000Z",
      "status": "OPEN",
      "createdAt": "2024-07-10T10:00:00.000Z",
      "owner": {
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe",
        "imageUrl": "https://example.com/avatar.jpg"
      },
      "roles": [
        {
          "roleSlug": "frontend-developer",
          "maxMembers": 2,
          "requirements": "React Native experience required",
          "role": {
            "name": "Frontend Developer",
            "slug": "frontend-developer"
          }
        }
      ],
      "memberCount": 1,
      "applicationCount": 3
    }
  ],
  "memberProjects": [
    {
      "id": "clm7x8k9e0000v8og4n2h5k8t",
      "slug": "community-website",
      "title": "Community Website",
      "description": "Building the CS Guild community website",
      "tags": ["web", "nextjs", "typescript"],
      "dueDate": "2024-11-30T23:59:59.000Z",
      "status": "IN_PROGRESS",
      "createdAt": "2024-07-05T14:30:00.000Z",
      "owner": {
        "username": "janedoe",
        "firstName": "Jane",
        "lastName": "Doe",
        "imageUrl": "https://example.com/jane-avatar.jpg"
      },
      "roles": [],
      "memberCount": 4,
      "applicationCount": 0
    }
  ]
}
```

#### Get Saved Projects (`GET /projects/saved`)

**Authentication Required:** JWT Cookie in `Authentication` header

**Query Parameters:**

- `page` - Page number for pagination (default: 1)
- `limit` - Number of items per page (default: 10, max: 100)
- `sortBy` - Field to sort by (createdAt, updatedAt, dueDate, title, default: createdAt)
- `sortOrder` - Sort direction (asc, desc, default: desc)

**Example Request:**
`GET /projects/saved?page=1&limit=5&sortBy=createdAt&sortOrder=desc`

**Response:**

```json
{
  "data": [
    {
      "id": "clm7x8k9e0000v8og4n2h5k7s",
      "slug": "cs-guild-mobile-app-development",
      "title": "CS Guild Mobile App Development",
      "description": "Building a mobile app for the CS Guild community",
      "tags": ["mobile", "react-native", "typescript"],
      "dueDate": "2024-12-31T23:59:59.000Z",
      "status": "OPEN",
      "createdAt": "2024-07-10T10:00:00.000Z",
      "owner": {
        "username": "projectowner",
        "firstName": "Project",
        "lastName": "Owner",
        "imageUrl": "https://example.com/owner-avatar.jpg"
      },
      "roles": [],
      "memberCount": 2,
      "applicationCount": 5
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 12,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Remove Project Member (`DELETE /projects/:slug/members/:memberUserSlug`)

**Authentication Required:** JWT Cookie in `Authentication` header

**Request:**
`DELETE /projects/cs-guild-mobile-app-development/members/johndoe`

**Response:**

```json
{
  "message": "Project member removed successfully",
  "statusCode": 200
}
```

#### Reactivate Project Member (`PATCH /projects/:slug/members/:memberUserSlug/reactivate`)

**Authentication Required:** JWT Cookie in `Authentication` header

**Request:**
`PATCH /projects/cs-guild-mobile-app-development/members/johndoe/reactivate`

**Response:**

```json
{
  "message": "Project member reactivated successfully",
  "statusCode": 200
}
```

#### Save Project (`POST /projects/:slug/save`)

**Authentication Required:** JWT Cookie in `Authentication` header

**Request:**
`POST /projects/cs-guild-mobile-app-development/save`

**Response:**

```json
{
  "message": "Project saved successfully",
  "statusCode": 201,
  "savedProject": {
    "id": "clm7x8k9e0000v8og4n2h5k7s",
    "userSlug": "johndoe",
    "projectSlug": "cs-guild-mobile-app-development",
    "savedAt": "2024-07-16T10:30:00.000Z"
  }
}
```

#### Unsave Project (`DELETE /projects/:slug/unsave`)

**Authentication Required:** JWT Cookie in `Authentication` header

**Request:**
`DELETE /projects/cs-guild-mobile-app-development/unsave`

**Response:**

```json
{
  "message": "Project unsaved successfully",
  "statusCode": 200
}
```

#### Pin Project (`POST /projects/:slug/pin`)

**Authentication Required:** JWT Cookie with ADMIN role

**Request:**
`POST /projects/cs-guild-mobile-app-development/pin`

**Response:**

```json
{
  "message": "Project pinned successfully",
  "statusCode": 201
}
```

#### Unpin Project (`DELETE /projects/:slug/unpin`)

**Authentication Required:** JWT Cookie with ADMIN role

**Request:**
`DELETE /projects/cs-guild-mobile-app-development/unpin`

**Response:**

```json
{
  "message": "Project unpinned successfully",
  "statusCode": 200
}
```

### Project Visibility Model

The CS Guild platform uses a dual-visibility system for projects to provide better user experience and avoid content duplication:

#### Regular Project Listings

- **Endpoint**: `GET /projects` (without `pinned=true`)
- **Content**: All projects **except** pinned projects
- **Purpose**: Main project discovery and browsing
- **Authentication**: None required (public)

#### Pinned Project Listings

- **Endpoint**: `GET /projects?pinned=true`
- **Content**: Only globally pinned projects (max 6)
- **Purpose**: Showcase featured/important projects
- **Authentication**: Required (JWT Cookie)
- **Ordering**: Sorted by admin-defined order (1-6)

#### Benefits of This Model

1. **No Duplication**: Pinned projects don't appear in both regular and pinned results
2. **Clear Intent**: Users get exactly what they request
3. **Performance**: Reduced data overlap and cleaner pagination
4. **Admin Control**: Pinned projects get dedicated visibility without cluttering regular browsing

### Authentication Methods

1. **JWT Cookies**:
   - `Authentication`: Access token (1 hour)
   - `Refresh`: Refresh token (24 hours)
   - HTTP-only, secure cookies
   - Used for most authenticated endpoints

2. **RFID Authentication**:
   - No session required
   - Direct card-to-student mapping
   - Requires email verification
   - Used for facility access

3. **Google OAuth**:
   - Automatic account creation
   - Email auto-verification
   - Seamless login flow

### Role-Based Access Control

- **STUDENT**: Default role, basic access, can create/manage own projects, apply to join projects
- **STAFF**: Facility management, student data access, role management
- **ADMIN**: Full system access, project pinning, role management, facility management

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
- **Project Ownership**: Only project owners can modify/delete their projects
- **Application Privacy**: Users can only see their own applications
- **Member Management**: Project owners control team membership

#### Create Role (`POST /roles`)

**Authentication Required:** JWT Cookie with STAFF or ADMIN role

**Request:**

```json
{
  "name": "Frontend Developer",
  "description": "Responsible for building and maintaining user interfaces using modern web technologies"
}
```

**Response:**

```json
{
  "message": "Role created successfully",
  "statusCode": 201,
  "role": {
    "id": "clm7x8k9e0000v8og4n2h5k7s",
    "name": "Frontend Developer",
    "slug": "frontend-developer",
    "description": "Responsible for building and maintaining user interfaces using modern web technologies",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get Roles (`GET /roles`)

**Request:**

```
GET /roles?search=frontend&page=1&limit=10&sortBy=name&sortOrder=asc
```

**Response:**

```json
{
  "message": "Roles retrieved successfully",
  "statusCode": 200,
  "data": [
    {
      "id": "clm7x8k9e0000v8og4n2h5k7s",
      "name": "Frontend Developer",
      "slug": "frontend-developer",
      "description": "Responsible for building and maintaining user interfaces using modern web technologies",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

#### Update Role (`PATCH /roles/:slug`)

**Authentication Required:** JWT Cookie with STAFF or ADMIN role

**Request:**

```json
{
  "name": "Senior Frontend Developer",
  "description": "Lead frontend development initiatives and mentor junior developers"
}
```

**Response:**

```json
{
  "message": "Role updated successfully",
  "statusCode": 200,
  "role": {
    "id": "clm7x8k9e0000v8og4n2h5k7s",
    "name": "Senior Frontend Developer",
    "slug": "senior-frontend-developer",
    "description": "Lead frontend development initiatives and mentor junior developers",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### Get Role by Slug (`GET /roles/:slug`)

**Request:**

```
GET /roles/frontend-developer
```

**Response:**

```json
{
  "id": "clm7x8k9e0000v8og4n2h5k7s",
  "name": "Frontend Developer",
  "slug": "frontend-developer",
  "description": "Responsible for building and maintaining user interfaces using modern web technologies",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Update User Profile (`PATCH /users/profile`)

**Authentication Required:** JWT Cookie in `Authentication` header

**Request:**

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "course": "Bachelor of Science in Information Technology",
  "birthdate": "2000-01-15T00:00:00.000Z"
}
```

**Response:**

```json
{
  "id": "clm7x8k9e0000v8og4n2h5k7s",
  "email": "john.doe@example.com",
  "username": "johndoe123",
  "firstName": "John",
  "lastName": "Smith",
  "birthdate": "2000-01-15T00:00:00.000Z",
  "course": "Bachelor of Science in Information Technology",
  "imageUrl": "https://lh3.googleusercontent.com/a/default-user=s96-c",
  "emailVerified": true,
  "hasRefreshToken": true,
  "hasRfidCard": true,
  "rfidId": "RF001234567",
  "roles": ["STUDENT"],
  "signupMethod": "EMAIL",
  "createdAt": "2024-07-05T05:36:19.000Z",
  "updatedAt": "2024-07-05T06:15:30.000Z"
}
```
