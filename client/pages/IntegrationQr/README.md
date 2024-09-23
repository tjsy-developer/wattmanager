# PAGES

- printQr.vue에서 사용하는 print-js module에 (node-modules/print-js/dist/print.js) window 속성이 들어가있다. (10번째 줄)
  배포시 해당 window를 globalThis로 변경해줘야한다.

- [changed_node_modules](../../../changed_node_modules)하위에 [변경된 버전](../../../changed_node_modules/print-js/dist/print.js) 존재.
