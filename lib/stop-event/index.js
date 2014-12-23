/**
 * Expose `stop`
 */

module.exports = stop;

/**
 * Call `preventDefault` and `stopPropagation` on `e`
 *
 * @param {Event} e
 * @return {Event}
 * @public
 */

function stop(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (e && e.stopPropagation) e.stopPropagation();
  return e;
}
