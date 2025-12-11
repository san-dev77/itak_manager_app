# Grade Freeze System

The Grade Freeze System provides comprehensive functionality to manage grade freeze periods, preventing grade modifications during critical periods such as report card generation, academic reviews, or administrative processes.

## Features

### Core Functionality
- **Flexible Scope Management**: Support for school-wide, term-specific, and class-specific freeze periods
- **Status Lifecycle**: Complete workflow from scheduled → active → completed/cancelled
- **Emergency Override**: Secure password-protected emergency access during freeze periods
- **Overlap Prevention**: Automatic validation to prevent conflicting freeze periods
- **Automatic Activation**: Scheduled periods automatically activate and complete based on dates

### Security Features
- **Password Hashing**: Override passwords are securely hashed using bcrypt
- **Access Control**: Role-based approval system for freeze period management
- **Audit Trail**: Complete tracking of who created, approved, or cancelled freeze periods

## API Endpoints

### Create Freeze Period
```http
POST /grade-freeze
```

**Request Body:**
```json
{
  "schoolYearId": "uuid",
  "termId": "uuid", // Optional for term-specific
  "classId": "uuid", // Optional for class-specific
  "title": "End of Term Grade Freeze",
  "description": "Freeze period for final grade calculations",
  "scope": "term_specific", // school_wide | term_specific | class_specific
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-01-20T23:59:59Z",
  "createdBy": "uuid",
  "allowEmergencyOverride": true,
  "overridePassword": "emergency123"
}
```

### Get Freeze Periods
```http
GET /grade-freeze?schoolYearId=uuid&status=active&scope=school_wide
```

### Check Freeze Status
```http
GET /grade-freeze/check/status?schoolYearId=uuid&termId=uuid&classId=uuid
```

**Response:**
```json
{
  "isFrozen": true,
  "freezePeriod": {
    "id": "uuid",
    "title": "End of Term Grade Freeze",
    "scope": "term_specific",
    "status": "active",
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-01-20T23:59:59Z"
  },
  "canOverride": true
}
```

### Approve Freeze Period
```http
POST /grade-freeze/:id/approve
```

**Request Body:**
```json
{
  "approvedBy": "uuid"
}
```

### Cancel Freeze Period
```http
POST /grade-freeze/:id/cancel
```

**Request Body:**
```json
{
  "cancelledBy": "uuid",
  "reason": "Administrative decision to allow grade corrections"
}
```

### Verify Override Password
```http
POST /grade-freeze/:id/verify-override
```

**Request Body:**
```json
{
  "password": "emergency123"
}
```

**Response:**
```json
{
  "isValid": true
}
```

### Update Freeze Period
```http
PUT /grade-freeze/:id
```

### Delete Freeze Period
```http
DELETE /grade-freeze/:id
```

### System Maintenance
```http
POST /grade-freeze/activate-scheduled
POST /grade-freeze/complete-expired
```

## Database Schema

### GradeFreezePeriod Entity
```sql
CREATE TABLE grade_freeze_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_year_id UUID NOT NULL REFERENCES school_years(id),
  term_id UUID REFERENCES terms(id),
  class_id UUID REFERENCES classes(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  scope freeze_scope_enum NOT NULL DEFAULT 'school_wide',
  status freeze_status_enum NOT NULL DEFAULT 'scheduled',
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  cancelled_by UUID REFERENCES users(id),
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,
  allow_emergency_override BOOLEAN NOT NULL DEFAULT false,
  override_password VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT chk_end_date_after_start CHECK (end_date > start_date)
);
```

### Enums
```sql
CREATE TYPE freeze_scope_enum AS ENUM('school_wide', 'term_specific', 'class_specific');
CREATE TYPE freeze_status_enum AS ENUM('scheduled', 'active', 'completed', 'cancelled');
```

## Usage Examples

### Creating a School-Wide Freeze
```typescript
const freezePeriod = await gradeFreezeService.createFreezePeriod(
  schoolYearId,
  'Annual Report Generation',
  'System-wide freeze for annual report processing',
  FreezeScope.SCHOOL_WIDE,
  new Date('2024-06-01'),
  new Date('2024-06-07'),
  adminUserId,
  undefined, // no termId for school-wide
  undefined, // no classId for school-wide
  true, // allow emergency override
  'emergency2024'
);
```

### Checking if Grades are Frozen
```typescript
const status = await gradeFreezeService.isGradeFrozen(
  schoolYearId,
  termId,
  classId
);

if (status.isFrozen) {
  if (status.canOverride && await verifyOverridePassword(password)) {
    // Allow grade modification with override
  } else {
    throw new BadRequestException('Grades are currently frozen');
  }
}
```

### Automatic Activation (Scheduled Task)
```typescript
// Run this as a cron job or scheduled task
const activatedPeriods = await gradeFreezeService.activateScheduledPeriods();
const completedPeriods = await gradeFreezeService.completeExpiredPeriods();
```

## Business Rules

### Scope Hierarchy
1. **Class-specific** freezes take precedence over term-specific
2. **Term-specific** freezes take precedence over school-wide
3. **School-wide** freezes apply to all terms and classes

### Overlap Prevention
- Prevents overlapping freeze periods within the same scope
- Validates date ranges against existing active/scheduled periods
- Allows different scopes to have overlapping dates

### Status Transitions
```
scheduled → active → completed
scheduled → cancelled
active → cancelled (with reason)
```

### Emergency Override
- Only available if `allowEmergencyOverride` is true
- Password is hashed and stored securely
- Override access is logged for audit purposes

## Integration Points

### Grade Modification Endpoints
Before allowing any grade modifications, check freeze status:

```typescript
@Put('assessment-results/:id')
async updateAssessmentResult(@Param('id') id: string, @Body() dto: UpdateDto) {
  // Check if grades are frozen
  const freezeStatus = await this.gradeFreezeService.isGradeFrozen(
    dto.schoolYearId,
    dto.termId,
    dto.classId
  );
  
  if (freezeStatus.isFrozen && !overrideProvided) {
    throw new BadRequestException('Grades are currently frozen');
  }
  
  // Proceed with grade modification
}
```

### Scheduled Tasks
Set up cron jobs to automatically manage freeze periods:

```typescript
@Cron('0 0 * * *') // Daily at midnight
async handleScheduledFreezePeriods() {
  await this.gradeFreezeService.activateScheduledPeriods();
  await this.gradeFreezeService.completeExpiredPeriods();
}
```

## Error Handling

### Common Errors
- **Overlapping periods**: Prevents creation of conflicting freeze periods
- **Invalid scope**: Validates required termId/classId based on scope
- **Invalid dates**: Ensures end date is after start date
- **Unauthorized access**: Validates user permissions for operations
- **Invalid override**: Handles incorrect emergency passwords

### Error Responses
```json
{
  "statusCode": 400,
  "message": "Overlapping freeze period found: End of Term Grade Freeze",
  "error": "Bad Request"
}
```

## Performance Considerations

### Database Indexes
- Optimized queries with indexes on frequently searched fields
- Composite indexes for date range queries
- Foreign key indexes for join operations

### Caching Strategy
- Consider caching active freeze periods for frequently accessed data
- Implement cache invalidation on freeze period status changes

## Security Considerations

### Password Security
- Override passwords are hashed using bcrypt with salt rounds
- Passwords are never returned in API responses
- Consider implementing password complexity requirements

### Access Control
- Implement role-based permissions for freeze period management
- Audit all freeze period operations
- Restrict emergency override usage to authorized personnel

## Monitoring and Alerts

### Recommended Monitoring
- Track freeze period activations and completions
- Monitor emergency override usage
- Alert on failed automatic activations
- Track overlap prevention triggers

### Metrics to Track
- Number of active freeze periods
- Emergency override usage frequency
- Average freeze period duration
- Failed grade modification attempts during freeze
