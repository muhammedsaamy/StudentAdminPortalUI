import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Gender, Student } from 'src/app/Models/ui-models/StudentUI';
import { GenderService } from 'src/app/Services/gender.service';
import { StudentService } from '../students.service';

@Component({
  selector: 'app-singel-student',
  templateUrl: './singel-student.component.html',
  styleUrls: ['./singel-student.component.css']
})
export class SingelStudentComponent implements OnInit {


  studentId: string | undefined | null;
  gendersList: Gender[] = [];

  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    mobile: 0,
    email: '',
    dateOfBirth: '',
    profileImgUrl: '',
    genderId: '',
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: '',
      studentId: ''
    },
    gender: {
      id: '',
      description: ''
    }
  }

  displayImgProfileStd = '';

  isCreatingNewStudent = false;
  singleStudentHeaderTxt = '';

  errors = [];

  @ViewChild('studentDetailsForm') studentDetailsForm?: NgForm;

  constructor(
    private readonly studentService: StudentService,
    private readonly genderListService: GenderService,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly router: Router
  ) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');

        if (this.studentId?.toLowerCase() === 'AddNewStudent'.toLowerCase()) {
          this.isCreatingNewStudent = true;
          this.singleStudentHeaderTxt = 'Create New Student';
          this.setProfileImg();
        } else {
          this.isCreatingNewStudent = false;
          this.singleStudentHeaderTxt = 'Student Details'

          //if studentId has a value , to be sure that is not returning null
          // moved it here to not calling it when creating a new student

          if (this.studentId) {

            this.studentService.GetStudent(this.studentId).subscribe({

              next: (onSuccess) => {
                this.student = onSuccess;
                this.setProfileImg();
              },
              error: (onError) => {
                this.setProfileImg();
              }

            })
          }
        }

        this.genderListService.GetAllGenders().subscribe({
          next: (onSuccess) => {
            this.gendersList = onSuccess;
          }
        })


      }

    );

  }

  UpdateStudent(): void {
    if (this.studentDetailsForm?.form.valid) {

      this.studentService.UpdateStudent(this.student.id, this.student).subscribe({

        next: (OnSuccess) => {
          this.snackBar.open("Data Updated Successfuly", '', {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackBar']
          });
        },
        error: (onError) => {
          console.log(onError)
        }
      });
    }

  }

  DeleteStudent(): void {
    if (confirm(`Are you sure to delete ${this.student.firstName}`))
      this.studentService.DeleteStudent(this.student.id).subscribe({
        next: (OnSuccess) => {
          this.snackBar.open("Student Deleted Successfully -__-", "", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackBar']
          });
          setTimeout(() => {
            this.router.navigateByUrl('students')
          }, 2000);
        }


      })
  }
  AddNewStudent(): void {

    // if the form is valid => submit

    if (this.studentDetailsForm?.form.valid) {

      this.studentService.AddNewStudent(this.student).subscribe({
        next: (OnSuccess) => {
          this.snackBar.open("Student Saved Succefully", "", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackBar']
          });
          setTimeout(() => {
            this.router.navigateByUrl('students')
          }, 2000);
        },
        error: (OnError) => {


          console.log(OnError)
        }
      })

    }

  }




  private setProfileImg(): void {

    if (this.student.profileImgUrl) {

      this.displayImgProfileStd = this.studentService.getImgPathOfApi(this.student.profileImgUrl);

    } else {
      this.displayImgProfileStd = 'assets/imgPlaceholder.jpg'
    }

  }

  uploadstdImg(event: any): void {

    if (this.studentId) {
      const file: File = event.target.files[0];

      this.studentService.uploadImage(this.student.id, file).subscribe({
        next: (onSuccess) => {

          this.student.profileImgUrl = onSuccess;
          this.setProfileImg();

          this.snackBar.open("Image Uploaded Successfully", "", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['green-snackBar']
          });


        },
        error: (onError) => {

          this.snackBar.open("Invalid Img Format", "", {
            duration: 2000,
            verticalPosition: 'top',
            panelClass: ['error-snackBar']
          });
        }
      }
      )
    }
  }


}
