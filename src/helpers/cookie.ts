const cookie = {
  read(name: string): string | null {
    // match方法 拿到cookie中的特定字段 以数组返回
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
