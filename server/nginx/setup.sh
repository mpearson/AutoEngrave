# setup uWSGI
pipenv install uwsgi
sudo mkdir -p /run/uwsgi
sudo chown www-data:www-data /run/uwsgi
sudo cp autoengrave.service /etc/systemd/system
sudo systemctl enable autoengrave
sudo systemctl start autoengrave

# setup nginx
sudo rm -f /etc/nginx/sites-enabled/default
sudo cp nginx.conf /etc/nginx/sites-available/autoengrave
sudo ln -sf /etc/nginx/sites-available/autoengrave /etc/nginx/sites-enabled/autoengrave
