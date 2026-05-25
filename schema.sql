-- ============================================================
--  AR-RISALAH ACADEMY — PostgreSQL Database Schema
--  Run this file on Railway PostgreSQL to set up all tables
--  Railway: https://railway.app → Add PostgreSQL → Run this SQL
-- ============================================================

-- ── STUDENTS TABLE ──
CREATE TABLE IF NOT EXISTS students (
  id            SERIAL PRIMARY KEY,
  adm_no        VARCHAR(20) UNIQUE NOT NULL,
  full_name     VARCHAR(150) NOT NULL,
  gender        VARCHAR(10),
  class         VARCHAR(20),
  dob           DATE,
  parent_name   VARCHAR(150),
  phone         VARCHAR(20),
  address       TEXT,
  religion      VARCHAR(30),
  nationality   VARCHAR(50) DEFAULT 'Nigerian',
  state_of_origin VARCHAR(50),
  email         VARCHAR(100),
  passport_url  TEXT,
  adm_date      DATE DEFAULT CURRENT_DATE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- ── RESULTS TABLE ──
CREATE TABLE IF NOT EXISTS results (
  id                  SERIAL PRIMARY KEY,
  adm_no              VARCHAR(20) NOT NULL,
  student_name        VARCHAR(150),
  class               VARCHAR(20),
  session             VARCHAR(15),
  term                VARCHAR(20),
  subjects            JSONB,
  behaviour           JSONB,
  psychomotor         JSONB,
  attendance_opened   INTEGER DEFAULT 0,
  attendance_present  INTEGER DEFAULT 0,
  position            INTEGER DEFAULT 1,
  total_pupils        INTEGER DEFAULT 30,
  teacher_comment     TEXT,
  head_comment        TEXT,
  class_teacher       VARCHAR(100),
  head_teacher        VARCHAR(100),
  term1_avg           DECIMAL(5,2),
  term2_avg           DECIMAL(5,2),
  term3_avg           DECIMAL(5,2),
  average             DECIMAL(5,2),
  promotion_status    VARCHAR(30),
  grading_system      VARCHAR(10) DEFAULT '30_70',
  serial              VARCHAR(60) UNIQUE,
  created_at          TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (adm_no) REFERENCES students(adm_no) ON DELETE CASCADE
);

-- ── FEES TABLE ──
CREATE TABLE IF NOT EXISTS fees (
  id              SERIAL PRIMARY KEY,
  adm_no          VARCHAR(20),
  amount          DECIMAL(10,2) NOT NULL,
  term            VARCHAR(20),
  session         VARCHAR(15),
  payment_method  VARCHAR(30) DEFAULT 'Cash',
  payment_date    DATE DEFAULT CURRENT_DATE,
  receipt_no      VARCHAR(30) UNIQUE,
  notes           TEXT,
  created_at      TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (adm_no) REFERENCES students(adm_no) ON DELETE CASCADE
);

-- ── TEACHERS TABLE ──
CREATE TABLE IF NOT EXISTS teachers (
  id              SERIAL PRIMARY KEY,
  full_name       VARCHAR(150) NOT NULL,
  subject         VARCHAR(200),
  class_assigned  VARCHAR(50),
  phone           VARCHAR(20),
  email           VARCHAR(100),
  status          VARCHAR(20) DEFAULT 'Active',
  username        VARCHAR(50) UNIQUE,
  password_hash   VARCHAR(200),
  created_at      TIMESTAMP DEFAULT NOW()
);

-- ── ATTENDANCE TABLE ──
CREATE TABLE IF NOT EXISTS attendance (
  id        SERIAL PRIMARY KEY,
  adm_no    VARCHAR(20),
  class     VARCHAR(20),
  date      DATE NOT NULL,
  present   BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(adm_no, date),
  FOREIGN KEY (adm_no) REFERENCES students(adm_no) ON DELETE CASCADE
);

-- ── MEDIA TABLE ──
CREATE TABLE IF NOT EXISTS media (
  id            SERIAL PRIMARY KEY,
  caption       VARCHAR(300),
  type          VARCHAR(50),
  url           TEXT,
  youtube_url   TEXT,
  category      VARCHAR(50),
  featured      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ── NOTIFICATIONS TABLE ──
CREATE TABLE IF NOT EXISTS notifications (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(200),
  message     TEXT,
  send_to     VARCHAR(50),
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ── CONTACT MESSAGES TABLE ──
CREATE TABLE IF NOT EXISTS contact_messages (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(150),
  phone       VARCHAR(20),
  email       VARCHAR(100),
  subject     VARCHAR(200),
  message     TEXT,
  read        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ── TESTIMONIES TABLE ──
CREATE TABLE IF NOT EXISTS testimonies (
  id          SERIAL PRIMARY KEY,
  parent_name VARCHAR(150),
  class       VARCHAR(20),
  message     TEXT,
  rating      INTEGER DEFAULT 5,
  approved    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);

-- ── ADMIN USERS TABLE ──
CREATE TABLE IF NOT EXISTS admin_users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(200) NOT NULL,
  full_name     VARCHAR(150),
  role          VARCHAR(30) DEFAULT 'admin',
  last_login    TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ── INDEXES FOR PERFORMANCE ──
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class);
CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);
CREATE INDEX IF NOT EXISTS idx_results_adm_no ON results(adm_no);
CREATE INDEX IF NOT EXISTS idx_results_session ON results(session, term);
CREATE INDEX IF NOT EXISTS idx_results_serial ON results(serial);
CREATE INDEX IF NOT EXISTS idx_fees_adm_no ON fees(adm_no);
CREATE INDEX IF NOT EXISTS idx_attendance_adm_no ON attendance(adm_no);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- ── SEED DEFAULT ADMIN USER ──
-- Password: admin123 (change immediately after first login!)
INSERT INTO admin_users (username, password_hash, full_name, role)
VALUES ('admin', '$2b$10$placeholder_change_this', 'Administrator', 'super_admin')
ON CONFLICT (username) DO NOTHING;

-- ── SEED DEMO STUDENTS ──
INSERT INTO students (adm_no, full_name, gender, class, dob, parent_name, phone, religion, nationality, adm_date)
VALUES
  ('ARA/2025/001', 'Ahmad Yusuf Bello', 'Male', 'Basic 4', '2014-03-15', 'Alhaji Yusuf Bello', '08012345678', 'Islam', 'Nigerian', '2023-09-01'),
  ('ARA/2025/002', 'Maryam Abdullahi Sanni', 'Female', 'Basic 4', '2014-07-22', 'Mrs. Abdullahi Sanni', '08023456789', 'Islam', 'Nigerian', '2023-09-01'),
  ('ARA/2025/003', 'Usman Ibrahim Dada', 'Male', 'Nursery 2', '2019-11-05', 'Mr. Ibrahim Dada', '08034567890', 'Islam', 'Nigerian', '2024-01-10'),
  ('ARA/2025/004', 'Fatimah Olawale', 'Female', 'Basic 1', '2017-04-18', 'Mrs. Olawale', '08045678901', 'Islam', 'Nigerian', '2024-01-10'),
  ('ARA/2025/005', 'Khalid Musa Sanni', 'Male', 'Basic 5', '2013-09-30', 'Malam Musa Sanni', '08056789012', 'Islam', 'Nigerian', '2022-09-01')
ON CONFLICT (adm_no) DO NOTHING;

-- ── SEED TEACHERS ──
INSERT INTO teachers (full_name, subject, class_assigned, phone, status)
VALUES
  ('Ustaz Muhammad Adebayo', 'Islamic Studies, Arabic, Quran', 'Basic 4, Basic 5', '08011223344', 'Active'),
  ('Mrs. Khadijah Olatunji', 'English Studies, Handwriting, Literature', 'Basic 3, Basic 4', '08022334455', 'Active'),
  ('Mr. Tunde Abiodun', 'Mathematics, Basic Science, Mental Sum', 'Basic 5, Basic 6', '08033445566', 'Active'),
  ('Ustazah Aminat Balogun', 'Nursery Class Teacher, Islamic Studies', 'Nursery 1, Nursery 2', '08044556677', 'Active')
ON CONFLICT DO NOTHING;

-- ── SEED NOTIFICATIONS ──
INSERT INTO notifications (title, message, send_to)
VALUES
  ('Welcome to 2025/2026 Session', 'Dear Parents, welcome to a new academic session. School resumes Monday.', 'All Parents'),
  ('Fee Payment Reminder', 'Kindly ensure all outstanding fees are paid before the end of the first month.', 'All Parents'),
  ('Result Published', 'First term results are now available. Please check the student portal.', 'All Students')
ON CONFLICT DO NOTHING;

-- Done! Database is ready.
SELECT 'AR-Risalah Academy database setup complete!' as status;
