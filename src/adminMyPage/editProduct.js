import { productForm } from "./form.js";
import {checkAuth} from "../utils/index.js" 

const { isAdmin, token } = checkAuth()

const main = document.querySelector('.common')

main.innerHTML = productForm();

const nameInput = document.querySelector("#nameInput")
const priceInput = document.querySelector("#priceInput");
const summaryInput = document.querySelector("#summaryInput");
const companyInput = document.querySelector("#companyInput");
const categoryInput = document.querySelector("#categoryInput")
const stockInput = document.querySelector("#stockInput");
const fileInput = document.querySelector("#file")
const descriptionInput = document.querySelector("#descriptionInput");

const saveProductBtn = document.querySelector("#saveProductBtn");
const cancelBtn = document.querySelector("#cancelBtn");
const fileUploadBtn = document.querySelector("#fileUploadBtn")

//이미지 preview
const fileDOM = document.querySelector('#file');
const preview = document.querySelector('.image-box');

fileDOM.addEventListener('change', () => {
  const imageSrc = URL.createObjectURL(fileDOM.files[0]);
  preview.src = imageSrc;
});

//수정버튼 클릭시
saveProductBtn.addEventListener('click', editProductData)

//취소버튼 클릭시
cancelBtn.addEventListener('click', () => {
    window.location.href = "/admin-productListPage";
})

insertProductElement();

//기존 데이터 받아와서 화면에 표시
async function insertProductElement() {

  //로컬에 상품 정보가 같이 넘어온 상태라면
  if(sessionStorage.getItem('targetName')){
    const targetName = sessionStorage.getItem('targetName')
    
      const data = await getProductData()
      console.log(data.data)
      const productdata = data.data
      const productId = productdata._id

      nameInput.value = productdata.name
      priceInput.value = productdata.price
      summaryInput.value = productdata.summary
      companyInput.value = productdata.company
      stockInput.value = productdata.stock
      descriptionInput.value = productdata.description
      categoryInput.value = productdata.category
      preview.src = productdata.imgPath //이미지
      console.log(productdata.imgPath) //경로는 나옴 preivew에는 안보임
      
      sessionStorage.setItem('productId', productId);
      
    } else {
    alert('잘못된 경로입니다!')
    window.location.href = "/index.html"
  }
}


//특정상품 API통신으로 조회하는 함수
async function getProductData(){
   const targetName = sessionStorage.getItem('targetName')

   const apiUrl = `http://localhost:5000/api/products/${targetName}`

   const res = await fetch(apiUrl, {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json',
       Authorization : "bearer " + token,
     },
   });

   if (res.ok) {
     const data = await res.json()
     return data;
   } else {
     alert(`페이지 로딩이 실패했습니다...`)
   }
 }

//특정상품 정보 수정하는 함수
async function editProductData(){
  const productId = sessionStorage.getItem('productId')
  console.log(productId)

  //입력된 file 받아오는 이벤트
  sendButton.addEventListener("click",function(){
 
    var formData = new FormData();
    // form Data 객체 생성
    formData.append("attachedImage", fileInput.files[0]);
    // 파일 인풋에 들어간 파일들은 files 라는 리스트로 저장된다.
    // input에 multiple을 선언해 여러개의 파일을 선택한 경우가 아니라면 files[0] 으로 input에 추가한 파일 객체를 찾을 수 있다.
    
  });

  const form = document.querySelector('#productForm')
  const updateData = new FormData(form)

  console.log([...updateData])

  const apiUrl = `http://localhost:5000/api/products/${productId}`

  const res = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        Authorization : "bearer " + token,
      },
      body: { updateData } ,
  });
  console.log(res)

    if (res.ok) {
 //     alert('상품 정보가 수정되었습니다!');
  } else {
//    alert('상품 정보 수정에 실패하였습니다...');
  }

}
