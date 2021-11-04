#!/bin/sh

args1=`echo $1 | cut -c1-2`
pacpass=`echo $* | cut -c1-1,3-`
uid=`id -u`

if (($uid != 0)); then
    echo "Please run with root"
    exit 2
fi

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
    ;;
    *)
        echo 'No argument provided'
    ;;
esac
