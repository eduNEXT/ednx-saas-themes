"""
This script creates a brother element directory that has a different bragi theme for every color defined here.


Runs in python 3.6
"""

import shutil
import re

palette_definitions = [
    "#ef5350",
    "#f44336",
    "#e53935",
    "#c62828",
    "#ec407a",
    "#e91e63",
    "#d81b60",
    "#ad1457",
    "#ab47bc",
    "#9c27b0",
    "#8e24aa",
    "#6a1b9a",
    "#7e57c2",
    "#673ab7",
    "#5e35b1",
    "#4527a0",
    "#5c6bc0",
    "#3f51b5",
    "#3949ab",
    "#283593",
    "#42a5f5",
    "#2196f3",
    "#1e88e5",
    "#1565c0",
    "#29b6f6",
    "#03a9f4",
    "#039be5",
    "#0277bd",
    "#26c6da",
    "#00bcd4",
    "#00acc1",
    "#00838f",
    "#26a69a",
    "#009688",
    "#00897b",
    "#00695c",
    "#66bb6a",
    "#4caf50",
    "#43a047",
    "#2e7d32",
    "#9ccc65",
    "#8bc34a",
    "#7cb342",
    "#558b2f",
    "#d4e157",
    "#cddc39",
    "#c0ca33",
    "#9e9d24",
    "#ffee58",
    "#ffeb3b",
    "#fdd835",
    "#f9a825",
    "#ffca28",
    "#ffc107",
    "#ffb300",
    "#ff8f00",
    "#ffa726",
    "#ff9800",
    "#fb8c00",
    "#ef6c00",
    "#ff7043",
    "#ff5722",
    "#f4511e",
    "#d84315",
    "#8d6e63",
    "#795548",
    "#6d4c41",
    "#4e342e",
    "#78909c",
    "#607d8b",
    "#546e7a",
    "#37474f",
];

# bragi/lms/static/sass/
for color in palette_definitions:
    src = 'lms/static/sass'
    dst = '../bragi-generator/bragi-{color}/lms/static/sass'.format(color = color[1:])
    try:
        shutil.rmtree(dst)
    except FileNotFoundError:
        pass

    shutil.copytree(src, dst)

    themable_file = '../bragi-generator/bragi-{color}/lms/static/sass/partials/lms/theme/_variables-extras.scss'.format(color = color[1:])
    with open(themable_file, "r") as sources:
        lines = sources.readlines()
    with open(themable_file, "w") as sources:
        for line in lines:
            sources.write(re.sub(r'\$main-color\: \#[\w]*;$', '$main-color: {color};'.format(color=color), line))

