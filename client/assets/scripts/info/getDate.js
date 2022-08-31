const getDate = {
  getWorldTime(dateTime) {
    const dateTimeSplit = dateTime.split("-")

    const year = parseInt(dateTimeSplit[0])
    const month = parseInt(dateTimeSplit[1])
    const day = parseInt(dateTimeSplit[2])
    const date = new Date(year, month, day)

    // 거주 지역이 UTC와 어느 정도 차이 나는지 알아낸다.
    let x = date.getTimezoneOffset() / 60 // UTC - GMT = x (대한민국 기준 x = -9)		주어가 UTC 이기 때문에 -9 라고 나옴
    x = x * 60 * 60 * 1000 // (시 * 분 * 초 * 밀리초)

    // UTC 값을 timestemp 로 만든다.
    const timestampUTC = (date.getTime() + x) / 1000 + 86399 // 밀리초를 초 형식으로 변환 + 23:59:59 를 더해줌
    return Math.round(timestampUTC)
  },
  getTimeZoneEndDate(standard) {
    // const tz = standard + country * 3600
    // const now = new Date(tz * 1000)
    console.log(standard)
    let x = new Date().getTimezoneOffset() / 60 // UTC - GMT = x (대한민국 기준 x = -9)		주어가 UTC 이기 때문에 -9 라고 나옴
    x = x * 60 * 60 * -1 // (시 * 분 * 초)	음수는 양수로, 양수는 음수로
    console.log(standard + x)
    const now = new Date((standard + x) * 1000)
    const month = ("0" + now.getMonth()).slice(-2)
    const date = ("0" + now.getDate()).slice(-2)

    const convertToDate = now.getFullYear() + "-" + month + "-" + date

    return convertToDate
  },
  getTimeZoneEndSeconds(standard) {
    // const tz = standard + country * 3600
    // const now = new Date(tz * 1000)
    console.log(standard)
    let x = new Date().getTimezoneOffset() / 60 // UTC - GMT = x (대한민국 기준 x = -9)		주어가 UTC 이기 때문에 -9 라고 나옴
    x = x * 60 * 60 * -1 // (시 * 분 * 초)	음수는 양수로, 양수는 음수로
    console.log(standard + x)
    const now = new Date((standard + x) * 1000)
    const month = ("0" + now.getMonth()).slice(-2)
    const date = ("0" + now.getDate()).slice(-2)
    const hours = ("0" + now.getHours()).slice(-2)
    const minutes = ("0" + now.getMinutes()).slice(-2)
    const seconds = ("0" + now.getSeconds()).slice(-2)

    const convertToDate =
      now.getFullYear() +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds

    return convertToDate
  }
}
export default getDate
