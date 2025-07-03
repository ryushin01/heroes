const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

if (isSafari) {
  // A: Safari일 경우
  console.log(
    '🧑‍💻InfoGrab에서 해피해킹할 열정적인 팀원을 찾고 있어요!🔥 \n https://www.infograb.net/recruit'
  )
} else {
  // B: Safari가 아닐 경우
  console.log(
    `%c ___        __        ____           _     
|_ _|_ __  / _| ___  / ___|_ __ __ _| |__  
 | || '_ \\| |_ / _ \\| |  _| '__/ _\` | '_ \\ 
 | || | | |  _| (_) | |_| | | | (_| | |_) |
|___|_| |_|_|  \\___/ \\____|_|  \\__,_|_.__/ 

🧑‍💻InfoGrab에서 해피해킹할 열정적인 팀원을 찾고 있어요!🔥 
https://www.infograb.net/recruit`,
    'color: #579950; font-weight: bold;'
  )
}
