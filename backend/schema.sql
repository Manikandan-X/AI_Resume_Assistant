SET SQL_SAFE_UPDATES = 0;
USE ai_resume_assistant;
SHOW CREATE TABLE jobs;
SHOW TABLES;
DESCRIBE users;
DESCRIBE candidates;
SELECT * FROM evaluation_history;
ALTER TABLE candidates
MODIFY COLUMN skills JSON;

ALTER TABLE candidates
ADD COLUMN resume_filename VARCHAR(255) AFTER resume_file;

ALTER TABLE candidates
ADD COLUMN resume_file_type VARCHAR(10) AFTER resume_filename;

SHOW CREATE TABLE candidates;

ALTER TABLE candidates
ADD COLUMN experience_years INT NOT NULL DEFAULT 0;

CREATE TABLE jobs (

    id INT PRIMARY KEY AUTO_INCREMENT,

    job_title VARCHAR(150) NOT NULL,

    required_skills JSON NOT NULL,

    experience_requirement INT NOT NULL DEFAULT 0,

    location VARCHAR(100) NOT NULL,

    employment_type VARCHAR(50) NOT NULL,

    job_description TEXT NOT NULL,

    created_by INT NOT NULL,

    created_at DATETIME,

    updated_at DATETIME,

    FOREIGN KEY(created_by)
    REFERENCES users(id)

);

SELECT id, created_at, updated_at
FROM jobs;

SHOW CREATE TABLE ai_matches;
ALTER TABLE jobs
MODIFY COLUMN created_at DATETIME NOT NULL
DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE jobs
MODIFY COLUMN updated_at DATETIME NOT NULL
DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP;

UPDATE jobs
SET
    created_at = NOW(),
    updated_at = NOW()
WHERE
    created_at IS NULL
    OR updated_at IS NULL;