# Tata Amravati Task Tracker

## 1. Project Overview

Tata Amravati Task Tracker is a web-based task management application developed using HTML, CSS, JavaScript, PHP and MySQL.

The application allows users to register, log in and manage their personal tasks through an interactive dashboard.

## 2. Technologies Used

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Core PHP

**Database**
- MySQL

**Development Tools**
- Visual Studio Code
- PHP Built-in Development Server
- MySQL Server

## 3. Project Features

- User registration and login.
- Secure password hashing using PHP.
- Session-based authentication.
- CSRF protection.
- Add new tasks.
- Edit and update existing tasks.
- Delete tasks.
- Search tasks by title.
- Filter tasks by status.
- Task statuses: Pending, In Progress and Completed.
- Dashboard task statistics.
- User-specific task management.
- Light and dark theme support (if implemented).

## 4. Project Folder Structure

text
TATA_AMRAVATI_TASK_TRACKER/
│
├── backend/
│   ├── api/
│   │   ├── add_task.php
│   │   ├── auth_check.php
│   │   ├── delete_task.php
│   │   ├── get_tasks.php
│   │   └── update_task.php
│   │
│   ├── auth/
│   │   ├── csrf.php
│   │   ├── login.php
│   │   ├── logout.php
│   │   └── register.php
│   │
│   └── config/
│       ├── bootstrap.php
│       └── database.php
│
├── database/
│   └── task_tracker.sql
│
├── frontend/
│   ├── pages/
│   ├── css/
│   └── js/
│
└── README.md


## 5. Installation and Setup

### Requirements

- PHP 8 or later
- MySQL Server
- Visual Studio Code or another code editor
- Modern web browser

### Step 1: Clone or Download the Project

Download the project and open the main project folder in Visual Studio Code.

### Step 2: Configure the Database

Open MySQL and execute:

```sql
SOURCE C:/path/to/TATA_AMRAVATI_TASK_TRACKER/database/task_tracker.sql;
```

Replace the example path with the actual location of your SQL file.

### Step 3: Configure Database Connection

Open:

`backend/config/database.php`

Update the database credentials:

```php
$host = "localhost";
$dbname = "task_tracker";
$username = "root";
$password = "YOUR_MYSQL_PASSWORD";# i have used my password here neha@0304
```

Use your actual MySQL password.

### Step 4: Start the PHP Server

Open the VS Code terminal in the project root folder and execute:

```bash
php -S localhost:8000
```

Keep the terminal running.

### Step 5: Open the Application

Open this URL in your browser:

http://localhost:8000/frontend/pages/index.html

Register a new account and log in to access the task dashboard.

## 6. Database Structure

The application uses a MySQL database named `task_tracker`.

### Users Table

Stores user account information.

- id
- name
- email
- password
- created_at

### Tasks Table

Stores tasks created by registered users.

- id
- user_id
- title
- description
- status
- created_at
- updated_at

Each task is associated with its owner through `user_id`.

## 7. Security Features

- Passwords are stored using password hashing.
- Password verification is handled securely.
- Prepared statements are used for database operations.
- Session-based authentication protects backend APIs.
- CSRF tokens protect state-changing requests.
- Users can access only their own tasks.
- Input validation is performed on the frontend and backend.

## 8. Testing

The following functionality has been tested:

| Test | Result |
|---|---|
| User Registration | Passed |
| User Login | Passed |
| Add Task | Passed |
| Update Task | Passed |
| Delete Task | Passed |
| Search Tasks | Passed |
| Status Filtering | Passed |
| User Data Isolation | Passed |
| CSRF Protection | Passed |
| Unauthorized API Access | Passed |

## 9. Backup and Restore

To back up the database:

```bash
mysqldump -u root -p task_tracker > task_tracker_backup.sql
```

To restore the database:

```bash
mysql -u root -p task_tracker < task_tracker_backup.sql
```

Enter your MySQL password when prompted.

## 10. Limitations and Future Enhancements

Possible future improvements include:

- Task due dates and reminders.
- Task priority levels.
- Pagination for large task lists.
- Email notifications.
- Exporting task reports.
- Improved dashboard analytics.


## 11. Project Status

The core task management functionality and security tests have been implemented and tested successfully.

**Project:** Tata Amravati Task Tracker

**Database:** MySQL

**Backend:** Core PHP

**Frontend:** HTML, CSS and JavaScript
