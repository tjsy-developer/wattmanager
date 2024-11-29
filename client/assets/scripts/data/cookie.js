export default {
  /* 쿠키 저장함수 (쿠키이름, 쿠키저장변수값, 쿠키유효기간설정) */
  setCookie(cookieName, cookieValue, exdays) {
    const exdate = new Date()
    exdate.setDate(exdate.getDate() + exdays)
    const value =
      escape(cookieValue) +
      (exdays == null ? "" : "; expires= " + exdate.toUTCString())
    console.log(value)
    document.cookie = cookieName + "=" + value
  },
  /* 저장된 쿠키값 불러오는 함수 (쿠키이름) */
  getCookie(cookieName) {
    let i
    let x
    let y
    const ARRcookies = document.cookie.split(";")
    for (i = 0; i < ARRcookies.length; i++) {
      x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="))
      y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1)
      x = x.trim()

      if (x === cookieName) {
        return unescape(y)
      }
    }
  },
  /* 저장된 쿠키값 삭제하는 함수 (쿠키이름) */
  deleteCookie(cookieName) {
    const date = new Date()
    date.setDate(date.getDate() - 100)
    const Cookie = cookieName + "=; expires= " + date.toUTCString()
    document.cookie = Cookie
  }
}
