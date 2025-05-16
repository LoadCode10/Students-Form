class Student{
  constructor(nom,prenom,cne,niveau,specialite,note){
    this.nom = nom;
    this.prenom=prenom;
    this.cne=cne;
    this.niveau=niveau;
    this.specialite=specialite;
    this.note=note;
  }
};

class UserInterface{
  static displayStudent(){
    const students = StudentStore.getStudents();
    students.forEach((student) => UserInterface.addStudentToList(student));
  };

  static addStudentToList(student){
    const list = document.querySelector(".students-list");
    const row = document.createElement('tr');
    row.innerHTML=`
      <td>${student.nom}</td>
      <td>${student.prenom}</td>
      <td>${student.cne}</td>
      <td>${student.niveau}</td>
      <td>${student.specialite}</td>
      <td>${student.note}</td>
      <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;
    list.appendChild(row);
  };

  static showMsg(message,className){
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const allFields = document.querySelector('.all-fields');
    container.insertBefore(div,allFields);
    setTimeout(()=>{
      document.querySelector('.alert').remove();
    },3000);
  }

  static clearFields(){
    document.getElementById('nom').value = '';
    document.getElementById('prenom').value='';
    document.getElementById('cne').value='';
    document.getElementById('niveau').value='';
    document.getElementById('specialite').value='';
    document.getElementById('note').value='';
  }
};

//Manage Storage
class StudentStore{
  static getStudents(){
    let students;
    if(localStorage.getItem("students") === null){
      students=[];
    }else{
      students = JSON.parse(localStorage.getItem("students"));
    }
    return students;
  };
  static addStudent(student){
    const students = StudentStore.getStudents();
    students.push(student);
    localStorage.setItem("students",JSON.stringify(students));
  };
  static removeStudent(cne){
    const students = StudentStore.getStudents();
    students.forEach((student,index)=>{
      if(student.cne === cne){
        students.splice(index,1);
      }
    });
    localStorage.setItem("students",JSON.stringify(students));
  }
}

document.addEventListener('DOMContentLoaded',UserInterface.displayStudent);

//add New Student to the table
const studentForm = document.querySelector('.student-form');
studentForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  const nom = document.getElementById('nom').value;
  const prenom = document.getElementById('prenom').value;
  const cne = document.getElementById('cne').value;
  const niveau = document.getElementById('niveau').value;
  const specialite = document.getElementById('specialite').value;
  const note = document.getElementById('note').value;

  if(nom!=''&&prenom!=''&&cne!=''&&niveau!=''&&specialite!=''&&note!=''){
    const student = new Student(nom,prenom,cne,niveau,specialite,note);
    UserInterface.addStudentToList(student);
    StudentStore.addStudent(student);//add student to storage
    UserInterface.clearFields();
    const message = `your student added succesfully`
    UserInterface.showMsg(message,'success');
  }else{
    const message = `please! fill in all the fields`
    UserInterface.showMsg(message,'danger');
  };

});

//remove student from table
const studentsList = document.querySelector('.students-list');
studentsList.addEventListener('click',(e)=>{
  if(e.target.classList.contains('delete')){
    e.target.parentElement.parentElement.remove();
    const message = `your student deleted succesffuly`
    UserInterface.showMsg(message,'info');
  };
  StudentStore.removeStudent(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
});


const searchStudent = (value,data)=>{
  const filteredData = [];
  for(let i=0; i< data.length; i++){
    value = value.toLowerCase()
    const cne = data[i].cne.toLowerCase();
    if(cne.includes(value)){
      filteredData.push(data[i]);
    };
  };
  return filteredData;
};

const refreachTable = (data)=>{
  const tableBody = document.querySelector('.students-list');
  tableBody.innerHTML = '';
  for(let i = 0; i< data.length ; i++){
    let row = `
      <tr>
        <td>${data[i].nom}</td>
        <td>${data[i].prenom}</td>
        <td>${data[i].cne}</td>
        <td>${data[i].niveau}</td>
        <td>${data[i].specialite}</td>
        <td>${data[i].note}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
      </tr>
    `
    tableBody.innerHTML += row;
  }
}

const studentsArray = StudentStore.getStudents()
const searchInput = document.querySelector('.form-search');
searchInput.addEventListener('keyup',(e)=>{
  const value = e.target.value;
  const data = searchStudent(value,studentsArray);
  refreachTable(data);
})