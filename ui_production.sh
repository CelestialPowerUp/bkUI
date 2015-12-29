#!/bin/bash

PATH=$PATH:./distribution_tools/
bash _ui.sh "backend" "/data/apps/" production
bash _git.sh produciton_ui
