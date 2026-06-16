/**
 * Helper function to get the current greeting based on the time of day.
 */
const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning!';
    if (currentHour < 18) return 'Good Afternoon!';
    return 'Good Evening!';
};

/**
 * Adds dynamic CSS/JS asset management to every request.
 * Routes can call res.addStyle() or res.addScript() to inject
 * page-specific assets. Templates call renderStyles() / renderScripts().
 */
const setHeadAssetsFunctionality = (res) => {
    res.locals.styles = [];
    res.locals.scripts = [];

    res.addStyle = (css, priority = 0) => {
        res.locals.styles.push({ content: css, priority });
    };

    res.addScript = (js, priority = 0) => {
        res.locals.scripts.push({ content: js, priority });
    };

    res.locals.renderStyles = () => {
        return res.locals.styles
            .sort((a, b) => b.priority - a.priority)
            .map(item => item.content)
            .join('\n');
    };

    res.locals.renderScripts = () => {
        return res.locals.scripts
            .sort((a, b) => b.priority - a.priority)
            .map(item => item.content)
            .join('\n');
    };
};

/**
 * Global middleware — runs on every request.
 * Sets up res.locals variables available in all templates.
 */
const addLocalVariables = (req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
    res.locals.queryParams = { ...req.query };
    res.locals.greeting = `<p>${getCurrentGreeting()}</p>`;

    const themes = ['blue-theme', 'green-theme', 'red-theme'];
    res.locals.bodyClass = themes[Math.floor(Math.random() * themes.length)];

    // Make logged-in user available to all templates
    res.locals.isLoggedIn = !!(req.session && req.session.user);
    res.locals.user = req.session?.user || null;

    // Set up dynamic asset loading
    setHeadAssetsFunctionality(res);

    next();
};

export { addLocalVariables };