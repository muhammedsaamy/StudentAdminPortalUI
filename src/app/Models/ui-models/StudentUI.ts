export interface Student {
  id: string,
  firstName: string,
  lastName: string,
  mobile: number,
  email: string,
  dateOfBirth: string,
  profileImgUrl: string,
  genderId: string,
  address: Address,
  gender: Gender
}

export interface Address {
  id: string,
  physicalAddress: string,
  postalAddress: string,
  studentId: string
}

export interface Gender {
  id: string,
  description: string
}
