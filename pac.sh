#!/bin/sh

args1=`echo $1 | cut -c1-2`
pacpass=`echo $* | cut -c1-1,3-`
uid=`id -u`
pkgbase=$2 
here=`pwd`

if (($uid != 0)); then
    echo "Please run with root"
    exit 2
fi

mkdir -p /tmp/pac/

case $args1 in
    -P*)
        if [[ $pacpass == - ]] 
        then
            echo "Please use a pacman argument after -P. ex -PSy"
            exit 1
        else
        echo $pacpass
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
        su -c "makepkg -s" pac
        #cat /tmp/pac/aura/.SRCINFO | grep "makedepends ="
    ;;
    *)
        echo 'No argument provided'
    ;;
esac
