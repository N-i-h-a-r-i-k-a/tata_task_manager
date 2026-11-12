# TATA AMRAVATI TASK TRACKER
# SOFTWARE TESTING REPORT

## 1. Introduction

This document describes the testing performed on the Tata Amravati Task Tracker application to verify its functionality, reliability and security.

## 2. Functional Testing

| Test ID | Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| TC01 | User Registration | User account should be created | Account created successfully | PASS |
| TC02 | User Login | Valid credentials should allow login | Login successful | PASS |
| TC03 | Add Task | New task should be added | Task added successfully | PASS |
| TC04 | Update Task | Existing task should be updated | Task updated successfully | PASS |
| TC05 | Delete Task | Selected task should be deleted | Task deleted successfully | PASS |
| TC06 | Search Task | Matching tasks should be displayed | Search working correctly | PASS |
| TC07 | Status Filter | Tasks should be filtered by status | Filtering working correctly | PASS |
| TC08 | Dashboard Statistics | Task counts should be displayed correctly | Verified during testing | PASS |
| TC09 | Logout | User session should be terminated | Logout successful | PASS |

## 3. Security Testing

| Test ID | Security Test | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| ST01 | Access API without login | HTTP 401 Unauthorized | Login required message displayed | PASS |
| ST02 | Invalid or missing CSRF token | HTTP 403 Forbidden | Security token rejection message displayed | PASS |
| ST03 | Access another user's tasks | Other user's tasks should not be visible | User data isolation verified | PASS |
| ST04 | Access task APIs after logout | HTTP 401 Unauthorized | Login required message displayed | PASS |

## 4. Bugs Identified and Fixed

### Bug 1: CSRF Token Not Returned Correctly
**Problem:** Frontend JavaScript could not retrieve the CSRF token.

**Solution:** Updated the JavaScript response handling to read the token from the nested `data` object returned by PHP.

### Bug 2: Update Task Functionality
**Problem:** The update operation returned an unexpected JSON response error.

**Solution:** Implemented the missing `update_task.php` backend functionality with input validation, session authentication, CSRF verification and user ownership checks.

### Bug 3: Email Validation
**Problem:** Incorrect regular expression caused email validation issues.

**Solution:** Corrected the JavaScript email validation regular expression.

## 5. Overall Testing Result

The core functionality of the application was tested manually.

The registration, login, task CRUD operations, search, filtering, user data isolation, CSRF protection and session authentication tests passed.

## 6. Conclusion

The Tata Amravati Task Tracker successfully implements the main task management requirements. Functional and security testing was performed to verify the application's core features and access restrictions.

**Testing Method:** Manual Testing

**Final Result:** Core test cases passed.
