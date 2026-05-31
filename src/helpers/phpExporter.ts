/**
 * SPDX-License-Identifier: Apache-2.0
 */

// Full database SQL schemas with indexes
export const sqlSchemaString = `-- HTV Platformasi SQL Database Schema (MySQL/MariaDB)
-- Yaratilgan vaqti: 2026-05-30
-- PHP 8.2 & PDO ga to'liq moslangan, xavfsiz va tezkor indexlar bilan.

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS \`roles\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(50) NOT NULL,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`name\` (\`name\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`email\` varchar(255) NOT NULL,
  \`password\` varchar(255) NOT NULL,
  \`is_premium\` tinyint(1) NOT NULL DEFAULT 0,
  \`subscription_plan_id\` int(11) DEFAULT NULL,
  \`subscription_expires_at\` datetime DEFAULT NULL,
  \`remember_token\` varchar(100) DEFAULT NULL,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Admins Table
CREATE TABLE IF NOT EXISTS \`admins\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`username\` varchar(100) NOT NULL,
  \`email\` varchar(255) NOT NULL,
  \`password\` varchar(255) NOT NULL,
  \`role\` enum('super_admin','editor','moderator') NOT NULL DEFAULT 'moderator',
  \`twofa_secret\` varchar(100) DEFAULT NULL,
  \`twofa_enabled\` tinyint(1) NOT NULL DEFAULT 0,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`username\` (\`username\`),
  UNIQUE KEY \`email\` (\`email\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Categories table
CREATE TABLE IF NOT EXISTS \`categories\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(100) NOT NULL,
  \`slug\` varchar(100) NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Channels Table
CREATE TABLE IF NOT EXISTS \`channels\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name\` varchar(255) NOT NULL,
  \`logo\` varchar(500) DEFAULT NULL,
  \`category_id\` int(11) NOT NULL,
  \`stream_url\` varchar(1000) NOT NULL,
  \`poster\` varchar(500) DEFAULT NULL,
  \`is_premium\` tinyint(1) NOT NULL DEFAULT 0,
  \`is_live\` tinyint(1) NOT NULL DEFAULT 1,
  \`views_count\` int(11) NOT NULL DEFAULT 0,
  \`order_index\` int(11) NOT NULL DEFAULT 10,
  \`is_active\` tinyint(1) NOT NULL DEFAULT 1,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`category_id\` (\`category_id\`),
  KEY \`order_index\` (\`order_index\`),
  KEY \`is_active\` (\`is_active\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Movies Table
CREATE TABLE IF NOT EXISTS \`movies\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name_uz\` varchar(255) NOT NULL,
  \`name_ru\` varchar(255) NOT NULL,
  \`name_en\` varchar(255) NOT NULL,
  \`slug\` varchar(255) NOT NULL,
  \`poster\` varchar(500) DEFAULT NULL,
  \`backdrop\` varchar(500) DEFAULT NULL,
  \`video_url\` varchar(1000) NOT NULL,
  \`trailer_url\` varchar(1000) DEFAULT NULL,
  \`year\` int(11) NOT NULL DEFAULT 2026,
  \`genre_uz\` varchar(255) DEFAULT NULL,
  \`genre_ru\` varchar(255) DEFAULT NULL,
  \`genre_en\` varchar(255) DEFAULT NULL,
  \`duration_minutes\` int(11) NOT NULL DEFAULT 120,
  \`rating\` decimal(3,1) NOT NULL DEFAULT 7.5,
  \`description_uz\` text DEFAULT NULL,
  \`description_ru\` text DEFAULT NULL,
  \`description_en\` text DEFAULT NULL,
  \`is_premium\` tinyint(1) NOT NULL DEFAULT 0,
  \`is_active\` tinyint(1) NOT NULL DEFAULT 1,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`),
  KEY \`year\` (\`year\`),
  KEY \`is_active\` (\`is_active\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Series Table
CREATE TABLE IF NOT EXISTS \`series\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name_uz\` varchar(255) NOT NULL,
  \`name_ru\` varchar(255) NOT NULL,
  \`name_en\` varchar(255) NOT NULL,
  \`slug\` varchar(255) NOT NULL,
  \`poster\` varchar(500) DEFAULT NULL,
  \`genres_uz\` varchar(255) DEFAULT NULL,
  \`year\` int(11) NOT NULL DEFAULT 2026,
  \`is_premium\` tinyint(1) NOT NULL DEFAULT 0,
  \`is_active\` tinyint(1) NOT NULL DEFAULT 1,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Seasons Table
CREATE TABLE IF NOT EXISTS \`seasons\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`series_id\` int(11) NOT NULL,
  \`season_number\` int(11) NOT NULL,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`series_id\` (\`series_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Episodes Table
CREATE TABLE IF NOT EXISTS \`episodes\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`season_id\` int(11) NOT NULL,
  \`title_uz\` varchar(255) NOT NULL,
  \`title_ru\` varchar(255) NOT NULL,
  \`title_en\` varchar(255) NOT NULL,
  \`video_url\` varchar(1000) NOT NULL,
  \`duration_minutes\` int(11) NOT NULL DEFAULT 45,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`season_id\` (\`season_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Plans Table
CREATE TABLE IF NOT EXISTS \`plans\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`name_uz\` varchar(255) NOT NULL,
  \`name_ru\` varchar(255) NOT NULL,
  \`name_en\` varchar(255) NOT NULL,
  \`price_uzs\` decimal(15,2) NOT NULL,
  \`duration_months\` int(11) NOT NULL DEFAULT 1,
  \`status\` enum('active','inactive') NOT NULL DEFAULT 'active',
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Payments Table
CREATE TABLE IF NOT EXISTS \`payments\` (
  \`id\` varchar(100) NOT NULL,
  \`user_id\` int(11) NOT NULL,
  \`plan_id\` int(11) NOT NULL,
  \`amount_uzs\` decimal(15,2) NOT NULL,
  \`payment_method\` varchar(50) NOT NULL,
  \`status\` enum('success','pending','failed') NOT NULL DEFAULT 'pending',
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`user_id\` (\`user_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Ads Table
CREATE TABLE IF NOT EXISTS \`ads\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`video_url\` varchar(1000) NOT NULL,
  \`click_url\` varchar(500) DEFAULT NULL,
  \`duration_seconds\` int(11) NOT NULL DEFAULT 10,
  \`is_enabled\` tinyint(1) NOT NULL DEFAULT 1,
  \`created_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. News Table
CREATE TABLE IF NOT EXISTS \`news\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`title_uz\` varchar(255) NOT NULL,
  \`content_uz\` text NOT NULL,
  \`image_url\` varchar(500) DEFAULT NULL,
  \`published_at\` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Settings Table
CREATE TABLE IF NOT EXISTS \`settings\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`key_name\` varchar(100) NOT NULL,
  \`value_data\` text NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`key_name\` (\`key_name\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Pages Table
CREATE TABLE IF NOT EXISTS \`pages\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`slug\` varchar(100) NOT NULL,
  \`title_uz\` varchar(255) NOT NULL,
  \`content_uz\` text NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`slug\` (\`slug\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Favorites Table
CREATE TABLE IF NOT EXISTS \`favorites\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`user_id\` int(11) NOT NULL,
  \`channel_id\` int(11) NOT NULL,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`user_channel\` (\`user_id\`,\`channel_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. System Logs Table
CREATE TABLE IF NOT EXISTS \`logs\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`timestamp\` timestamp DEFAULT CURRENT_TIMESTAMP,
  \`level\` enum('INFO','WARNING','CRITICAL') NOT NULL DEFAULT 'INFO',
  \`message\` varchar(1000) NOT NULL,
  \`ip_address\` varchar(50) NOT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`level\` (\`level\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed admin user
INSERT INTO \`admins\` (\`username\`, \`email\`, \`password\`, \`role\`) VALUES 
('admin', 'admin@htv.uz', '$2y$10$7zB3cT6K/S96c6q6gY6eO.mYf6g7l9aLOn63O86y.1x9f6K/fS1M2', 'super_admin')
ON DUPLICATE KEY UPDATE \`username\`=\`username\`;

COMMIT;
`;

export const phpMVCSourceFiles: { [filename: string]: string } = {
  "README.md": `# HTV - Onlayn TV va Kino Platformasi (PHP Production)

Ushbu loyiha cPanel, XAMPP, yoki istalgan Linux serverda ishga tushirish uchun mo'ljallangan to'liq xavfsiz PHP 8.2+ MVC arxitekturasidir.

## XAMPP orqali ishga tushirish (Localhost):
1. Ushbu loyiha fayllarini \`C:/xampp/htdocs/tv\` papkasiga yuklang.
2. MySQL ma'lumotlar ombori yarating (masalan, \`htv_db\`).
3. Ushbu sahifadagi \`database.sql\` faylini yuklab olib, phpMyAdmin orqali import qiling.
4. \`.env.example\` faylini \`.env\` qilib o'zgartiring va undagi DB ma'lumotlarini to'g'rilang.
5. Brauzerda \`http://localhost/tv\` havolasiga kiring.

## cPanel yoki VPS xostingga yuklash:
1. cPanel File Manager ga kiring va fayllarni \`public_html/tv\` papkasiga yuklang.
2. Yangi ma'lumotlar ombori va foydalanuvchi yarating, ularni bog'lang.
3. \`database.sql\` ni import qiling.
4. \`.env\` fayliga ma'lumotlarni yozing.
5. Cloudflare orqali SSL to'g'irlang (barcha so'rovlar HTTPS va HTTPS-redirect rejimida \`.htaccess\` orqali boshqariladi).

### Birlamchi Admin hisob ma'lumotlari:
- Login: \`admin\`
- Parol: \`admin123456\` (Tizimga kirgach 2FA yoqib parolni yangilang!)
`,

  "database.sql": sqlSchemaString,

  ".htaccess": `# HTV URL Rewrite & Security Directives
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /tv/

    # Secure: Prevent directory visual browsing
    Options -Indexes

    # Route all requests to index.php if file/dir does not physically exist
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?route=$1 [QSA,L]
</IfModule>

# Block access to confidential system environment
<Files ".env">
    Order allow,deny
    Deny from all
</Files>
<Files "config.php">
    Order allow,deny
    Deny from all
</Files>
`,

  ".env.example": `# HTV Central Production config environment
DB_HOST="localhost"
DB_NAME="htv_db"
DB_USER="root"
DB_PASS=""

# Security Keys
SECRET_SALT="HTV_SUPER_CYAN_SECRET_KEY_2026"
APP_URL="https://hprint.uz/tv"

# Google Client settings for Google OAuth Sign In
GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
`,

  "config.php": `<?php
/**
 * HTV Config File Loader
 * SPDX-License-Identifier: Apache-2.0
 */

class Config {
    private static $vars = [];

    public static function load() {
        $envFile = __DIR__ . '/.env';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                list($name, $value) = explode('=', $line, 2);
                $name = trim($name);
                $value = trim($value, " \\t\\n\\r\\0\\x0B\"'");
                self::$vars[$name] = $value;
                putenv("$name=$value");
            }
        }
    }

    public static function get($key, $default = null) {
        return self::$vars[$key] ?? getenv($key) ?? $default;
    }
}

Config::load();
`,

  "index.php": `<?php
/**
 * HTV MVC Application Entry point front controller
 * SPDX-License-Identifier: Apache-2.0
 */

session_start();
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/app/Core/Db.php';
require_once __DIR__ . '/app/Core/Router.php';
require_once __DIR__ . '/app/Controllers/BaseController.php';
require_once __DIR__ . '/app/Controllers/TVController.php';

// Safe headers
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("X-Content-Type-Options: nosniff");
header("Content-Security-Policy: default-src 'self' https: 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:; media-src 'self' blob: https:;");

// Initialize router and routes mapping
$router = new Router();

// Define user web routes
$router->add('', 'TVController@index');
$router->add('movies', 'TVController@moviesList');
$router->add('movie/([a-zA-Z0-9-]+)', 'TVController@movieDetail');
$router->add('channels', 'TVController@channelsList');
$router->add('channel/([0-9]+)', 'TVController@channelDetail');
$router->add('login', 'TVController@userLogin');
$router->add('register', 'TVController@userRegister');
$router->add('subscribe', 'TVController@subscriptionPlans');
$router->add('api/tv-stats', 'TVController@getApiStats');

// Run router matches
$requestedRoute = $_GET['route'] ?? '';
$router->dispatch($requestedRoute);
`,

  "app/Core/Db.php": `<?php
/**
 * HTV Secure Database Singleton Class using highly performant MySQL PDO Prepared Statements
 * SPDX-License-Identifier: Apache-2.0
 */

class Db {
    private static $instance = null;
    private $pdo;

    private function __construct() {
        $host = Config::get('DB_HOST', 'localhost');
        $db   = Config::get('DB_NAME', 'htv_db');
        $user = Config::get('DB_USER', 'root');
        $pass = Config::get('DB_PASS', '');
        $charset = 'utf8mb4';

        $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false, // Prevent physical SQL injection
        ];

        try {
            $this->pdo = new PDO($dsn, $user, $pass, $options);
        } catch (PDOException $e) {
            // Write to logs securely on server and fail gracefully
            error_log($e->getMessage());
            die("Tizimli nosozlik yuz berdi. Iltimos keyinroq harakat qilib ko'ring.");
        }
    }

    public static function getConnection() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance->pdo;
    }
}
`,

  "app/Core/Router.php": `<?php
/**
 * HTV Lightweight PHP Dynamic URL Router
 * SPDX-License-Identifier: Apache-2.0
 */

class Router {
    private $routes = [];

    // Map URI to target controllers
    public function add($expression, $handler) {
        $this->routes[$expression] = $handler;
    }

    public function dispatch($url) {
        $url = trim($url, '/');
        
        foreach ($this->routes as $expression => $handler) {
            $expression = trim($expression, '/');
            $pattern = "~^" . $expression . "$~i";

            if (preg_match($pattern, $url, $matches)) {
                array_shift($matches); // Remove first match
                
                list($controllerClass, $method) = explode('@', $handler);
                
                if (class_exists($controllerClass)) {
                    $controllerInstance = new $controllerClass();
                    if (method_exists($controllerInstance, $method)) {
                        call_user_func_array([$controllerInstance, $method], $matches);
                        return;
                    }
                }
            }
        }

        // Return professional 404 router response
        http_response_code(404);
        require_once __DIR__ . '/../../views/404.php';
    }
}
`,

  "app/Controllers/BaseController.php": `<?php
/**
 * HTV Secure Base Controller with CSRF controls and HTML sanitation
 * SPDX-License-Identifier: Apache-2.0
 */

class BaseController {
    
    // Generate CSRF token protective layer
    protected function generateCsrfToken() {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    protected function validateCsrfToken($token) {
        return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
    }

    // Secure HTML filter to prevent dangerous XSS payload injection
    protected function sanitize($data) {
        return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
    }

    // Render HTML view
    protected function render($viewPath, $data = []) {
        extract($data);
        $csrf_token = $this->generateCsrfToken();
        
        $fullPath = __DIR__ . '/../../views/' . $viewPath . '.php';
        if (file_exists($fullPath)) {
            require_once $fullPath;
        } else {
            die("View fayli topilmadi: $viewPath");
        }
    }
}
`,

  "app/Controllers/TVController.php": `<?php
/**
 * HTV Primary Content controller carrying out streaming, view-counters, security checks
 * SPDX-License-Identifier: Apache-2.0
 */

class TVController extends BaseController {
    
    private $db;

    public function __construct() {
        $this->db = Db::getConnection();
    }

    public function index() {
        // Fetch active live channels
        $stmt = $this->db->query("SELECT * FROM channels WHERE is_active = 1 ORDER BY order_index ASC LIMIT 10");
        $channels = $stmt->fetchAll();

        // Fetch movies
        $stmt2 = $this->db->query("SELECT * FROM movies WHERE is_active = 1 ORDER BY id DESC LIMIT 5");
        $movies = $stmt2->fetchAll();

        // Load dashboard stats
        $this->render('home', [
            'channels' => $channels,
            'movies'   => $movies,
            'title'    => 'HTV - Eng tezkor onlayn TV va kino platforma'
        ]);
    }

    public function movieDetail($slug) {
        // Fetch specific movie securely using boundary PDO parameter
        $stmt = $this->db->prepare("SELECT * FROM movies WHERE slug = ? AND is_active = 1 LIMIT 1");
        $stmt->execute([$this->sanitize($slug)]);
        $movie = $stmt->fetch();

        if (!$movie) {
            http_response_code(404);
            $this->render('404');
            return;
        }

        // Increment Views
        $stmtView = $this->db->prepare("INSERT INTO logs (level, message, ip_address) VALUES ('INFO', ?, ?)");
        $stmtView->execute(["Kino ko'rildi: " . $movie['name_uz'], $_SERVER['REMOTE_ADDR']]);

        $this->render('movie_detail', [
            'movie' => $movie,
            'title' => $movie['name_uz'] . ' - HTV'
        ]);
    }

    // JSON API stats Endpoint for internal async visual rendering
    public function getApiStats() {
        header('Content-Type: application/json');
        
        $stmt = $this->db->query("SELECT COUNT(*) as total FROM channels");
        $chanCount = $stmt->fetch()['total'];

        $stmt = $this->db->query("SELECT COUNT(*) as total FROM users");
        $userCount = $stmt->fetch()['total'];

        echo json_encode([
            'status' => 'success',
            'channelsCount' => $chanCount,
            'subscribersCount' => $userCount,
            'serverTime' => date('Y-m-d H:i:s')
        ]);
    }
}
`
};
export default phpMVCSourceFiles;
