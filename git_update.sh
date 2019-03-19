sudo systemctl stop autoengrave.service

sudo git reset --hard
sudo git pull

sudo chown -R www-data:www-data server
sudo chmod -R 755 server

sudo chown -R www-data:www-data client
sudo chmod -R 755 client

sudo sh -c "cd client; npm run build; cd .."

sudo systemctl start autoengrave.service
