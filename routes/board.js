const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const isAuthenticated = require('../middlewares/auth');

const router = express.Router();
const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

router.use(isAuthenticated);

// 📌 게시글 목록: 원글만 가져오기 (답글 제외)
router.get('/', (req, res) => {
    db.all(
        `SELECT * FROM posts WHERE parent_id IS NULL ORDER BY id DESC`,
        [],
        (err, posts) => {
            if (err) return res.send('목록 불러오기 실패');
            res.render('board', { posts, user: req.session.user || null });
        }
    );
});

// 📌 새 글쓰기 폼
router.get('/new', (req, res) => {
    res.render('post', { post: null, parentId: null, parentTitle: null, user: req.session.user || null });
});

// 📌 새 글쓰기 처리
router.post('/new', (req, res) => {
    const { title, content, author } = req.body;
    const user = req.session.user;
    const authorName = user?.username || author || '익명';

    db.run(
        'INSERT INTO posts (title, content, parent_id, author) VALUES (?, ?, ?, ?)',
        [title, content, null, authorName],
        function (err) {
            if (err) return res.send('작성 실패');
            res.redirect('/board');
        }
    );
});

// 📌 글 상세 보기 (원글 + 답글 함께 보여줌)
router.get('/view/:id', (req, res) => {
    const postId = req.params.id;

    db.get('SELECT * FROM posts WHERE id = ?', [postId], (err, post) => {
        if (err || !post) return res.send('글을 찾을 수 없습니다.');

        db.all('SELECT * FROM posts WHERE parent_id = ? ORDER BY id ASC', [postId], (err2, replies) => {
            if (err2) return res.send('답글 불러오기 실패');

            res.render('post_detail', { post, replies, user: req.session.user || null }); // post_detail.ejs 사용
        });
    });
});

// 📌 답글 작성 폼
router.get('/reply/:id', (req, res) => {
    const parentId = req.params.id;
    db.get('SELECT title FROM posts WHERE id = ?', [parentId], (err, row) => {
        if (err || !row) return res.send('원글을 찾을 수 없습니다.');
        res.render('post', { post: null, parentId, parentTitle: row.title, user: req.session.user || null });
    });
});

// 📌 답글 작성 처리 (parent_id 명확히 숫자로 전달)
router.post('/reply/:id', (req, res) => {
    const parentId = parseInt(req.params.id);
    const { title, content, author } = req.body;
    const user = req.session.user;
    const authorName = user?.username || author || '익명';

    db.run(
        'INSERT INTO posts (title, content, parent_id, author) VALUES (?, ?, ?, ?)',
        [title, content, parentId, authorName],
        (err) => {
            if (err) return res.send('답글 작성 실패');
            res.redirect('/board/view/' + parentId);
        }
    );
});

// 📌 글 수정 폼
router.get('/edit/:id', (req, res) => {
    db.get('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, post) => {
        if (err || !post) return res.send('글을 찾을 수 없습니다.');
        res.render('post', { post, parentId: null, parentTitle: null, user: req.session.user || null });
    });
});

// 📌 글 수정 처리
router.post('/edit/:id', (req, res) => {
    const { title, content } = req.body;
    db.run(
        'UPDATE posts SET title = ?, content = ? WHERE id = ?',
        [title, content, req.params.id],
        (err) => {
            if (err) return res.send('수정 실패');
            res.redirect('/board/view/' + req.params.id);
        }
    );
});

// 📌 글 삭제
router.get('/delete/:id', (req, res) => {
    db.run('DELETE FROM posts WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.send('삭제 실패');
        res.redirect('/board');
    });
});

module.exports = router;
