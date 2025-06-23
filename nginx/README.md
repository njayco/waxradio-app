# Nginx Configuration

This directory contains Nginx configuration files for deploying the WaxRadio application in production environments.

## 📁 Structure

```
nginx/
├── nginx.conf           # Main Nginx configuration
├── sites-available/     # Available site configurations
├── sites-enabled/       # Enabled site configurations
└── ssl/                 # SSL certificates and keys
```

## 🚀 Deployment Configuration

### Production Setup
The Nginx configuration is optimized for:
- **Performance**: Gzip compression, caching, and optimization
- **Security**: SSL/TLS, security headers, and access controls
- **Scalability**: Load balancing and proxy configurations
- **Monitoring**: Logging and error handling

### Key Features
- **SSL/TLS Termination**: Secure HTTPS connections
- **Static File Serving**: Optimized delivery of static assets
- **API Proxying**: Reverse proxy to backend services
- **Caching**: Browser and server-side caching strategies
- **Compression**: Gzip compression for faster loading

## 🔧 Configuration Files

### Main Configuration (`nginx.conf`)
```nginx
# Global settings
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Events module
events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

# HTTP module
http {
    # Basic settings
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript;
    
    # Include site configurations
    include /etc/nginx/sites-enabled/*;
}
```

### Site Configuration
```nginx
server {
    listen 80;
    server_name waxradio.com www.waxradio.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name waxradio.com www.waxradio.com;
    
    # SSL configuration
    ssl_certificate /etc/nginx/ssl/waxradio.crt;
    ssl_certificate_key /etc/nginx/ssl/waxradio.key;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Root directory
    root /var/www/waxradio-app;
    index index.html;
    
    # Static file handling
    location /_next/static/ {
        alias /var/www/waxradio-app/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Main application
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔒 Security Configuration

### SSL/TLS Setup
- **Certificate**: Use Let's Encrypt or commercial certificates
- **Protocols**: TLS 1.2 and 1.3 only
- **Ciphers**: Strong cipher suites
- **HSTS**: HTTP Strict Transport Security

### Security Headers
```nginx
# Security headers
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
```

### Access Controls
```nginx
# Deny access to sensitive files
location ~ /\. {
    deny all;
}

location ~ /\.ht {
    deny all;
}
```

## 📊 Performance Optimization

### Caching Strategy
```nginx
# Browser caching for static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# API caching
location /api/ {
    proxy_cache_valid 200 1m;
    proxy_cache_valid 404 1m;
    add_header X-Cache-Status $upstream_cache_status;
}
```

### Compression
```nginx
# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied any;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/json
    application/javascript
    application/xml+rss
    application/atom+xml
    image/svg+xml;
```

## 🔍 Monitoring and Logging

### Log Configuration
```nginx
# Access logs
access_log /var/log/nginx/access.log combined;

# Error logs
error_log /var/log/nginx/error.log warn;

# Custom log format
log_format detailed '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" '
                    '$request_time $upstream_response_time';
```

### Health Checks
```nginx
# Health check endpoint
location /health {
    access_log off;
    return 200 "healthy\n";
    add_header Content-Type text/plain;
}
```

## 🚀 Deployment Steps

### 1. Install Nginx
```bash
sudo apt update
sudo apt install nginx
```

### 2. Configure SSL
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d waxradio.com -d www.waxradio.com
```

### 3. Deploy Application
```bash
# Build the application
npm run build

# Copy files to server
sudo cp -r .next /var/www/waxradio-app/
sudo cp -r public /var/www/waxradio-app/
```

### 4. Start Services
```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Start application
npm start
```

## 🔧 Maintenance

### Regular Tasks
- **SSL Renewal**: Set up automatic renewal with Certbot
- **Log Rotation**: Configure logrotate for Nginx logs
- **Security Updates**: Keep Nginx and SSL certificates updated
- **Performance Monitoring**: Monitor access logs and error rates

### Troubleshooting
- **Configuration Test**: `sudo nginx -t`
- **Check Logs**: `sudo tail -f /var/log/nginx/error.log`
- **Check Status**: `sudo systemctl status nginx`
- **Reload Config**: `sudo systemctl reload nginx` 