/**
 * 并发处理异步函数，并以耗时最长的异步函数时长为终结
 * @param {Array} asyncFunctions 要并发的异步函数数组
 */
async function executeConcurrent(asyncFunctions) {
  // 使用 Promise.all 来并发执行所有传入的异步函数
  // 这将会返回一个包含所有函数结果的数组，顺序与输入时相同
  return Promise.all(asyncFunctions.map(fn => fn()));
}

export const usePromise = () => {
  return {
    executeConcurrent
  }
}