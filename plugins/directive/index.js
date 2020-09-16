import Vue from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
let hoverDetailFn
let leaveDetailFn
let detailTimer
const DETAIL_TIME = 1000
export const textdetail = {
    inserted(el) {
        if (el.scrollHeight > el.clientHeight) {
            let detail
            el.addEventListener(
                'mouseover',
                (hoverDetailFn = () => {
                    const parent = el.parentElement
                    if (parent) {
                        if (!detail) {
                            detail = document.createElement('span')
                            detail.style.cssText += `
                          box-sizing: border-box;
                          position: absolute;
                          left: 0;
                          top: 0;
                          width: ${el.offsetWidth}px;
                          padding: 10px;
                          background-color: #fff;
                          border: 1px solid #eee;
                          border-radius: 5px;
                          transition: all .2s ease;
                          opacity: 0;
                          z-index: -1;                        `
                            detail.innerText = el.innerText
                            el.appendChild(detail)
                        }
                        detailTimer = setTimeout(() => {
                            detail.style.opacity = '1'
                            detail.style.zIndex = '9'
                        }, DETAIL_TIME)
                    }
                })
            )
            el.addEventListener(
                'mouseleave',
                (leaveDetailFn = () => {
                    if (detail) {
                        clearTimeout(detailTimer)
                        detail.style.opacity = '0'
                        detail.style.zIndex = '-1'
                    }
                })
            )
        }
    },
    unbind(el) {
        el.removeEventListener('mouseover', hoverDetailFn)
        el.removeEventListener('mouseleave', leaveDetailFn)
    }
}
export const highlight = {
    update(el) {
        const nodes = el.querySelectorAll('pre')
        nodes.forEach(node => {
            hljs.highlightBlock(node)
        })
    }
}


Vue.directive('textdetail', textdetail)
Vue.directive('highlight', highlight)