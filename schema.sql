-- 회원 테이블
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL ,
    password TEXT NOT NULL ,
    name TEXT NOT NULL
);

-- 게시글 테이블 (문의글 통합)
CREATE TABLE IF NOT EXISTS posts(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_id INTEGER, --NULL이면 원글, 아니면 답글
    author TEXT,
    creater_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- 공지사항 테이블
CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL
);


-- 파일 업로드 정보 테이블 (공지사항 첨부 파일용)
CREATE TABLE IF NOT EXISTS files(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    filename TEXT NOT NULL,
    filepath TEXT NOT NULL,
    FOREIGN KEY(post_id) REFERENCES posts(id)
);


-- 상품 테이블
CREATE TABLE IF NOT EXISTS products (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        name TEXT NOT NULL,
                                        description TEXT,
                                        price REAL NOT NULL,
                                        stock INTEGER NOT NULL DEFAULT 0,
                                        category_id INTEGER,
                                        image_url TEXT,
                                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 상품 이미지 다중 저장 (옵션)
CREATE TABLE IF NOT EXISTS product_images (
                                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              product_id INTEGER NOT NULL,
                                              image_url TEXT NOT NULL,
                                              FOREIGN KEY (product_id) REFERENCES products(id)
);
-- 장바구니 테이블
CREATE TABLE IF NOT EXISTS cart (
                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                    user_id INTEGER NOT NULL,
                                    product_id INTEGER NOT NULL,
                                    quantity INTEGER NOT NULL DEFAULT 1,
                                    UNIQUE(user_id, product_id)
);

-- 주문 테이블
CREATE TABLE IF NOT EXISTS orders (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      user_id INTEGER NOT NULL,
                                      total_price REAL NOT NULL,
                                      status TEXT DEFAULT '처리중', -- 처리중, 배송중, 완료 등
                                      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                      FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 주문 상세 테이블
CREATE TABLE IF NOT EXISTS order_items (
                                           id INTEGER PRIMARY KEY AUTOINCREMENT,
                                           order_id INTEGER NOT NULL,
                                           product_id INTEGER NOT NULL,
                                           quantity INTEGER NOT NULL,
                                           price REAL NOT NULL,
                                           FOREIGN KEY (order_id) REFERENCES orders(id),
                                           FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 리뷰 테이블
CREATE TABLE IF NOT EXISTS reviews (
                                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                                       user_id INTEGER NOT NULL,
                                       product_id INTEGER NOT NULL,
                                       rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                                       comment TEXT,
                                       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                                       FOREIGN KEY (user_id) REFERENCES users(id),
                                       FOREIGN KEY (product_id) REFERENCES products(id)
);
CREATE TABLE IF NOT EXISTS wishlist (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        user_id INTEGER NOT NULL,
                                        product_id INTEGER NOT NULL,
                                        added_at TEXT DEFAULT (datetime('now')),
                                        UNIQUE(user_id, product_id),
                                        FOREIGN KEY(user_id) REFERENCES users(id),
                                        FOREIGN KEY(product_id) REFERENCES products(id)
);

INSERT INTO products (name, description, price, stock, image_url) VALUES
-- 전자제품
('아이폰 15 Pro', '애플의 최신 스마트폰', 1540000, 30, 'iphone15pro.jpg'),
('갤럭시 Z 플립 5', '삼성 폴더블 스마트폰', 1390000, 25, 'galaxy_zflip5.jpg'),
('에어팟 맥스', '프리미엄 무선 헤드폰', 799000, 10, 'airpods_max.jpg'),
('LG OLED TV 55인치', '최고 화질의 OLED 스마트 TV', 1890000, 5, 'lg_oled_tv.jpg'),
('닌텐도 스위치 OLED', '가정용&휴대용 콘솔 게임기', 459000, 20, 'switch_oled.jpg');

INSERT INTO notices (title, content, created_at) VALUES ('서버 점검 안내', '내일 오전 2시부터 4시까지 서버 점검이 있습니다.', datetime('now'));
