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

-- 상품 카테고리 테이블
CREATE TABLE IF NOT EXISTS categories (
                                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                                          name TEXT NOT NULL UNIQUE,
                                          description TEXT
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
('닌텐도 스위치 OLED', '가정용&휴대용 콘솔 게임기', 459000, 20, 'switch_oled.jpg'),

-- 의류
('나이키 에어포스 1', '클래식 화이트 스니커즈', 129000, 50, 'nike_airforce1.jpg'),
('아디다스 트레이닝 셋업', '스포티한 트레이닝복', 99000, 40, 'adidas_set.jpg'),
('무신사 스탠다드 반팔티', '편안한 데일리 티셔츠', 19000, 100, 'musinsa_tshirt.jpg'),
('노스페이스 고어텍스 자켓', '방수 기능성 아웃도어 자켓', 289000, 15, 'northface_jacket.jpg'),

-- 생활용품
('샤오미 무선 청소기', '강력한 흡입력의 무선 청소기', 199000, 25, 'xiaomi_vacuum.jpg'),
('브리타 정수기 필터', '깨끗한 물을 위한 필터', 29000, 60, 'brita_filter.jpg'),
('삼성 공기청정기', '미세먼지 제거 공기청정기', 349000, 10, 'samsung_air.jpg'),

-- 식품
('스타벅스 하우스 블렌드 원두', '풍부한 향의 커피 원두 250g', 15900, 80, 'starbucks_beans.jpg'),
('오뚜기 진라면 매운맛 (5입)', '국민 라면 세트', 3980, 200, 'jin_ramen.jpg'),
('정관장 홍삼정 에브리타임', '간편한 건강 홍삼 스틱', 39900, 50, 'red_ginseng.jpg'),

-- 기타
('로지텍 MX 마스터 3', '생산성을 위한 무선 마우스', 129000, 20, 'logitech_mx3.jpg'),
('샤오미 스마트 워치', '헬스 트래킹 스마트워치', 79000, 30, 'xiaomi_watch.jpg'),
('탐앤탐스 텀블러', '스테인리스 보온 텀블러 500ml', 15900, 70, 'toms_tumbler.jpg'),
('제닉스 아레나 데스크', '게이밍 전용 책상', 159000, 5, 'xenics_desk.jpg'),
('무드등 캔들 워머', '분위기 있는 인테리어 조명', 24900, 35, 'candle_warmer.jpg');

INSERT INTO notices (title, content, created_at) VALUES ('서버 점검 안내', '내일 오전 2시부터 4시까지 서버 점검이 있습니다.', datetime('now'));
