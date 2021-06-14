const setCookie = function(
  name,
  value,
  options = {
    expires: 604800, //7 days
    path: '/'
  }
) {
  options = options || {}

  let expires = options.expires

  if (typeof expires == 'number' && expires) {
    let d = new Date()
    d.setTime(d.getTime() + expires * 1000)
    expires = options.expires = d
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString()
  }

  value = encodeURIComponent(value)

  let updatedCookie = name + '=' + value

  for (let propName in options) {
    updatedCookie += '; ' + propName
    let propValue = options[propName]
    if (propValue !== true) {
      updatedCookie += '=' + propValue
    }
  }

  document.cookie = updatedCookie
}

const deleteCookie = function(name) {
  setCookie(name, '', {
    expires: -1
  })
}

const getCookie = function(name) {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}
const isCookieOn = function() {
  return navigator.cookieEnabled
}

export { setCookie, getCookie, deleteCookie, isCookieOn }
