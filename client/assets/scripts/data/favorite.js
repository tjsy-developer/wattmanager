/* eslint-disable no-lonely-if */
import axios from "axios"
import { axiosRequest } from '../../../plugins/axiosRequest'

export default {
  add(seq) {
    const params = {
      data: {
        att_seq: seq,
        jwt: sessionStorage.getItem("jwt")
      },
      api: process.env.backendURL + "attRest/fav_insert"
    }
    axiosRequest('post', params)
      .then(function(res) {
        if (!res) console.log("즐겨찾기 추가 실패")
      })
      .catch(function(error) {
        console.log("favorite.js add error : ", error)
        alert("즐겨찾기 추가 실패")
      })
  },
  remove(seq, self) {
    const params = {
      data: {
        att_seq: seq,
        jwt: sessionStorage.getItem("jwt")
      },
      api: process.env.backendURL + "attRest/fav_delete"
    }
    axiosRequest('post', params)
      .then(function(res) {
        if (!res.data) console.log("즐겨찾기 삭제 실패")
        else {
          // eslint-disable-next-line prettier/prettier
					if(self.$route.name === "attachment-favorite") window.location.reload()
        }
      })
      .catch(function(error) {
        console.log("favorite.js remove error : ", error)
        alert("즐겨찾기 삭제 실패")
      })
  }
}
