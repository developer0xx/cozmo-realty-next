ec2 ubuntu
sudo su
apt update
apt install nodejs -y
apt install npm -y
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
node -v //check v14
sudo apt-get install nginx -y
sudo systemctl start nginx
sudo systemctl status nginx  
sudo systemctl enable nginx
sudo vi /etc/nginx/sites-available/default

---

server {
listen 80;
server_name apis.cozmorealty.com www.apis.cozmorealty.com;

location / {
proxy_pass http://172.31.1.236:5000;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
proxy_cache_bypass \$http_upgrade;
}
}

---

sudo systemctl restart nginx

git clone https://github.com/cozmous/cozmo-realty-next.git realty
sudo npm install -g pm2
sudo npm install

# SSL

https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx

#

server {
listen 80;
server_name apis.cozmorealty.com www.api.cozmorealty.com;
return 301 https://$host$request_uri;
}

server {
listen 443 ssl;

server_name apis.cozmorealty.com www.api.cozmorealty.com;
ssl_certificate /etc/letsencrypt/live/apis.cozmorealty.com/fullchain.pem; # managed by Certbot
ssl_certificate_key /etc/letsencrypt/live/apis.cozmorealty.com/privkey.pem; # managed by Certbot

    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';

location / {
proxy_pass http://172.31.1.236:5000;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
proxy_cache_bypass \$http_upgrade;
}
}

# original

server {
server_name apis.cozmorealty.com www.apis.cozmorealty.com;

location / {
proxy_pass http://172.31.1.236:5000;
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
proxy_cache_bypass \$http_upgrade;
}

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/apis.cozmorealty.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/apis.cozmorealty.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
if ($host = apis.cozmorealty.com) {
        return 301 https://$host\$request_uri;
} # managed by Certbot

listen 80;
server_name apis.cozmorealty.com www.apis.cozmorealty.com;
return 404; # managed by Certbot

}

# .env

NODE_ENV=production
PORT=5000
CLIENT_URL=https://dev.cozmorealty.com
DATABASE_CLOUD=mongodb+srv://cozmorealty:vCNXWzK6LsMMHNcd@cluster0.qetcd.mongodb.net/cozmorealty?retryWrites=true&w=majority
DATABASE_LOCAL=mongodb+srv://cozmorealty:vCNXWzK6LsMMHNcd@cluster0.qetcd.mongodb.net/cozmorealty?retryWrites=true&w=majority
