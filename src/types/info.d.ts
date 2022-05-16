declare namespace INFO {

  interface pagination{
    pageNum: number
    pageSize: number
    total: number
  }

  interface ClassInfo {
    classId: string
    classNum: string
    className: string
  }
  interface UserInfo {
    userId: string
    userName: string
    account: string
    password: string
    classInfo: ClassInfo[]
    role: number
    sex: string
  }

  interface bookInfo {
    bookId: string
    bookName: string
    coverSrc: string
    introduction: string
    author: string
  }
}
