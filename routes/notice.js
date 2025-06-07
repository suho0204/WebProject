const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const isAuthenticated = require('../middlewares/auth');

const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);
//로그인 체크
router.use(isAuthenticated);

// 공지사항 리스트
router.get('/', (req, res) => {
    db.all('SELECT * FROM notices ORDER BY created_at DESC', (err, notices) => {
        if (err) {
            console.error(err);
            return res.send('공지사항을 불러오는 데 실패했습니다.');
        }
        res.render('notice', { notices });
    });
});

// 공지사항 상세 페이지
router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM notices WHERE id = ?', [id], (err, notice) => {
        if (err) {
            console.error(err);
            return res.send('공지사항을 불러오는 데 실패했습니다.');
        }
        if (!notice) {
            return res.status(404).send('공지사항을 찾을 수 없습니다.');
        }
        res.render('notice_detail', { notice });
    });
});

module.exports = router;
