/**
 * AR-RISALAH ACADEMY — Backend Server
 * Express.js + PostgreSQL API
 * Deploy on Railway: https://railway.app
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// ── DATABASE CONNECTION (Railway PostgreSQL) ──
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// ── MIDDLEWARE ──
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// ── DB HEALTH CHECK ──
pool.connect((err, client, release) => {
  if (err) {
    console.error('⚠️  Database connection error:', err.message);
  } else {
    console.log('✅ PostgreSQL connected successfully');
    release();
  }
});

// ══════════════════════════════════════════
// ── STUDENTS API ──
// ══════════════════════════════════════════

// GET all students
app.get('/api/students', async (req, res) => {
  try {
    const { class: cls, gender, search } = req.query;
    let query = 'SELECT * FROM students WHERE 1=1';
    const params = [];
    let i = 1;
    if (cls) { query += ` AND class = $${i++}`; params.push(cls); }
    if (gender) { query += ` AND gender = $${i++}`; params.push(gender); }
    if (search) { query += ` AND (LOWER(full_name) LIKE $${i} OR adm_no LIKE $${i})`; params.push(`%${search.toLowerCase()}%`); i++; }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows, count: result.rowCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single student
app.get('/api/students/:admNo', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students WHERE adm_no = $1', [req.params.admNo]);
    if (!result.rows.length) return res.status(404).json({ success: false, error: 'Student not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST create student (admission)
app.post('/api/students', async (req, res) => {
  try {
    const { full_name, gender, class: cls, dob, parent_name, phone, address, religion, nationality, state_of_origin, email, passport_url } = req.body;
    if (!full_name || !phone) return res.status(400).json({ success: false, error: 'Name and phone are required' });

    // Generate admission number
    const countResult = await pool.query('SELECT COUNT(*) FROM students');
    const count = parseInt(countResult.rows[0].count) + 1;
    const year = new Date().getFullYear();
    const adm_no = `ARA/${year}/${String(count).padStart(3, '0')}`;

    const result = await pool.query(
      `INSERT INTO students (adm_no, full_name, gender, class, dob, parent_name, phone, address, religion, nationality, state_of_origin, email, passport_url, adm_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW())
       RETURNING *`,
      [adm_no, full_name, gender, cls, dob, parent_name, phone, address, religion, nationality, state_of_origin, email, passport_url]
    );
    res.status(201).json({ success: true, data: result.rows[0], admNo: adm_no });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT update student
app.put('/api/students/:admNo', async (req, res) => {
  try {
    const { full_name, gender, class: cls, dob, parent_name, phone, address, religion } = req.body;
    const result = await pool.query(
      `UPDATE students SET full_name=$1, gender=$2, class=$3, dob=$4, parent_name=$5, phone=$6, address=$7, religion=$8, updated_at=NOW()
       WHERE adm_no=$9 RETURNING *`,
      [full_name, gender, cls, dob, parent_name, phone, address, religion, req.params.admNo]
    );
    if (!result.rows.length) return res.status(404).json({ success: false, error: 'Student not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE student
app.delete('/api/students/:admNo', async (req, res) => {
  try {
    await pool.query('DELETE FROM students WHERE adm_no = $1', [req.params.admNo]);
    res.json({ success: true, message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ══════════════════════════════════════════
// ── RESULTS API ──
// ══════════════════════════════════════════

// GET results
app.get('/api/results', async (req, res) => {
  try {
    const { adm_no, class: cls, session, term } = req.query;
    let query = 'SELECT * FROM results WHERE 1=1';
    const params = [];
    let i = 1;
    if (adm_no) { query += ` AND adm_no = $${i++}`; params.push(adm_no); }
    if (cls) { query += ` AND class = $${i++}`; params.push(cls); }
    if (session) { query += ` AND session = $${i++}`; params.push(session); }
    if (term) { query += ` AND term = $${i++}`; params.push(term); }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST save result
app.post('/api/results', async (req, res) => {
  try {
    const { adm_no, student_name, class: cls, session, term, subjects, behaviour, psychomotor,
      attendance_opened, attendance_present, position, total_pupils,
      teacher_comment, head_comment, class_teacher, head_teacher,
      term1_avg, term2_avg, term3_avg, grading_system, serial } = req.body;

    const scores = JSON.stringify(subjects);
    const beh = JSON.stringify(behaviour);
    const psy = JSON.stringify(psychomotor);
    const totals = subjects.map(s => s.tot);
    const avg = +(totals.reduce((a,b)=>a+b,0)/totals.length).toFixed(1);
    const promotion_status = avg >= 50 ? 'PROMOTED' : avg >= 40 ? 'CONDITIONAL PROMOTION' : 'REPEAT CLASS';

    const result = await pool.query(
      `INSERT INTO results (adm_no, student_name, class, session, term, subjects, behaviour, psychomotor,
        attendance_opened, attendance_present, position, total_pupils, teacher_comment, head_comment,
        class_teacher, head_teacher, term1_avg, term2_avg, term3_avg, average, promotion_status,
        grading_system, serial, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,NOW())
       RETURNING *`,
      [adm_no, student_name, cls, session, term, scores, beh, psy,
        attendance_opened, attendance_present, position, total_pupils,
        teacher_comment, head_comment, class_teacher, head_teacher,
        term1_avg, term2_avg, term3_avg, avg, promotion_status,
        grading_system, serial]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET verify result by serial
app.get('/api/results/verify/:serial', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM results WHERE serial = $1', [req.params.serial]);
    if (!result.rows.length) return res.status(404).json({ success: false, verified: false, message: 'Result not found' });
    res.json({ success: true, verified: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ══════════════════════════════════════════
// ── FEES API ──
// ══════════════════════════════════════════

app.get('/api/fees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM fees ORDER BY payment_date DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/fees', async (req, res) => {
  try {
    const { adm_no, amount, term, session, payment_method, payment_date } = req.body;
    const receipt_no = 'RCP/' + Date.now();
    const result = await pool.query(
      `INSERT INTO fees (adm_no, amount, term, session, payment_method, payment_date, receipt_no, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING *`,
      [adm_no, amount, term, session, payment_method, payment_date || new Date(), receipt_no]
    );
    res.status(201).json({ success: true, data: result.rows[0], receipt_no });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ══════════════════════════════════════════
// ── TEACHERS API ──
// ══════════════════════════════════════════

app.get('/api/teachers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teachers ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teachers', async (req, res) => {
  try {
    const { full_name, subject, class_assigned, phone, email } = req.body;
    const result = await pool.query(
      `INSERT INTO teachers (full_name, subject, class_assigned, phone, email, status, created_at)
       VALUES ($1,$2,$3,$4,$5,'Active',NOW()) RETURNING *`,
      [full_name, subject, class_assigned, phone, email]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ══════════════════════════════════════════
// ── MEDIA API ──
// ══════════════════════════════════════════

app.get('/api/media', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM media ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/media', async (req, res) => {
  try {
    const { caption, type, url, youtube_url, category } = req.body;
    const result = await pool.query(
      `INSERT INTO media (caption, type, url, youtube_url, category, created_at)
       VALUES ($1,$2,$3,$4,$5,NOW()) RETURNING *`,
      [caption, type, url, youtube_url, category]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ══════════════════════════════════════════
// ── NOTIFICATIONS API ──
// ══════════════════════════════════════════

app.get('/api/notifications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/notifications', async (req, res) => {
  try {
    const { title, message, send_to } = req.body;
    const result = await pool.query(
      `INSERT INTO notifications (title, message, send_to, created_at) VALUES ($1,$2,$3,NOW()) RETURNING *`,
      [title, message, send_to]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── CONTACT FORM ──
app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    await pool.query(
      `INSERT INTO contact_messages (name, phone, email, subject, message, created_at) VALUES ($1,$2,$3,$4,$5,NOW())`,
      [name, phone, email, subject, message]
    );
    res.json({ success: true, message: 'Message received. We will respond within 24 hours.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── ATTENDANCE API ──
app.post('/api/attendance', async (req, res) => {
  try {
    const { class: cls, date, records } = req.body;
    for (const r of records) {
      await pool.query(
        `INSERT INTO attendance (adm_no, class, date, present, created_at)
         VALUES ($1,$2,$3,$4,NOW()) ON CONFLICT (adm_no, date) DO UPDATE SET present=$4`,
        [r.adm_no, cls, date, r.present]
      );
    }
    res.json({ success: true, message: 'Attendance saved' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── ANALYTICS ──
app.get('/api/analytics', async (req, res) => {
  try {
    const [students, results, fees] = await Promise.all([
      pool.query('SELECT COUNT(*) as total, class, COUNT(*) as count FROM students GROUP BY class'),
      pool.query('SELECT COUNT(*) as total, promotion_status, COUNT(*) as count FROM results GROUP BY promotion_status'),
      pool.query('SELECT SUM(amount) as total_collected FROM fees'),
    ]);
    res.json({
      success: true,
      students: students.rows,
      results: results.rows,
      total_fees: fees.rows[0]?.total_collected || 0
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── SPA FALLBACK ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ── START SERVER ──
app.listen(PORT, () => {
  console.log(`🚀 AR-Risalah Academy server running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
});

module.exports = app;
