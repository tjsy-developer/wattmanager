# PAGES

printQr.vue에서 사용하는 print-js module에 (node-modules/print-js/dist/print~) window 속성이 들어가있다. (10번째 줄)
배포시 해당 window를 globalThis로 변경해줘야한다.