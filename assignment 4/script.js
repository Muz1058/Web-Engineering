let quizData=[];
let questions=[];
let options=[];
let correctIndex;
let question;


 async function getData() {
    console.log("getting data........");
    try{
       const response=  await fetch("questions.json")
       quizData=await response.json();
       startQuiz(quizData)
    }
    catch(e){
         console.log("Something went wrong:", e.message);
    }
  
    
 }
 getData();

 function startQuiz(quiz){

     quiz.forEach(q => {
        question=q.question

        options=q.options
        correctIndex=q.correctIndex
        console.log("question ",question);

        console.log("options  ",options);
        console.log("correctIndex  ",correctIndex);

     });

 }
 

//  async function getUserData() {
//   try {
//     const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
//     const user = await response.json();
//     console.log("User Name:", user.name);
//   } catch (error) {
//     console.log("Something went wrong:", error.message);
//   }
// }

// getUserData();
