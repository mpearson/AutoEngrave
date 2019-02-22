sudo git reset --hard
sudo git pull

sudo chown -R www-data:www-data server
sudo chmod -R 700 server

sudo chown -R www-data:www-data client
sudo chmod -R 700 client
