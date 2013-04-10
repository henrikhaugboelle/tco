#!/bin/sh

sudo update-rc.d -f tco remove
echo "Copying File"
sudo cp ./tco /etc/init.d
echo "Changing permissions"
sudo chmod 755 /etc/init.d/tco
sudo update-rc.d tco defaults
