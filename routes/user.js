const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

// 회원가입 페이지
router.get('/register', (req, res) => {
    res.render('register');
});

// 회원가입 처리
router.post('/register', async (req, res) => {
    const { username, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
        'INSERT INTO users (username, password, name) VALUES (?, ?, ?)',
        [username, hashedPassword, name],
        (err) => {
            if (err) {
                console.error(err.message);
                return res.send('회원가입 실패: 이미 존재하는 사용자일 수 있습니다.');
            }
            res.redirect('/user/login');
        }
    );
});

// 로그인 페이지
router.get('/login', (req, res) => {
    res.render('login');
});

// 로그인 처리
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            console.error(err);
            return res.send('로그인 중 오류가 발생했습니다.');
        }
        if (!user) {
            return res.send('존재하지 않는 사용자입니다.');
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            // 보안상 필요한 정보만 세션에 저장
            req.session.user = {
                id: user.id,
                username: user.username,
                name: user.name
            };
            res.redirect('/');
        } else {
            res.send('비밀번호가 일치하지 않습니다.');
        }
    });
});

// 로그아웃
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('세션 삭제 중 오류:', err);
            return res.status(500).send('로그아웃 중 문제가 발생했습니다.');
        }
        res.redirect('/');
    });
});

module.exports = router;
