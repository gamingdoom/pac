#!/bin/sh

args1=`echo $1 | cut -c1-2`
pacpass=`echo $* | cut -c1-1,3-`
uid=`id -u`
pkgbase=$2 

if (($uid != 0)); then
    echo "Please run with root (sudo)"
    exit 2
fi

aur()
{
    # $1 = packagebase
    #https://aur.archlinux.org/packages/pkgbase
    mkdir -p /tmp/pac/
    rm -r /tmp/pac/$1 > /dev/null 2>&1
    git clone https://aur.archlinux.org/$1.git /tmp/pac/$1 -q --progress
    chmod 777 /tmp/pac/$1
    checkdir=`ls /tmp/pac/$1`
    if [[ ! -n $checkdir ]]; then
        echo "Package base doesn't exist"
        rm -r /tmp/pac/$1
        exit 3
    fi
    cd /tmp/pac/$1
    #https://colors.sh
    NO_FORMAT="\033[0m"
    C_ORANGE1="\033[38;5;214m"
    C_GREY3="\033[48;5;232m"
    #parse .SRCINFO
    makedepends=`cat /tmp/pac/$1/.SRCINFO | grep "makedepends = " | sed -e 's/makedepends = //g' | sed -r 's/\s+//g'`
    depends=`cat /tmp/pac/$1/.SRCINFO | grep "\<depends\>" | sed -e 's/depends = //g' | sed -r 's/\s+//g'`
    optdepends=`cat /tmp/pac/$1/.SRCINFO | grep "\<optdepends\>" | sed -e 's/optdepends = //g' | sed -r 's/\s+//g' | sed -r 's/:.*//g'`
    optdependsfrontend=`cat /tmp/pac/$1/.SRCINFO | grep "\<optdepends\>" | sed -e 's/optdepends = //g'`
    echo -e "${C_ORANGE1}${C_GREY3}Would you like to keep make dependencies after the package is done building? [Y/n]${NO_FORMAT}"
    read keepmake
    echo "Installing Make Dependencies :"
    echo $makedepends
    pacman -S --needed $makedepends
    echo "Installing Dependencies :"
    echo $depends 
    pacman -S --needed $depends
    su -c "makepkg -s --skippgpcheck" pac
    pacman -U $1*.pkg.tar.zst
    if [[ -n $optdepends ]]; then
        echo -e "${C_ORANGE1}${C_GREY3}Would you like to install the following optional dependencies? [Y/n]${NO_FORMAT}"
        echo $optdependsfrontend
        read ifoptdependswants
        if [[ -z $ifoptdependswants || $ifoptdependswants = y ]]; then
            pacman -S --needed $optdepends
        fi
    fi
    if [[ $keepmake = n ]]; then
        pacman -R $makedepends
    fi
}

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
#       arg 2  = packagebase btw
        aur $2
    ;;
    *)
        echo 'No argument provided'
        exit 1
    ;;
esac
