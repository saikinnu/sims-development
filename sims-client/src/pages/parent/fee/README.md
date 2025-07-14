# FeeModule - Backend Integration

## Overview
The FeeModule has been fully integrated with the backend APIs to provide real-time fee data and payment processing for parents.

## Authentication
- Uses centralized axios configuration with automatic token handling
- Supports both `localStorage.getItem('token')` and `localStorage.getItem('authToken')`
- Automatic token injection in request headers
- Handles 401 errors by redirecting to login page

## API Endpoints

### 1. Parent Profile & Children
- **Endpoint**: `GET /api/parents/me`
- **Purpose**: Fetch parent profile with linked students
- **Authentication**: Required (Bearer token)
- **Response**: Parent data with `linkedStudents` array

### 2. Student Fee Data
- **Endpoint**: `GET /api/fees/student/:studentId`
- **Purpose**: Fetch fee records for a specific student
- **Authentication**: Required (Bearer token)
- **Response**: Array of fee records with term-wise breakdown

### 3. Bank Details
- **Endpoint**: `GET /api/bank`
- **Purpose**: Fetch bank account information and QR codes
- **Authentication**: Required (Bearer token)
- **Response**: Array of bank details

### 4. Payment Submission
- **Endpoint**: `POST /api/fees/:studentId/pay-term`
- **Purpose**: Submit payment for a specific term
- **Authentication**: Required (Bearer token)
- **Body**: 
  ```json
  {
    "term": "first|second|third",
    "amount_paid": 5000,
    "payment_date": "2024-01-15",
    "payment_method": "Google Pay",
    "transaction_id": "TXN123456789"
  }
  ```

## Features

### 🔐 Authentication
- Automatic token handling via axios interceptors
- Graceful error handling for expired/invalid tokens
- Redirect to login on authentication failure

### 📊 Real-time Data
- Live fee data from backend
- Dynamic child selection
- Real bank account details
- Payment status updates

### 💳 Payment Processing
- Simulated payment gateway integration
- Backend payment recording
- Transaction ID generation
- Payment status updates

### 🎨 User Experience
- Loading states for all API calls
- Error handling with retry options
- Responsive design
- Empty state handling

## Error Handling

### Network Errors
- Automatic retry mechanism
- User-friendly error messages
- Fallback to login page

### Authentication Errors
- Token validation
- Automatic logout on 401
- Redirect to login

### Data Errors
- Graceful degradation
- Partial data loading
- Error boundaries

## Usage

```jsx
import FeeModule from './pages/parent/fee/FeeModule';

// The component automatically:
// 1. Checks authentication
// 2. Loads parent profile
// 3. Fetches children data
// 4. Loads fee information
// 5. Handles payments
```

## Dependencies
- `axios` - HTTP client
- `lucide-react` - Icons
- `react-icons` - Additional icons
- `html2canvas` & `jspdf` - PDF generation (for receipts)

## Configuration
The module uses the centralized axios configuration from `src/utils/axiosConfig.js` which provides:
- Base URL configuration
- Automatic token injection
- Error interceptors
- Request/response logging 