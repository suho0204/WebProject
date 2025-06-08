const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 데이터베이스 연결
const dbPath = path.join(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath);

// 로그인 여부 확인 미들웨어
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/user/login');
}

// ==============================
// 장바구니 페이지 렌더링
// ==============================
router.get('/', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;

    const sql = `
        SELECT p.id AS product_id, p.name, p.price, p.image_url, c.quantity
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
    `;

    db.all(sql, [userId], (err, items) => {
        if (err) {
            console.error(err);
            return res.status(500).send('장바구니 정보를 불러오는 중 오류가 발생했습니다.');
        }

        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        res.render('cart', { items, total });
    });
});

// ==============================
// 장바구니에 상품 추가
// ==============================
router.post('/add', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;
    const { productId, quantity } = req.body;

    const sql = `
        INSERT INTO cart (user_id, product_id, quantity)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, product_id)
        DO UPDATE SET quantity = quantity + excluded.quantity;
    `;

    db.run(sql, [userId, productId, quantity || 1], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('장바구니 추가 중 오류가 발생했습니다.');
        }
        res.redirect('/cart');
    });
});

// ==============================
// 장바구니에서 상품 제거
// ==============================
router.post('/remove', isAuthenticated, (req, res) => {
    const userId = req.session.user.id;
    const { productId } = req.body;

    const sql = 'DELETE FROM cart WHERE user_id = ? AND product_id = ?';

    db.run(sql, [userId, productId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('장바구니에서 상품 제거 중 오류가 발생했습니다.');
        }
        res.redirect('/cart');
    });
});

module.exports = router;
