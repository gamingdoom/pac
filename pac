#!/bin/sh

args1=`echo $1 | cut -c1-2`
pacpass=`echo $* | cut -c1-1,3-`
uid=`id -u`
pkgbase=$2 

if (($uid != 0)); then
    echo "Please run with root"
    exit 2
fi

mkdir -p /tmp/pac/home/
useradd pac -d /tmp/pac/home/ > /dev/null 2>&1
chown -R pac /tmp/pac/
chmod -R 775 /tmp/pac/

case $args1 in
    -P*)
        if [[ $pacpass == - ]] 
        then
            echo "Please use a pacman argument after -P. ex -PSy"
            exit 1
        else
        pacman $pacpass
        fi
    ;;
    -A)
        #packages/pkgbase
        mkdir -p /tmp/pac/
        rm -r /tmp/pac/$2 > /dev/null 2>&1
        git clone https://aur.archlinux.org/$2.git /tmp/pac/$2 -q --progress
        chmod 777 /tmp/pac/$2
        checkdir=`ls /tmp/pac/$2`
        if [[ ! -n $checkdir ]]; then
            echo "Package base doesn't exist"
            rm -r /tmp/pac/$2
            exit 3
        fi
        cd /tmp/pac/$2
        makedepends=`cat /tmp/pac/$2/.SRCINFO | grep "makedepends = " | sed -e 's/makedepends = //g' | sed -r 's/\s+//g'`
        depends=`cat /tmp/pac/$2/.SRCINFO | grep "\<depends\>" | sed -e 's/depends = //g' | sed -r 's/\s+//g'`
        echo "Installing Make Dependencies"
        pacman -S --needed $makedepends
        echo "Installing Dependencies"
        pacman -S --needed $depends
        su -c "makepkg -s --skippgpcheck" pac
        pacman -U $2*.pkg.tar.zst
    ;;
    *)
        echo 'No argument provided'
    ;;
esac
