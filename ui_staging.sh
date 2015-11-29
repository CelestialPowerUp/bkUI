#!/bin/bash

PATH=$PATH:./distribution_tools/
bash _ui.sh "backend" "/data/apps/" staging
bash _git.sh staging_ui
