# Secure Document Sharing Platform

## Концепция и функционал

Платформа для безопасного обмена документами с персональными данными, где безопасность обеспечивается двухканальной передачей данных:

### Основная идея
- **Ссылка передается одним каналом** (например, email)
- **Пароль передается другим каналом** (например, SMS, мессенджер, телефон)
- **Только при наличии и ссылки, и пароля** можно получить доступ к документу
- **Владелец контролирует** возможность скачивания документа
- **Детальная аналитика** всех обращений к документам

### Ключевые возможности

#### Управление доступом
- Создание защищенных ссылок на документы
- Установка индивидуальных паролей для каждой ссылки
- Контроль времени жизни ссылки (срок действия)
- Ограничение количества просмотров
- Запрет/разрешение скачивания по решению владельца

#### Аналитика и мониторинг
- **Счетчик просмотров** в реальном времени
- **Детальные логи доступа**: кто, когда, откуда
- **IP-адреса и геолокация** посетителей
- **Время, проведен��ое на странице**
- **Попытки несанкционированного доступа**
- **User-Agent информация** (браузер, устройство)

#### Безопасность
- Невозможность скачивания без разрешения владельца
- Защита от скриншотов (по возможности)
- Watermark на документах
- Уведомления владельца о каждом обращении

## Технический стек

### Backend - Java Spring
- **Spring Boot** - основной фреймворк для быстрой разработки
- **Spring Security** с JWT токенами для аутентификации и авторизации
- **Spring Data JPA** для работы с базой данных PostgreSQL
- **REST API** для всех операций с документами и аналитикой
- **Spring Mail** для отправки уведомлений по email
- **File Storage**: AWS S3, Google Cloud Storage или локальное хранилище
- **Security**: Bcrypt для хеширования паролей, HTTPS для всех соединений

### Frontend - React
- **React.js** с современными хуками (useState, useEffect, useContext)
- **Redux Toolkit** для управления глобальным состоянием приложения
- **Material-UI** или **Ant Design** для современных UI компонентов
- **React Router** для навигации между страницами
- **Axios** для HTTP запросов к backend API
- **JWT** обработка и безопасное хранение токенов
- **Responsive design** для работы на всех устройствах

### База данных - PostgreSQL

#### Схема таблиц:
```sql
-- Пользователи системы
Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Загруженные документы
Documents (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    owner_id INTEGER REFERENCES Users(id),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    download_allowed BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Защищенные ссылки для обмена
Shared_Links (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES Documents(id),
    link_token VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP,
    max_views INTEGER DEFAULT NULL,
    current_views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Логи доступа к документам
Access_Logs (
    id SERIAL PRIMARY KEY,
    link_id INTEGER REFERENCES Shared_Links(id),
    ip_address INET NOT NULL,
    user_agent TEXT,
    country VARCHAR(100),
    city VARCHAR(100),
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action_type VARCHAR(50) NOT NULL, -- VIEW, DOWNLOAD, FAILED_PASSWORD
    success BOOLEAN DEFAULT TRUE
);

-- Аналитика по документам
Analytics (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES Documents(id),
    total_views INTEGER DEFAULT 0,
    total_downloads INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    last_accessed TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Аутентификация
```
POST /api/auth/register - регистрация нового пользователя
POST /api/auth/login - вход в систему
POST /api/auth/logout - выход из системы
GET /api/auth/me - информация о текущем пользователе
```

### Управление документами
```
POST /api/documents/upload - загрузка нового документа
GET /api/documents - список документов пользователя
GET /api/documents/{id} - информация о конкретном документе
PUT /api/documents/{id} - обновление настроек документа
DELETE /api/documents/{id} - удаление документа
```

### Создание защищенных ссылок
```
POST /api/share/create - создание защищенной ссылки
GET /api/share/{token}/info - информация о ссылке (без доступа к документу)
POST /api/share/{token}/verify - проверка пароля и получение доступа
GET /api/share/{token}/document - получение документа (после верификации)
PUT /api/share/{token}/settings - изменение настроек ссылки
DELETE /api/share/{token} - деактивация ссылки
```

### Аналитика
```
GET /api/analytics/documents/{id} - аналитика по конкретному документу
GET /api/analytics/links/{token} - статистика по защищенной ссылке
GET /api/analytics/overview - общая статистика пользователя
GET /api/analytics/export - экспорт данных в CSV/JSON
```

## Пример использования

### Сценарий: Отправка конфиденциального договора

1. **Загрузка документа**
   - Пользователь загружает PDF с договором
   - Система сохраняет файл и создает запись в БД

2. **Создание защищенной ссылки**
   - Пользователь создает ссылку с паролем "SecurePass123"
   - Система генерирует уникальный токен: `https://securedocs.com/view/abc123xyz`
   - Устанавливает срок действия: 7 дней
   - Разрешает только просмотр (скачивание запрещено)

3. **Передача данных**
   - Ссылку отправляет по email: `https://securedocs.com/view/abc123xyz`
   - Пароль отправляет по WhatsApp: "SecurePass123"

4. **Доступ получателя**
   - Получатель переходит по ссылке
   - Вводит пароль "SecurePass123"
   - Получает доступ к просмотру документа
   - Система записывает лог доступа

5. **Мониторинг владельцем**
   - Владелец видит: документ просмотрен в 14:30
   - IP: 192.168.1.100, Москва, Россия
   - Браузер: Chrome 118, Windows 10
   - Время на странице: 5 минут 30 секунд

## Дополнительные возможности

### Уведомления
- Email уведомления при каждом доступе к документу
- Telegram/Slack webhook для интеграций
- Push уведомления в браузере

### Безопасность
- Rate limiting для предотвращения брутфорса паролей
- CAPTCHA при подозрительной активности
- Автоматическая блокировка после N неудачных попыток
- Логирование всех подозрительных действий

### Интеграции
- API для внешних приложений
- Single Sign-On (SSO) через Google/Microsoft
- Интеграция с корпоративными системами

Эта платформа обеспечивает максимальную безопасность при обмене конфиденциальными документами, предоставляя владельцам полный контроль над доступом и детальную аналитику использования.