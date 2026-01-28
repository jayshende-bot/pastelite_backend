/**
 * Wraps an async function to catch any errors and pass them to the global error handler.
 * @param {Function} fn The async controller function to wrap.
 * @returns {Function} A new function that executes the controller and catches errors.
 */
module.exports = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};