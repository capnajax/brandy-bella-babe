#!/bin/bash

set -e

if [ "$1" == '-r' ]; then

    if ! [ -e /dev/pi-blaster ]; then

      if ! which autoconf >/dev/null; then
        sudo apt-get install -y autoconf
      fi

      cd ~/Downloads
      rm -rf pi-blaster
      git clone https://github.com/sarfata/pi-blaster.git
      cd pi-blaster
      sed -e 's/#define CYCLE_TIME_US	10000/#define CYCLE_TIME_US	20000/' \
        -i pi-blaster.c
      ./autogen.sh
      ./configure
      make
      sudo make install

    fi

elif [ "$1" == "-u" ]; then

    shift
   for i in $@; do
    echo
    echo $i
    echo ----------------------------------
    ssh pi@$i "cd /home/pi/Downloads/pi-blaster ; sudo make uninstall"
    ssh pi@$1 "rm -rf /home/pi/Documents/dev/brandy-bella-babe"
  done

else

  for i in $@; do
    echo
    echo $i
    echo ----------------------------------
    rsync -avz -e ssh --stats \
      --exclude=node_modules \
      --exclude=photos \
      --exclude=.git \
      . pi@$i:~/Documents/dev/brandy-bella-babe

    ssh pi@$i 'cd ~/Documents/dev/brandy-bella-babe ; ./deploy.sh -r'

  done

fi
