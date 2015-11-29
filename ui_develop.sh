#!/bin/bash

PATH=$PATH:./distribution_tools/
bash _ui.sh "backend" "/data/apps/" dvelop
bash _git.sh develop_ui
