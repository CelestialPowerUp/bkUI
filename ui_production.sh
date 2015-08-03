#!/bin/bash

PATH=$PATH:./distribution_tools/
bash _ui.sh 120.132.59.94 $PRODUCTION_PWD "/data/apps" "backend" "produciton_ui"
bash _git.sh produciton_ui
