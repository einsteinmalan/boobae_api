#!/bin/sh
path=$(cd $( dirname ${BASH_SOURCE[0]}) && pwd )/matcha_seed.sql;

cd //Users/lcordeno/Applications/MAMP/mysql/bin;

./mysql < $path -u root -12345678;

echo "Database deployed!"



