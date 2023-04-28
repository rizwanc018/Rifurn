import hbs from 'hbs'

export function registerHelpers(hbs) {
    hbs.registerHelper("inc", function (value, options) {
        return parseInt(value) + 1;
    });
    hbs.registerHelper('gt', function (a, b, options) {
        if (a > b) return options.fn(this)
    });
    hbs.registerHelper('lt', function (a, b, options) {
        if (a < b) return options.fn(this)
    });
    hbs.registerHelper('eq', function (a, b, options) {
        if (a == b) return options.fn(this)
        else return options.inverse(this)
    });
    hbs.registerHelper('noteq', function (a, b, options) {
        if (a !== b) return options.fn(this)
        else return options.inverse(this)
    });
}

// hbs.registerHelper("inc", function (value, options) {
//     return parseInt(value) + 1;
// });
// hbs.registerHelper('gt', function (a, b, options) {
//     if (a > b) return options.fn(this)
// });
// hbs.registerHelper('lt', function (a, b, options) {
//     if (a < b) return options.fn(this)
// });
// hbs.registerHelper('eq', function (a, b, options) {
//     if (a == b) return options.fn(this)
//     else return options.inverse(this)
// });
// hbs.registerHelper('noteq', function (a, b, options) {
//     if (a !== b) return options.fn(this)
//     else return options.inverse(this)
// });

