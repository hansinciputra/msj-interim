import {elements , renderLoader ,clearLoader, currencyFormat} from "./view/base";
import {Product, getAllProduct,deleteProduct, getSingleProduct, setDummyData} from './model/Product';
import { CompetitorProduct,getCompetitorProduct,getPriceOnProduct,setCompetitorProductData } from "./model/CompetitorProduct";
import {SearchPricing} from './model/Pricing';
import * as warehouseModel from './model/Warehouse';
import * as productView from './view/productView';
import * as pricingView from './view/pricingView';
import * as competitorView from './view/competitorView';
import * as warehouseView from './view/warehouseView';

//get a reference to the databse service
var db = firebase.firestore();
//sign in section

  
var server = {};
//==========================LOGIN CONTROLLER ======================================================

(function login(){
    let auth = firebase.auth();
    let username = document.getElementById('userNameSignin');
    let password = document.getElementById('passwordSignin');
    let button = document.getElementById('btnSignin');

    firebase.auth().onAuthStateChanged(function(user) {
        let currentUser = auth.currentUser;
        if (user) {
        
          // User is signed in.
          console.log(`${user.email} sedang login`);
          document.querySelector(".mainMenuSection").classList.remove("hidden");
          document.querySelector(".core_container").classList.remove("hidden");
          document.querySelector(".login-wrapper").classList.add("hidden");
        } else {
          // No user is signed in.
          button.addEventListener("click",(cur)=>{
            cur.preventDefault();
            let loginStatus = auth.signInWithEmailAndPassword(username.value,password.value);
            loginStatus.then((resolve)=>{
                document.querySelector(".mainMenuSection").classList.remove("hidden");
                document.querySelector(".core_container").classList.remove("hidden");
                document.querySelector(".login-wrapper").classList.add("hidden");
            }).catch(error=>{
                alert(`Data tidak ditemukan ${error}`);
            })
        });
        }
      });


})();


//SHARED FUNCTION=============================================================
const cleanContainer = () =>{
    elements.coreContainer.innerHTML = ``;   
}

//==========================WAREHOUSE CONTROLLER ======================================================

elements.coreContainer.addEventListener("change",(el)=>{
   if(el.target.matches('#warehouseDate')){
       let date = document.getElementById('warehouseDate').value;
       warehouseView.clearRecordTable();
       console.log(date);
       //1.get data from db based on date doc
       renderLoader(document.querySelector('.warehouseContainer'));
       
       warehouseModel.getRecordOnDate(date).then(data=>{
           clearLoader();
           if(data){
               let keys = Object.keys(data);
               //console.log(data);
               keys.forEach(cur=>{
                   //console.log(data[cur]);
                   let rowData = data[cur];
                    //2 render data in the view
                   warehouseView.renderCodeRow("none",rowData);
               });
           }else{
               warehouseView.noRecordNotif(date);
               
           }
       });
       
   } 
   if(el.target.matches('.codeBarangWarehouse')){
       
       let code = el.target.value.toLowerCase();
       let intent = el.target.parentNode.parentNode.getAttribute('class');
       //console.log(code,intent);
       if(code){
           let newWarehouseRow = new warehouseModel.WarehouseRow(code,intent);
            
           newWarehouseRow.getDatafromCode().then(result=>{
                if(result.code){
                    //console.log(result);
                    warehouseView.deleteLastRow();
                    warehouseView.renderResultRow(result);
                }else{
                    alert("Code Barang Tidak ditemukan, periksa lagi code barang");
                }
           }).catch(error=>`failed to get data from product db from warehouse index code X33612JSK ${error}`);
       }
   }
});
elements.coreContainer.addEventListener("click",(el)=>{
    if(el.target.matches('#warehouseOutButton')){  
        //console.log(el.target.value);
        let checker = document.querySelector('.lastChecker');
        if(!checker){
            warehouseView.renderCodeRow(el.target.value);
        }
    }
    if(el.target.matches('#warehouseInButton')){
        //console.log(el.target.value);
        let checker = document.querySelector('.lastChecker');
        if(!checker){
            warehouseView.renderCodeRow(el.target.value);
        }
    }
    if(el.target.matches('.submitWarehouseRecord')){
        console.log("upload pressed");
        let dataWarehouseRow = {
            tanggal : document.getElementById('warehouseDate').value,
            code: el.target.parentNode.parentNode.childNodes[5].childNodes[0].innerHTML,
            intent : el.target.parentNode.parentNode.getAttribute('class'),
            docId : el.target.parentNode.parentNode.childNodes[3].value,
            stock : el.target.parentNode.parentNode.childNodes[9].innerHTML,
            enteredAmount : el.target.parentNode.parentNode.childNodes[11].childNodes[0].value,
            namaCustomer : el.target.parentNode.parentNode.childNodes[13].childNodes[0].value,
            prevValue : el.target.parentNode.parentNode.childNodes[15].value,
            desc:el.target.parentNode.parentNode.childNodes[7].innerHTML
        }
        console.log(dataWarehouseRow);
 
        warehouseModel.insertWarehouseRow(dataWarehouseRow).then(resolve=>{
            //console.log(resolve);
            warehouseView.deleteRowRecord();
            warehouseView.renderCodeRow('none',resolve);
            //render new result, pas pindahin tanggal jg render new   
        }).catch(error=>{
            console.log(`failed inserting new record to database ${error} code X129837`);
        });
        
        warehouseModel.updateStock(dataWarehouseRow).then(resolve=>{
            console.log(resolve);
        }).catch();
        
        //console.log(dataWarehouseRow.desc);     
    }   
    if(el.target.matches('.deleteWarehouseRecord')){
        console.log("delete pressed");
        let checker = el.target.parentNode.parentNode.getAttribute('id');
        let checker2 = document.querySelector('.newChecker');
        console.log(checker);
     //get intent 
        if(checker2 || checker === 'finalInputRow'){
            console.log("masuk sini");  
            let greenTruck = el.target.parentNode.childNodes[1].getAttribute('class');
            console.log(greenTruck);
                if(greenTruck==='fa fa-truck submitWarehouseRecord lastChecker'){
                    console.log("green truck exist no checker");
                    warehouseView.deleteRowRecord(el.target.parentNode.parentNode.parentNode);
                }else{
                    console.log("delete code");
                    let intent = el.target.parentNode.parentNode.getAttribute('class');
                    //get code
                    let code = el.target.parentNode.parentNode.childNodes[3].innerHTML;
                    //get date
                    let tanggal = document.getElementById('warehouseDate').value
                    //get the user input value
                    //get docId
                    let docId = el.target.parentNode.parentNode.childNodes[13].childNodes[1].value;
                    let userInputValue = el.target.parentNode.parentNode.childNodes[9].childNodes[1].value;
                    //get the map id
                    let mapId = el.target.parentNode.parentNode.childNodes[13].childNodes[9].value;
                    if(mapId){
                        warehouseModel.deleteWarehouseRecord(tanggal, mapId,userInputValue,code,intent,docId);
                        warehouseView.deleteRowRecord(el.target.parentNode.parentNode.parentNode);
                    } 
                }      
        }else{
            console.log("no checker");
            warehouseView.deleteRowRecord(el.target.parentNode.parentNode.parentNode);
        }
        

    }   
    if(el.target.matches('.editWarehouseRecord')){
        //console.log("edit pressed");
        //1.get the current level of quantity when edited
        let code = el.target.parentNode.parentNode.childNodes[3].innerHTML;
        console.log(code);
        console.log(typeof(code));
        warehouseModel.curQty(code).then((data)=>{
            console.log(data.stock);
            let stock = parseInt(data.stock,10);
            //2. prepare the view to be able to enter user input
            warehouseView.prepareUpdateAmountRecordView(el.target,stock);
        })
        
        
        
    } 
    if(el.target.matches('.updateAmountWarehouseRecord')){
        //update the amouunt and customer from warehouse record
        let code = el.target.parentNode.parentNode.parentNode.childNodes[3].innerHTML;
        let tipe = el.target.parentNode.parentNode.parentNode.childNodes[5].innerHTML;
        let tanggal = document.getElementById('warehouseDate').value;
        let stockOnDate = el.target.parentNode.parentNode.parentNode.childNodes[7].innerHTML;
        let intent = el.target.parentNode.parentNode.parentNode.getAttribute('class');
        let prevUserAmount = el.target.parentNode.parentNode.parentNode.childNodes[13].childNodes[4].childNodes[1].value;
        let targetId = el.target.parentNode.parentNode.parentNode.childNodes[13].childNodes[1].value;
        let newEnteredAmount = el.target.parentNode.parentNode.parentNode.childNodes[9].childNodes[0].value;
        let newNamaCustomer = el.target.parentNode.parentNode.parentNode.childNodes[11].childNodes[0].value;
        let mapId = el.target.parentNode.parentNode.parentNode.childNodes[13].childNodes[8].value;
        //let rowNumber = el.target.parentNode.parentNode.parentNode.childNodes[1].innerHTML;
        console.log("edit update pressed");
        console.log(rowNumber);
        //console.log(stockOnDate); --> stock per tanggal tersebut
 
        //prepare data for updateStock warehouse model
        let data = {
            code:code,
            desc:tipe,
            tanggal,
            intent, 
            stock: parseInt(stockOnDate,10),
            docId: targetId,
            enteredAmount: newEnteredAmount,
            prevValue: parseInt(prevUserAmount,10),
            customer:newNamaCustomer,
            mapId
        }
        console.log(data);
        //code untuk update stock jika add,delete,update dari row yang sudah pernah di buat
        warehouseModel.updateStock(data).then(result=>{
            console.log(result);
            let newData = {
                code:code,
                desc:tipe,
                tanggal,
                intent, 
                sisaStock: result,
                docId: targetId,
                enteredAmount: parseInt(newEnteredAmount,10),
                prevValue: parseInt(prevUserAmount,10),
                customer:newNamaCustomer,
                mapId
            }
            //remove the prev record
            warehouseView.deleteRowRecord(el.target.parentNode.parentNode.parentNode);
            //render new record
            warehouseView.renderCodeRow('',newData);
        });
        
        

    }
    
});
elements.warehouseMenu.addEventListener("click",(el)=>{
        if(document.querySelector('.warehouseContainer')){
            document.querySelector('.warehouseContainer').parentNode.removeChild(document.querySelector('.warehouseContainer'));
        }else{
            cleanContainer();
            warehouseView.renderWarehouseContainer();
        } 
     
});

//==========================COMPETITOR CONTROLLER ======================================================

elements.coreContainer.addEventListener("click",(el)=>{

    const toggleInputPriceBox = ()=>{
        //code for competitor modul, so only after we clicked on the price we can
        //edit the price
            let sibling = el.target.parentNode.children;
       
            for(let i = 0; i < sibling.length;i++){
                sibling[i].classList.toggle("hidden");
                //console.log(sibling[i]);
            }
       
    }
    if(el.target.matches('#competitor_product_search_button')){
        
        if(document.getElementById('competitorPrice')){
            competitorView.removeCompetitorSearchResult();
        }
        let competitorName = document.getElementById("competitor_product_name_choice").value;
        let competitorProd = document.getElementById("competitor_product_type_choice").value;
        let competitorDinamoPhasa = document.getElementById("competitor_product_dinamo_phasa_choice").value;
        let competitorDinamoMaterial = document.getElementById("competitor_product_dinamo_material_choice").value;
        let competitorDinamoRPM = document.getElementById("competitor_product_dinamo_rpm_choice").value;


        let productResult = getCompetitorProduct(competitorName,competitorProd,competitorDinamoPhasa,competitorDinamoMaterial,competitorDinamoRPM);
        productResult.then((resolve,reject)=>{
            competitorView.renderSearchResult(resolve);
        }).catch(error => `Error getting Bartex Prod data from index ${error}`);
    }
    if(el.target.matches('.labelCompetitorPrice')){
        toggleInputPriceBox();
    }
    
});
elements.competitorProductMenu.addEventListener("click",(el)=>{
    //console.log(el.target);
    if(el.target.matches('.menuCompetitor')){
        cleanContainer();
        competitorView.renderCompetitorOptions();

     }

});
elements.coreContainer.addEventListener("change",(el)=>{
  //Code to get user input for new competitor price
  if(el.target.matches('.competitorValue')){
    let results = [];
    let sibling = el.target.parentNode.children;
 
    let obj = {};
    for(let i = 0; i < sibling.length;i++){
        obj[sibling[i].name] = sibling[i].value;
    }
    results.push(obj);
    console.log(obj);
    let newCompetitorPrice = new CompetitorProduct(obj);
    newCompetitorPrice.insertToDb().then(()=>{
        console.log(newCompetitorPrice.result);
    }).catch(error=>{
        console.log(`failed inserting Bartex to database from index ${error}`);
    });
}
  if(el.target.matches('#competitor_product_type_choice')){
      let prod = document.getElementById("competitor_product_type_choice").value;
      if(prod === 'DINAMO'){
          document.getElementById("dinamo_competitor_choice").classList.remove("hidden");
      }else{
          document.getElementById("dinamo_competitor_choice").classList.add("hidden");
      }
  }
});
//==========================PRICING CONTROLLER ======================================================

const pricingControler = ()=>{
            
    pricingView.removePricingContainer();
    pricingView.renderNewPricingContainer();
}

//CODE UNTUK CEK HARGA ------------------------------------------------------
elements.cekHargaMenu.addEventListener("click",()=>{

    //display pricing container
    if(document.querySelector('.pricingContainer')){
        document.querySelector('.pricingContainer').parentNode.removeChild(document.querySelector('.pricingContainer'));
    }else{
        cleanContainer();
        pricingControler();
    } 
});
    //----------------PRICING EVENT LISTENER--------------------------------
elements.coreContainer.addEventListener("change",(el)=>{

    if(el.target.matches('.pricingProdSelect')){
        //get the selected value
        const prod = el.target.value;
        console.log(el.target.value);
        //call pricingView to remove and render new pricingProductSelection
        pricingView.removePricingContainer();
        pricingView.renderNewPricingProductSelection(prod);
        //display berdasarkan tipe yang di select
        //productView.renderUpdateContainer(el.target.value,"add");
    }
    
});

elements.coreContainer.addEventListener("change",(el)=>{
    
    if(el.target.matches('#wd_prcn_dsc1')){
        let amount = parseInt(document.getElementById("wd_unit_price").innerHTML.replace(/[^0-9.]/g, ''),10);
        let prcnt1 = document.getElementById("wd_prcn_dsc1").value;
        //calculate the new amount after disc
        if(prcnt1){
            let newResult = pricingView.renderDiscountResult(amount,prcnt1);
            //display the result
            document.getElementById("wd_final_price").innerHTML = currencyFormat(newResult);
        }
    }
    if(el.target.matches('#wd_prcn_dsc2')){
        let amount = parseInt(document.getElementById("wd_unit_price").innerHTML.replace(/[^0-9.]/g, ''),10);
        let prcnt1 = document.getElementById("wd_prcn_dsc1").value;
        let prcnt2 = document.getElementById("wd_prcn_dsc2").value;
        //calculate the new amount after disc
        if(prcnt2){
            let newResult = pricingView.renderDiscountResult(amount,prcnt1);
            let newResult2 =pricingView.renderDiscountResult(newResult,prcnt2);
            document.getElementById("wd_final_price").innerHTML = currencyFormat(newResult2);
        }
    }
    if(el.target.matches('#bartex_prcn_up')){
        let amount = parseInt(document.getElementById("bartex_unit_price").innerHTML.replace(/[^0-9.]/g, ''),10);
        let prcnt1 = document.getElementById("bartex_prcn_up").value;
        if(prcnt1){
            let newResult = pricingView.renderUpMarginResult(amount,prcnt1);
            //display the result
            document.getElementById("bartex_final_price").innerHTML = currencyFormat(newResult);
        }
    }
    if(el.target.matches('#sumber_prcn_up')){
        let amount = parseInt(document.getElementById("sumber_unit_price").innerHTML.replace(/[^0-9.]/g, ''),10);
        let prcnt1 = document.getElementById("sumber_prcn_up").value;
        if(prcnt1){
            let newResult = pricingView.renderUpMarginResult(amount,prcnt1);
            //display the result
            document.getElementById("sumber_final_price").innerHTML = currencyFormat(newResult);
        }
    }
});
elements.coreContainer.addEventListener("click",(el)=>{
    //code for listening to submit button for get pricing-------------------------------
    if(el.target.matches('.btnGetPricing')){
        el.preventDefault();
        console.log("submit pressed");
        pricingView.removePricingResult();
        //1. get the user input value
        let formLabel = ``;
        formLabel = {
                        tipe: (document.querySelector('#prodType') ? document.querySelector('#prodType').value : null) ,
                        size: (document.querySelector('#prodSize') ? document.querySelector('#prodSize').value : null),
                        ratio: (document.querySelector('#prodRatio') ? document.querySelector('#prodRatio').value: null),
                        flange: (document.querySelector('#prodFlange') ? document.querySelector('#prodFlange').value : null),
                        material: (document.querySelector('#prodMaterial') ? document.querySelector('#prodMaterial').value : null),
                        model:(document.querySelector('#prodModel') ? document.querySelector('#prodModel').value : null),
                        hp: (document.querySelector('#prodHp') ? document.querySelector('#prodHp').value : null),
                        rpm: (document.querySelector('#prodRPM') ? document.querySelector('#prodRPM').value : null),
                        phase: (document.querySelector('#prodPhase') ? document.querySelector('#prodPhase').value : null)
                    }  
        console.log(formLabel);
            //2. search the input from database
                var Pricing = new SearchPricing(formLabel.tipe,formLabel.size,formLabel.ratio,formLabel.flange,formLabel.hp,formLabel.rpm,formLabel.phase,formLabel.material,formLabel.model);
                Pricing.getBasedOnType(formLabel.tipe).then((resolve,reject)=>{
                //get the data
                let newData = resolve;

                //2.a get the competitor data
                let bartexPrice;
                let sumberPrice;
                    renderLoader(document.querySelector('.pricingProductSelection'));
                    //MULAI PROMISE===================
                    //get from competitorProduct model
                    getPriceOnProduct(formLabel).then(data=>{
                        clearLoader();
                        
                        //console.log("data ----");
                        //console.log(data);
                        bartexPrice = data[0].BARTEX;
                        sumberPrice = data[0].SUMBER;   

                        //2.b get sparepart data
                        if(formLabel.tipe === 'WPA'||'NMRV'){
                            console.log("tipe adalah WPa atau NMRV untuk panggil spareparts");
                            Pricing.getSparePartData(formLabel.tipe).then(parts=>{
                                let sparepartData = parts;
                                //3. render the result and set the view
                                
                                //render pricingResult section
                                pricingView.renderPricingResult(newData,bartexPrice,sumberPrice,sparepartData);
                            })
                        }

                    });

                    //SELESAI=====================
//CODE ALTERNATIVE===PASANGAN: X1230981 di competitorProduct.js======================
                /*getPriceOnProduct(formLabel ,'BARTEX').then((resolve,reject)=>{
                    if(resolve){
                        bartexPrice = resolve;
                    }else{
                        bartexPrice = 0;
                    }
                    getPriceOnProduct(formLabel,`SUMBER`).then((resolve,reject)=>{
                        if(resolve){
                            sumberPrice = resolve;
                        }else{
                            sumberPrice = 0;
                        }        
                    //3. render the result and set the view
                    pricingView.removePricingResult();
                    //render pricingResult section
                    pricingView.renderPricingResult(newData,bartexPrice,sumberPrice);

                    })
                });*/
//CODE ALTERNATIVE END=========================
            }).catch(error=>{
                console.log(`gagal mengambil data ${error}`);
        });
    }  
});
//====================================PRODUCT CONTROLLER ======================================================
const prodControler =  ()=>{
 
    renderLoader(elements.coreContainer);
    //console.log(getAllProduct());
    server.allProduct = getAllProduct();
    server.allProduct.then( (resolve,reject)=> {
        clearLoader();
        //use resolve to get the value from promise
            //send the result data to view
            productView.renderProduct(resolve);
        }).catch(error =>{
            console.log(`error when getting product data ${error}`);
        });
};

//intent can be either "add" for new product or "update" for existing product
//data is the data we send when edit button is pressed
const displayUpdateContainer = (type,intent,data=``) =>{
    //call the productView function
    productView.renderUpdateContainer(type,intent,data);
}

//================================EVENT LiSTENER =================================
//when we click managemen product:
function eventListener(){ 
    //CODE UNTUK SET DUMMY DATA -------------------------------------------------
    //elements.addProduct.addEventListener("click",setDummyData);
    //document.querySelector('.addCompetitorProduct').addEventListener("click", setCompetitorProductData);
    
    //CODE UNTUK MANAGE PRODUK ---------------------------------------------------
    elements.manageProductMenu.addEventListener("click",() =>{

        //code for listening to Manage product
        if(document.querySelector('.coreProduct')){
            //if exist, remove the the html element
            document.querySelector('.coreProduct').parentNode.removeChild(document.querySelector('.coreProduct'));
            //if there is still product update container not closed
            if(document.querySelector('.core_product_update_product')){
                productView.resetUpdateContainerForm();
            }
        }else{
            cleanContainer();
            //if no coreProd Class exist, go to prodControler function
            prodControler();
        }
    });
    
    //CODE to Add new Product //when user submit the add new product button -> ---------------------- 
    elements.coreContainer.addEventListener("click",(el)=>{
        
        //code for search-----------------------------------------------------------------
        if(el.target.matches('#prodSearch')){
            console.log("search button pressed");
            //set listener to keystrok
       
           //elements.coreContainer.addEventListener("keyup", ()=>{
            var listener = function() {    
                let query = (el.target.value).toLowerCase()
                //console.log(query);
                var prodRow = document.querySelectorAll('.productRow');
                prodRow.forEach((cur)=>{
                    cur.classList.add("hidden");
                });
                
              var allCode = document.querySelectorAll('.product_code');
              
              //kita juga perlu buat search berdasarkan tipe produk
              var arrayProdType = [];
              var prodType = document.querySelectorAll('.product_type');
              //store each type into an array
              prodType.forEach(type=>{
                  var theType = type.innerHTML.toLowerCase();
                  arrayProdType.push(theType);
                  
              });
              //code to perform search query comparison
              //we do search per character
              allCode.forEach((code , index)=>{
                  let docId = code.innerHTML.toLowerCase();
                  let arrayQuery = query.split("");
                  let arrayDocId = docId.split("");
                  let eachProdType = arrayProdType[index].split("");
                    //array for storing each character itteration 
                  let prevQuery =[];
                  let prevDoc =[];
                  let prevType =[];

                  if(arrayQuery.length<1){
                    prodRow.forEach((cur)=>{
                        cur.classList.remove("hidden");
                    });
                    }else{
                        
                        for(var i = 0; i < arrayQuery.length ; i++){
                        prevQuery.push(arrayQuery[i]);
                        prevDoc.push(arrayDocId[i]);
                        prevType.push(eachProdType[i]);

                        //combine the current and previous char entered 
                        let newQuery = prevQuery.join();
                        let newDoc = prevDoc.join();
                        let newType = prevType.join();
                            
                            if(newQuery === newDoc || newQuery === newType){

                                code.parentNode.classList.remove("hidden");
                            }
                            else{
                                code.parentNode.classList.add("hidden");
                            }

                          };
                    }
              });
            };
            elements.coreContainer.addEventListener("keyup", listener,true);
        }
        if(!el.target.matches('#prodSearch')){
            //console.log("need to remove event listener bro...");
            elements.coreContainer.removeEventListener("keyup", listener,true);
        }     

        //code for listening to add/edit new product------------------------------------------
        if(el.target.matches(`.btnNewProd`)){
            el.preventDefault();
            if(document.querySelector('#prodCode').value){
                console.log("this is submit listener"+el );
            const thetype = document.querySelector('#prodType').value;
            let formLabel ='';
            if(thetype === 'WPA'){
            formLabel = {
                code: document.querySelector('#prodCode').value,
                tipe: document.querySelector('#prodType').value,
                size: document.querySelector('#prodSize').value,
                ratio: document.querySelector('#prodRatio').value,
                quantity: document.querySelector('#prodQty').value,
                price: document.querySelector('#prodPrice').value,
                intent: document.querySelector('#prodIntent').value,
                docId: document.querySelector('#docId').value
            }
            //const newProduct = new Product(formLabel.code, formLabel.tipe,formLabel.size,formLabel.ratio,formLabel.quantity,formLabel.price,formLabel.docId );
            const newProduct = new Product(formLabel);
                newProduct.addWPAProductToDb().then(() => 
                {
                    //console.log(`this is the result when new/edit prod is clicked ${newProduct.result}`);
                    const html = productView.renderNewAddedProduct(newProduct.result);
                    //console.log(formLabel.intent);
                    if(formLabel.intent === 'update'){
                        productView.deleteProductView(formLabel.docId);
                    }
                    document.querySelector('.core_product_table').insertAdjacentHTML("beforeend",html);
                    //delete the update form
                    productView.resetUpdateContainerForm();
                    
                }).catch((error)=>{
                    console.log(`error getting result ${error}`);
                });

        }else if(thetype === 'WPA SPAREPART'){
            formLabel = {
                code: document.querySelector('#prodCode').value,
                tipe: document.querySelector('#prodType').value,
                partType: document.querySelector('#partType').value,
                size: document.querySelector('#prodSize').value,
                ratio: document.querySelector('#prodRatio').value,
                quantity: document.querySelector('#prodQty').value,
                price: document.querySelector('#prodPrice').value,
                intent: document.querySelector('#prodIntent').value,
                docId: document.querySelector('#docId').value
            }
            //const newProduct = new Product(formLabel.code, formLabel.tipe,formLabel.size,formLabel.ratio,formLabel.quantity,formLabel.price,formLabel.docId );
            const newProduct = new Product(formLabel);
                newProduct.addPartWPAProductToDb().then(() => 
                {
                    //console.log(`this is the result when new/edit prod is clicked ${newProduct.result}`);
                    const html = productView.renderNewAddedProduct(newProduct.result);
                    //console.log(formLabel.intent);
                    if(formLabel.intent === 'update'){
                        productView.deleteProductView(formLabel.docId);
                    }
                    document.querySelector('.core_product_table').insertAdjacentHTML("beforeend",html);
                    //delete the update form
                    productView.resetUpdateContainerForm();
                    
                }).catch((error)=>{
                    console.log(`error getting result ${error}`);
                });
        }else if(thetype === 'NMRV'){
            formLabel = {
                code: document.querySelector('#prodCode').value,
                tipe: document.querySelector('#prodType').value,
                size: document.querySelector('#prodSize').value,
                ratio: document.querySelector('#prodRatio').value,
                quantity: document.querySelector('#prodQty').value,
                price: document.querySelector('#prodPrice').value,
                flange: document.querySelector('#prodFlange').value,
                intent: document.querySelector('#prodIntent').value,
                docId: document.querySelector('#docId').value
            }
            const newProduct = new Product(formLabel);
                newProduct.addNMRVProductToDb().then(() => 
                {
                    console.log(newProduct.result);
                    const html = productView.renderNewAddedProduct(newProduct.result);
                    if(formLabel.intent === 'update'){
                        productView.deleteProductView(formLabel.docId);
                    }
                    document.querySelector('.core_product_table').insertAdjacentHTML("beforeend",html);
                    productView.resetUpdateContainerForm();
                }).catch((error)=>{
                    console.log(`error getting result ${error}`);
                });
            
        }else if(thetype === 'NMRV SPAREPART'){
            formLabel = {
                code: document.querySelector('#prodCode').value,
                tipe: document.querySelector('#prodType').value,
                partType: document.querySelector('#partType').value,
                size: document.querySelector('#prodSize').value,
                ratio: document.querySelector('#prodRatio').value,
                quantity: document.querySelector('#prodQty').value,
                price: document.querySelector('#prodPrice').value,
                flange: document.querySelector('#prodFlange').value,
                intent: document.querySelector('#prodIntent').value,
                docId: document.querySelector('#docId').value
            }
            //const newProduct = new Product(formLabel.code, formLabel.tipe,formLabel.size,formLabel.ratio,formLabel.quantity,formLabel.price,formLabel.docId );
            const newProduct = new Product(formLabel);
                newProduct.addNMRVPartProductToDb().then(() => 
                {
                    //console.log(`this is the result when new/edit prod is clicked ${newProduct.result}`);
                    const html = productView.renderNewAddedProduct(newProduct.result);
                    //console.log(formLabel.intent);
                    if(formLabel.intent === 'update'){
                        productView.deleteProductView(formLabel.docId);
                    }
                    document.querySelector('.core_product_table').insertAdjacentHTML("beforeend",html);
                    //delete the update form
                    productView.resetUpdateContainerForm();
                    
                }).catch((error)=>{
                    console.log(`error getting result ${error}`);
                });
        }
        else if(thetype === 'DINAMO'){
            formLabel = {
                code: document.querySelector('#prodCode').value,
                tipe: document.querySelector('#prodType').value,
                quantity: document.querySelector('#prodQty').value,
                price: document.querySelector('#prodPrice').value,
                hp:document.querySelector('#prodHp').value,
                rpm:document.querySelector('#prodRPM').value,
                phase:document.querySelector('#prodPhase').value,
                intent: document.querySelector('#prodIntent').value,
                material: document.querySelector('#prodMaterial').value,
                model: document.querySelector('#prodModel').value,
                docId: document.querySelector('#docId').value
            }
            const newProduct = new Product(formLabel);
                newProduct.addDINAMOProductToDb().then(() => 
                {
                    console.log(newProduct.result);
                    const html = productView.renderNewAddedProduct(newProduct.result);
                    if(formLabel.intent === 'update'){
                        productView.deleteProductView(formLabel.docId);
                    }
                    document.querySelector('.core_product_table').insertAdjacentHTML("beforeend",html);
                    productView.resetUpdateContainerForm();
                }).catch((error)=>{
                    console.log(`error getting result ${error}`);
                });

        }else if(thetype === 'OTHERS'){
            console.log('masuk sini');
            formLabel = {
                code: document.querySelector('#prodCode').value,
                tipe: document.querySelector('#prodType').value,
                spec: document.querySelector('#prodSpec').value,
                quantity: document.querySelector('#prodQty').value,
                price: document.querySelector('#prodPrice').value,
                intent: document.querySelector('#prodIntent').value,
                docId: document.querySelector('#docId').value
            }
            const newProduct = new Product(formLabel);
                newProduct.addOthersProductToDb().then(() => 
                {
                    //console.log(`this is the result when new/edit prod is clicked ${newProduct.result}`);
                    const html = productView.renderNewAddedProduct(newProduct.result);
                    //console.log(formLabel.intent);
                    if(formLabel.intent === 'update'){
                        productView.deleteProductView(formLabel.docId);
                    }
                    document.querySelector('.core_product_table').insertAdjacentHTML("beforeend",html);
                    //delete the update form
                    productView.resetUpdateContainerForm();
                    
                }).catch((error)=>{
                    console.log(`error getting result ${error}`);
                });
        }
            }else{
                alert("Code Barang harus diisi!");
            }
        }
        //CODE UNTUK "TAMBAH PRODUK BARU"-----------------------------------------------
        if(el.target.matches('.addProduct')){
            //if there is still product update container not closed
            if(document.querySelector('.core_product_update_product')){
                productView.resetUpdateContainerForm();
            }
            //begin is a product type set as value for first selection option
            displayUpdateContainer("begin","add");
        }
        if(el.target.matches('.delUpdateForm')){
            el.target.parentNode.parentNode.removeChild(el.target.parentNode);
        }

        //CODE UNTUK "TAMBAH EDIT PRODUK TOMBOL HIJAU"----------------------------------
        //code for when edit button is clicked
        if(el.target.matches('.editProduct')){
            if(document.querySelector('.core_product_update_product')){
                productView.resetUpdateContainerForm();
            }
            //1. get the id
            //console.log(el.target.id);
            //2. get the data from model
            server.singleProd = getSingleProduct(el.target.id);
            //3. send the data to view with edit intent
            server.singleProd.then(cur => {
                //begin is a product type set as value for first selection option
                //console.log("X123897129"); unique code only for reminder
                //console.log(cur);
                displayUpdateContainer("begin","edit",cur);
                
            }).catch(error => {
                console.log(`failed to get single prod from db 2 ${error}`);
            });
      
            //4. get the data from view
            //5. perform update on the model
        }
        if(el.target.matches('.deleteProduct')){
            var answ = confirm("Yakin untuk delete produk?");
            if(answ === true){
                const code = el.target.id;
                console.log(`delete product ${code}`);
                //delete product from database in model
                deleteProduct(code);
                //delete the product in productView
                productView.deleteProductView(code);
            }else{
                console.log("cancel remove");
            }

            
        }
    });

    //buat event delegation baru untuk listen to onchange event (WPA,NMRV,DINAMO)-------
    elements.coreContainer.addEventListener("change",(el)=>{
        //----------------PRODUCT------------------------------
        if(el.target.matches('.prodSelect')){
                //delete the Tambah Product box 
                productView.resetUpdateContainerForm();
                //display berdasarkan tipe yang di select
                productView.renderUpdateContainer(el.target.value,"add");
        }
    });
};
eventListener();