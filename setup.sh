#! /bin/bash

sudo apt-get update
sudo apt-get install git
gem install github-pages -v 28
gem install jekyll-assets -v 0.11.0
gem install react-jsx-sprockets: -v 0.2.0

mkdir ~/static
cd ~/static
git init
