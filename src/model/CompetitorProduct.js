import { SIGINT } from "constants";

var db = firebase.firestore();
var db_bartex = db.collection("bartex");
var db_sumber = db.collection("sumber");
var db_products_ref;

export class CompetitorProduct{
    constructor(obj){
        this.docId = obj.docId,
        this.price = obj.price,
        this.competitor = obj.competitor
        
        /*this.size = obj.size,
        this.type = obj.tipe,
        this.flange = obj.flange*/
    }

    insertToDb(){
        console.log(this.competitor);
        if(this.competitor === 'BARTEX'){
            this.docId === ''? db_products_ref = db_bartex.doc() : db_products_ref = db_bartex.doc(this.docId);
        }else if(this.competitor === 'SUMBER'){
            this.docId === ''? db_products_ref = db_sumber.doc() : db_products_ref = db_sumber.doc(this.docId);
        }
        return db_products_ref.update({
            price: this.price
        }).then(()=>{
            //return to result in controller as obj
            console.log(`updated into database`);
            //console.log(db_products.doc().getId());
            const result = {
                docId: db_products_ref.id,
                //type: this.type,
                //size: this.size,
                price: this.price
            }
            this.result = result;
            console.log(`the resul after db = ${this.result}`);
        }).catch(error=>{
            console.log(`failed inserting Bartex to database ${error}`);
        });
    }

}

const sortResultString= (a,b)=>{
    if (a.hp < b.hp)
      return -1;
    if (a.hp > b.hp)
      return 1;
    return 0;
}
const sortNumber = (a,b)=>{

    a.size = parseInt(a.size,10);
    b.size = parseInt(b.size,10);
 
    return a.size - b.size;
}

export const getPriceOnProduct = (data)=>{
    console.log(data);
    let selectedBartexProduct;
    let selectedSumberProduct;
    let priceProduct = [];
    let objResult = {};
    //seharusnya "db.collection(competitor)"" aja...
    if(data.tipe === 'WPA' || data.tipe === 'NMRV'){
        console.log("masuk kesini");
        selectedBartexProduct = db_bartex.where("type","==",data.tipe).where("size","==",data.size).limit(1).get();
    }else if(data.tipe === 'DINAMO'){
        console.log("masuk dinamo");
        selectedBartexProduct = db_bartex.where("type","==",data.tipe).where("hp","==",data.hp).where("rpm","==",data.rpm).where("phasa","==",data.phase).where("material","==",data.material).where("model","==",data.model).limit(1).get();
    }
    return selectedBartexProduct.then(cur=>{
        console.log(cur);
        cur.forEach(data=>{

            objResult.BARTEX = data.data().price;
        });
        if(data.tipe === 'WPA' || data.tipe === 'NMRV'){
            selectedSumberProduct = db_sumber.where("type","==",data.tipe).where("size","==",data.size).limit(1).get();
        }else if(data.tipe === 'DINAMO'){
            selectedSumberProduct = db_sumber.where("type","==",data.tipe).where("hp","==",data.hp).where("rpm","==",data.rpm).where("phasa","==",data.phase).where("material","==",data.material).where("model","==",data.model).limit(1).get();
        }
        return selectedSumberProduct.then(cur=>{
            cur.forEach(data=>{
                objResult.SUMBER = data.data().price;
            });
            priceProduct.push(objResult);        
            console.log(priceProduct);
            return priceProduct;
        }).catch(error => `Error getting selected Prod competitor data from model ${error} code X02312s12`);
    
    }).catch(error => `Error getting selected Prod competitor data from model ${error} code X02312s12`);
}

//CODE ALTERNATIVE===PASANGAN: X1230981 di index.js======================

/*export const getPriceOnProduct = (data,competitor)=>{
    let selectedProduct;
    let priceProduct;
    //seharusnya "db.collection(competitor)"" aja...
    if(competitor === 'BARTEX' && (data.tipe === 'WPA' || data.tipe === 'NMRV')){
        selectedProduct = db_bartex.where("type","==",data.tipe).where("size","==",data.size).limit(1).get();
    }else if(competitor === 'SUMBER' && (data.tipe === 'WPA' || data.tipe === 'NMRV')){
        selectedProduct = db_sumber.where("type","==",data.tipe).where("size","==",data.size).limit(1).get();
    }else if(competitor === 'BARTEX' && data.tipe === 'DINAMO'){
        selectedProduct = db_bartex.where("type","==",data.tipe).where("hp","==",data.hp).where("rpm","==",data.rpm).where("phasa","==",data.phase).where("material","==",data.material).where("model","==",data.model).limit(1).get();
    }else if(competitor === 'SUMBER' && data.tipe === 'DINAMO'){
        selectedProduct = db_sumber.where("type","==",data.tipe).where("hp","==",data.hp).where("rpm","==",data.rpm).where("phasa","==",data.phase).where("material","==",data.material).where("model","==",data.model).limit(1).get();
    }

    return selectedProduct.then(cur=>{
        let result;
            cur.forEach(data=>{
                console.log(data.data());
                console.log(data.data().price);
                //return the price
                priceProduct = data.data().price;
            })
            return priceProduct;
    }).catch(error => `Error getting selected Prod competitor data from model ${error} code X02312s12`);
}*/
//CODE ALTERNATIVE END=========================
export const getCompetitorProduct = (name,prod,phasa,material,rpm)=> {
    let results = [];
    let newPhasa = phasa.replace(/\D/g,'');
    let newMaterial = material.toLowerCase();
    let newRPM = rpm.replace(/\D/g,'');
    
    /*console.log(name);
    console.log(rpm);
        console.log(prod);
        console.log(newPhasa);
        console.log(typeof(newPhasa));
        console.log(newMaterial);*/
    let allProducts;
        if(name === 'BARTEX' && (prod === 'WPA' || prod === 'NMRV')){
            allProducts = db_bartex.where("type","==",prod).get();
        }else if(name === 'SUMBER' && (prod === 'WPA' || prod === 'NMRV')){
            allProducts = db_sumber.where("type","==",prod).get();
        }else if(name === 'BARTEX' && prod === 'DINAMO'){
            allProducts = db_bartex.where("type","==",prod).where("phasa","==",newPhasa).where("material","==",newMaterial).where("rpm","==",newRPM).get();
        }else if(name === 'SUMBER' && prod === 'DINAMO'){
            allProducts = db_sumber.where("type","==",prod).where("phasa","==",newPhasa).where("material","==",newMaterial).where("rpm","==",newRPM).get();
        }
        
        return allProducts.then(cur =>{
            cur.forEach(data=>{
                let newData = {
                    id: data.id,
                    competitor: data.data().competitor,
                    price: data.data().price,
                    size: data.data().size,
                    type: data.data().type,
                    flange:data.data().flange,
                    hp:data.data().hp,
                    phasa: data.data().phasa,
                    rpm: data.data().rpm,
                    pole:data.data().pole,
                    material:data.data().material,
                    model:data.data().model,
                }
                results.push(newData);
            })
            if( prod === 'WPA' || prod === 'NMRV'){
                results = results.sort(sortNumber);
            }else if ( prod === 'DINAMO'){
                results = results.sort(sortResultString);
            }
            //console.log(results);
            return results;
        }).catch(error => `Error getting competitor Prod data from model ${error} code X0210as3`);
}