// 页面添加水印效果
function setWatermark(domid, markid, str) {
  let targetDom
  if (domid == 'body') {
    targetDom = document.body
  } else {
    targetDom = document.getElementById(domid)
  }
  if (document.getElementById(markid) !== null) targetDom.removeChild(document.getElementById(markid)) // 水印不允许重复
  const can = document.createElement('canvas')
  can.width = 200
  can.height = 130
  const cans = can.getContext('2d')
  cans.rotate((-20 * Math.PI) / 180)
  cans.font = '12px Vedana'
  cans.fillStyle = 'rgba(200, 200, 200, 0.30)'
  cans.textBaseline = 'middle'
  cans.fillText(str, can.width / 10, can.height / 2)
  const div = document.createElement('div')
  div.id = markid
  div.style.pointerEvents = 'none'
  div.style.width = '100%'
  div.style.height = '100%'
  div.style.position = 'absolute'
  div.style.top = '0'
  div.style.left = '0'
  div.style.right = '0'
  div.style.bottom = '0'
  div.style.zIndex = '8'
  div.style.background = `url(${can.toDataURL('image/png')}) left top repeat`
  targetDom.appendChild(div)
  return markid
}

/**
 * 页面添加水印效果
 * @method set 设置水印
 * @method del 删除水印
 */
export function useWatermark() {
  /**
   * 设置水印
   * @param {String} str 水印文字
   * @param {String} domid 指定dom盒子id，默认body节点
   * @param {String} markid 水印id 唯一
   */
  const set = (str = 'SV-Admin1', domid = 'body', markid = 'sv-global-watermark') => {
    setWatermark(domid, markid, str)
  }

  /**
   * 删除水印
   * @param {String} domid 指定dom盒子id，默认body节点
   * @param {String} markid 水印id 唯一
   */
  const del = (domid = 'body', markid = 'sv-global-watermark') => {
    let targetDom
    if (domid == 'body') {
      targetDom = document.body
    } else {
      targetDom = document.getElementById(domid)
    }
    if (document.getElementById(markid) !== null) targetDom.removeChild(document.getElementById(markid))
  }

  return {
    set,
    del
  }
}
