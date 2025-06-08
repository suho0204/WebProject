const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// DB 연결
const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

// 로그인 확인 미들웨어
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/user/login');
}

// 마이페이지 메인
router.get('/', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;

    db.get('SELECT id, name FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).send('사용자 정보를 불러오는 중 오류가 발생했습니다.');
        }
        if (!user) {
            return res.status(404).send('사용자를 찾을 수 없습니다.');
        }

        // 위시리스트 일부 항목 미리 조회 (미리보기용)
        const sql = `
            SELECT p.id, p.name, p.price, p.image_url
            FROM products p
            JOIN wishlist w ON p.id = w.product_id
            WHERE w.user_id = ?
        `;
        db.all(sql, [userId], (err, wishlist) => {
            if (err) {
                console.error(err);
                return res.status(500).send('위시리스트 정보를 불러오는 중 오류가 발생했습니다.');
            }

            res.render('mypage', { user, wishlist });
        });
    });
});

// 위시리스트 전용 페이지
router.get('/wishlist', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;

    const sql = `
        SELECT p.id, p.name, p.price, p.image_url, p.description
        FROM products p
        JOIN wishlist w ON p.id = w.product_id
        WHERE w.user_id = ?
    `;
    db.all(sql, [userId], (err, products) => {
        if (err) {
            console.error(err);
            return res.status(500).send('위시리스트를 불러오는 중 오류가 발생했습니다.');
        }

        res.render('wishlist', { products });
    });
});

// 위시리스트에 상품 추가
router.post('/wishlist/add', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;
    const { productId } = req.body;

    const insertSql = 'INSERT OR IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)';
    db.run(insertSql, [userId, productId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('위시리스트 추가 중 오류가 발생했습니다.');
        }
        res.redirect('/mypage');
    });
});

// 위시리스트에서 상품 삭제
router.post('/wishlist/remove', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;
    const { productId } = req.body;

    const deleteSql = 'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?';
    db.run(deleteSql, [userId, productId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('위시리스트 삭제 중 오류가 발생했습니다.');
        }
        res.redirect('/mypage/wishlist');
    });
});

module.exports = router;
