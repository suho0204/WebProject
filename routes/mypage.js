const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// DB 연결
const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

// 로그인 확인 미들웨어 (필요시 분리해서 사용)
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/user/login');
}

// 마이페이지 메인
router.get('/', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;

    // 1) 사용자 정보 조회
    db.get('SELECT id, name FROM users WHERE id = ?', [userId], (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).send('사용자 정보를 불러오는 중 오류가 발생했습니다.');
        }
        if (!user) {
            return res.status(404).send('사용자를 찾을 수 없습니다.');
        }

        // 2) 위시리스트 상품 조회 (예: user_wishlist 테이블에 user_id, product_id 컬럼이 있다고 가정)
        const sql = `
      SELECT p.id, p.name, p.price, p.image_url
      FROM products p
      JOIN wishlist uw ON p.id = uw.product_id
      WHERE uw.user_id = ?
    `;

        db.all(sql, [userId], (err, wishlist) => {
            if (err) {
                console.error(err);
                return res.status(500).send('위시리스트 정보를 불러오는 중 오류가 발생했습니다.');
            }

            // 페이지 렌더링
            res.render('mypage', {
                user,
                wishlist
            });
        });
    });
});

// 위시리스트에 상품 추가 (POST)
router.post('/wishlist/add', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;
    const { productId } = req.body;

    const insertSql = 'INSERT OR IGNORE INTO user_wishlist (user_id, product_id) VALUES (?, ?)';
    db.run(insertSql, [userId, productId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('위시리스트 추가 중 오류가 발생했습니다.');
        }
        res.redirect('/mypage');
    });
});

// 위시리스트에서 상품 삭제 (POST)
router.post('/wishlist/remove', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;
    const { productId } = req.body;

    const deleteSql = 'DELETE FROM user_wishlist WHERE user_id = ? AND product_id = ?';
    db.run(deleteSql, [userId, productId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('위시리스트 삭제 중 오류가 발생했습니다.');
        }
        res.redirect('/mypage');
    });
});

module.exports = router;
