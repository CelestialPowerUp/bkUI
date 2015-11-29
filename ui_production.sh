#!/bin/bash

PATH=$PATH:./distribution_tools/
bash _ui.sh "backend" "/data/apps/backend"
bash _git.sh produciton_ui
