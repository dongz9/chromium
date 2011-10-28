// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Counter used to give webkit animations unique names.
var animationCounter = 0;

function addAnimation(code) {
  var name = 'anim' + animationCounter;
  animationCounter++;
  var rules = document.createTextNode(
      '@-webkit-keyframes ' + name + ' {' + code + '}');
  var el = document.createElement('style');
  el.type = 'text/css';
  el.appendChild(rules);
  el.setAttribute('id', name);
  document.body.appendChild(el);

  return name;
}

/**
 * Fades in an element. Used for both printing options and error messages
 * appearing underneath the textfields.
 * @param {HTMLElement} el The element to be faded in.
 */
function fadeInElement(el) {
  if (el.classList.contains('visible'))
    return;
  el.classList.remove('closing');
  el.style.height = 'auto';
  var height = el.offsetHeight;
  el.style.height = height + 'px';
  var animName = addAnimation(
    '0% { opacity: 0; height: 0; } ' +
    '80% { height: ' + (height + 4) + 'px; }' +
    '100% { opacity: 1; height: ' + height + 'px; }');
  el.style.webkitAnimationName = animName;
  el.classList.add('visible');
  el.addEventListener('webkitAnimationEnd', function() {
    el.style.height = '';
    el.style.webkitAnimationName = '';
    fadeInOutCleanup(animName);
    el.removeEventListener('webkitAnimationEnd', arguments.callee, false);
  }, false );
}

/**
 * Fades out an element. Used for both printing options and error messages
 * appearing underneath the textfields.
 * @param {HTMLElement} el The element to be faded out.
 */
function fadeOutElement(el) {
  if (!el.classList.contains('visible'))
    return;
  el.style.height = 'auto';
  var height = el.offsetHeight;
  el.style.height = height + 'px';
  var animName = addAnimation(
    '0% { opacity: 1; height: ' + height + 'px; }' +
    '100% { opacity: 1; height: 0; }');
  el.style.webkitAnimationName = animName;
  el.classList.add('closing');
  el.classList.remove('visible');
  el.addEventListener('webkitAnimationEnd', function() {
    fadeInOutCleanup(animName);
    el.removeEventListener('webkitAnimationEnd', arguments.callee, false);
  }, false );
}

/**
 * Removes the <style> element corrsponding to |animationName| from the DOM.
 * @param {string} animationName The name of the animation to be removed.
 */
function fadeInOutCleanup(animationName) {
  animEl = document.getElementById(animationName);
  if (animEl)
    animEl.parentNode.removeChild(animEl);
}

/**
 * Fades in a printing option existing under |el|.
 * @param {HTMLElement} el The element to hide.
 */
function fadeInOption(el) {
  if (el.classList.contains('visible'))
    return;

  wrapContentsInDiv(el.querySelector('h1'), ['invisible']);
  var rightColumn = el.querySelector('.right-column');
  wrapContentsInDiv(rightColumn, ['invisible']);

  var toAnimate = el.querySelectorAll('.collapsible');
  for (var i = 0; i < toAnimate.length; i++)
    fadeInElement(toAnimate[i]);
  el.classList.add('visible');
}

/**
 * Fades out a printing option existing under |el|.
 * @param {HTMLElement} el The element to hide.
 */
function fadeOutOption(el) {
  if (!el.classList.contains('visible'))
    return;

  wrapContentsInDiv(el.querySelector('h1'), ['visible']);
  var rightColumn = el.querySelector('.right-column');
  wrapContentsInDiv(rightColumn, ['visible']);

  var toAnimate = el.querySelectorAll('.collapsible');
  for (var i = 0; i < toAnimate.length; i++)
    fadeOutElement(toAnimate[i]);
  el.classList.remove('visible');
}

/**
 * Wraps the contents of |el| in a div element and attaches css classes
 * |classes| in the new div, only if has not been already done. It is neccesary
 * for animating the height of table cells.
 * @param {HTMLElement} el The element to be processed.
 * @param {array} classes The css classes to add.
 */
function wrapContentsInDiv(el, classes) {
  var div = el.querySelector('div');
  if (!div || !div.classList.contains('collapsible')) {
    div = document.createElement('div');
    while (el.childNodes.length > 0)
      div.appendChild(el.firstChild);
    el.appendChild(div);
  }

  div.className = '';
  div.classList.add('collapsible');
  for (var i = 0; i < classes.length; i++)
    div.classList.add(classes[i]);
}
