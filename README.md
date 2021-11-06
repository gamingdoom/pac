# What is pac?
 - Pac is a package manager that combines the aur and pacman
 
 # How Do I use it?
 - You can use it like pacman by prepending ``P`` to the arguments like this for example :
 
    ``sudo pac -PSy <pacman-package>``
 
 - You can use it in aur mode by usaging the ``-A`` argument. For example : 
 
    ``sudo pac -A <aur-packagebase>``
    
# How do I install it?
To install it quick just run this one-liner :

```git clone https://github.com/gamingdoom/pac.git && cd pac && sudo ln -s `pwd`/pac /usr/bin/pac```
