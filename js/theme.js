/**
 * Theme switcher
 */

function initTheme() {
    var theme = localStorage.getItem("theme");
    if(theme) {
        setColorMode(theme);

        var darkTheme = localStorage.getItem("dark_theme");
        if(darkTheme) {
            setDarkTheme(darkTheme);
        }
    }
}

/**
 * Toggle the theme of the site. If theme parameter is null, it will
 * toggle the theme between dark and light mode.
 * @see https://primer.style/css/getting-started/theming
 * @param {String} theme light oder dark theme
 * @param {String} darkTheme (optional) dark theme variant: dark or dark_dimmed
 */
function toggleTheme(theme, darkTheme) {
    if(theme) {
        setColorMode(theme);
        localStorage.setItem("theme", theme);

        if(darkTheme) {
            setDarkTheme(darkTheme);
            localStorage.setItem("dark_theme", darkTheme);
        }
    } else {
        if(document.documentElement.getAttribute("data-color-mode") === "light") {
            // set to dark theme
            setColorMode("dark");
            localStorage.setItem("theme", "dark");
        } else {
            // set to light theme
            setColorMode("light");
            localStorage.setItem("theme", "light");
        }
    }
}

function setColorMode(mode) {
    document.documentElement.setAttribute("data-color-mode", mode);
}

function setDarkTheme(darkTheme) {
    document.documentElement.setAttribute("data-dark-theme", darkTheme);
}

initTheme();
