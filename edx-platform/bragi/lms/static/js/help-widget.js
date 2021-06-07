/* This file contains helper functions for the
edunext help widget */

function toggleHelpWidget(action) {
    /*This function hides or shows the help widget*/
    var widget = document.getElementById("ednx-help-widget-wrapper");
    var renderHeight = $( document ).height();
    if (action === "display") {
        widget.style.display = "block";
    } else {
        widget.style.display = "none";
        widget.style.height = renderHeight;
    }
}
