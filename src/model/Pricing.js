import { resolve } from "path";
import { rejects } from "assert";

var db = firebase.firestore();
var db_products = db.collection("products");


export class SearchPricing{
    constructor (tipe,size,ratio,flange,hp,rpm,phase){
        this.tipe = tipe,
        this.size = size,
        this.ratio = ratio,
        this.flange = flange,
        this.hp = hp,
        this.rpm = rpm,
        this.phase = phase
    }
    getBasedOnType(tipe){
        if(tipe === 'WPA'){
            let arrayResult = [];
            return db_products.where("type","==",this.tipe).where("size","==",this.size).where("ratio","==",this.ratio).get()
            .then(obj=>{
                obj.forEach(cur=>{
                    arrayResult.push(cur.data()); 
                });
                return arrayResult;
            })
            .catch(error=>{
                console.log(`Cannot get WPA data ${error}`);
            });
        }else if(tipe === 'NMRV'){
            let arrayResult = [];
            return db_products.where("type","==",this.tipe).where("size","==",this.size).where("ratio","==",this.ratio).where("flange","==",this.flange).get()
            .then(obj=>{
                obj.forEach(cur=>{
                    arrayResult.push(cur.data()); 
                });
                return arrayResult;
            })
            .catch(error=>{
                console.log(`Cannot get NMRV data ${error}`);
            });
        }else if(tipe === 'DINAMO'){
            let arrayResult = [];
            return db_products.where("type","==",this.tipe).where("hp","==",this.hp).where("rpm","==",this.rpm).where("phase","==",this.phase).get()
            .then(obj=>{
                obj.forEach(cur=>{
                    arrayResult.push(cur.data()); 
                });
                return arrayResult;
            })
            .catch(error=>{
                console.log(`Cannot get NMRV data ${error}`);
            });
        }
    }
    getSparePartData(tipe){
        if(tipe === 'WPA'){
            let arrayResult = [];
            return db_products.where("type","==","WPA SPAREPART").where("size","==",this.size).where("ratio","==",this.ratio).get()
            .then(obj=>{
                obj.forEach(cur=>{
                    arrayResult.push(cur.data()); 
                });
                return arrayResult;
            })
            .catch(error=>{
                console.log(`Cannot get WPA Sparepart data ${error}`);
            });
        }else if(tipe === 'NMRV'){
            let arrayResult = [];
            return db_products.where("type","==","NMRV SPAREPART").where("size","==",this.size).where("ratio","==",this.ratio).where("flange","==",this.flange).get()
            .then(obj=>{
                obj.forEach(cur=>{
                    arrayResult.push(cur.data()); 
                });
                return arrayResult;
            })
            .catch(error=>{
                console.log(`Cannot get NMRV Sparepart data ${error}`);
            });
        }
    }

    
}