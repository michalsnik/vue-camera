export function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

export function isMobile() {
  return isIOS() || isAndroid();
}

export function isChrome() {
  return navigator.userAgent.indexOf("Chrome") !== -1;
}

export function isChromeIOS() {
  return isIOS() && /CriOS/i.test(navigator.userAgent);
}
