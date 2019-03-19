# setup uWSGI
pipenv install uwsgi
sudo cp autoengrave.service /etc/systemd/system
sudo chmod 700 /etc/systemd/system/autoengrave.service
sudo chown root /etc/systemd/system/autoengrave.service
sudo systemctl enable autoengrave
sudo systemctl start autoengrave
sudo mkdir logs

# setup nginx
sudo rm -f /etc/nginx/sites-enabled/default
sudo cp nginx.conf /etc/nginx/sites-available/autoengrave
sudo ln -sf /etc/nginx/sites-available/autoengrave /etc/nginx/sites-enabled/autoengrave
