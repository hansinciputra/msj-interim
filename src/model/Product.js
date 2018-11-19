
console.log("working from product.js");
var db = firebase.firestore();
var db_products = db.collection("products");
var db_products_ref;
//Product Class
export class Product{
    constructor(formLabel){
        this.code = formLabel.code.toLowerCase();
        this.type = formLabel.tipe;
        this.size = formLabel.size;
        this.ratio = formLabel.ratio;
        this.quantity = formLabel.quantity;
        this.price = formLabel.price;
        this.flange = formLabel.flange;
        this.hp = formLabel.hp;
        this.rpm = formLabel.rpm;
        this.phase = formLabel.phase;
        this.docId = formLabel.docId;
        this.material = formLabel.material;
        this.model = formLabel.model;
        this.spec = formLabel.spec;
        this.partType = formLabel.partType;
        this.result;
    }
    addWPAProductToDb(){
        //insert into firebase
        //store the ref so we can get the doc().id, need to store its ref 
        //since .doc().id will change in value everytime called.
        //if the doc is already exist, we update the data
        this.docId === ''? db_products_ref = db_products.doc() : db_products_ref = db_products.doc(this.docId);      
        return db_products_ref.set({
            code: this.code,
            type: this.type,
            size: this.size,
            ratio: this.ratio,
            quantity: this.quantity,
            price: this.price
        }).then(()=>{
            //return to result in controller as obj
            console.log("WPA inserted into database");
            //console.log(db_products.doc().getId());
            const result = {
                docId: db_products_ref.id,
                code: this.code,
                type: this.type,
                size: this.size,
                ratio: this.ratio,
                quantity: this.quantity,
                price: this.price
            }
            this.result = result;
        }).catch(error=>{
            console.log(`failed inserting WPA to database ${error}`);
        });
    }
    addPartWPAProductToDb(){
        this.docId === ''? db_products_ref = db_products.doc() : db_products_ref = db_products.doc(this.docId);      
        return db_products_ref.set({
            code: this.code,
            type: this.type,
            partType: this.partType,
            size: this.size,
            ratio: this.ratio,
            quantity: this.quantity,
            price: this.price
        }).then(()=>{
            //return to result in controller as obj
            console.log("Parts WPA inserted into database");
            //console.log(db_products.doc().getId());
            const result = {
                docId: db_products_ref.id,
                code: this.code,
                type: this.type,
                partType: this.partType,
                size: this.size,
                ratio: this.ratio,
                quantity: this.quantity,
                price: this.price
            }
            this.result = result;
        }).catch(error=>{
            console.log(`failed inserting WPA to database ${error}`);
        });
    }
    addNMRVProductToDb(){ 
        this.docId === ''? db_products_ref = db_products.doc() : db_products_ref = db_products.doc(this.docId);
        //insert into firebase
        return db_products_ref.set({
            code: this.code,
            type: this.type,
            size: this.size,
            ratio: this.ratio,
            quantity: this.quantity,
            flange: this.flange,
            price: this.price
        }).then(()=>{
            //return to result in controller as obj
            console.log("NMRV inserted into database");
            const result = {
                docId: db_products_ref.id,
                code: this.code,
                type: this.type,
                size: this.size,
                ratio: this.ratio,
                quantity: this.quantity,
                price: this.price,
                flange: this.flange
            }
            this.result = result;
        }).catch(error=>{
            console.log(`failed inserting NMRV to database ${error}`);
        });
    }
    addNMRVPartProductToDb(){ 
        this.docId === ''? db_products_ref = db_products.doc() : db_products_ref = db_products.doc(this.docId);
        //insert into firebase
        return db_products_ref.set({
            code: this.code,
            type: this.type,
            partType: this.partType,
            size: this.size,
            ratio: this.ratio,
            quantity: this.quantity,
            flange: this.flange,
            price: this.price
        }).then(()=>{
            //return to result in controller as obj
            console.log("NMRV inserted into database");
            const result = {
                docId: db_products_ref.id,
                code: this.code,
                type: this.type,
                partType: this.partType,
                size: this.size,
                ratio: this.ratio,
                quantity: this.quantity,
                price: this.price,
                flange: this.flange
            }
            this.result = result;
        }).catch(error=>{
            console.log(`failed inserting NMRV to database ${error}`);
        });
    }
    addDINAMOProductToDb(){
        this.docId === ''? db_products_ref = db_products.doc() : db_products_ref = db_products.doc(this.docId);
        //insert into firebase
        return db_products_ref.set({
            code: this.code,
            type: this.type,
            hp: this.hp,
            rpm: this.rpm,
            quantity: this.quantity,
            phase: this.phase,
            price: this.price,
            material: this.material,
            model: this.model
        }).then(()=>{
            //return to result in controller as obj
            console.log("Dinamo inserted into database");
            const result = {
                docId: db_products_ref.id,
                code: this.code,
                type: this.type,
                hp: this.hp,
                rpm: this.rpm,
                quantity: this.quantity,
                phase: this.phase,
                price: this.price,
                material: this.material,
                model: this.model
            }
            this.result = result;
        }).catch(error=>{
            console.log(`failed inserting DINAMO to database ${error}`);
        });
    }
    addOthersProductToDb(){
        //insert into firebase
        //store the ref so we can get the doc().id, need to store its ref 
        //since .doc().id will change in value everytime called.
        //if the doc is already exist, we update the data
        this.docId === ''? db_products_ref = db_products.doc() : db_products_ref = db_products.doc(this.docId);      
        return db_products_ref.set({
            code: this.code,
            type: this.type,
            spec: this.spec,
            quantity: this.quantity,
            price: this.price
        }).then(()=>{
            //return to result in controller as obj
            console.log("Others inserted into database");
            //console.log(db_products.doc().getId());
            const result = {
                docId: db_products_ref.id,
                code: this.code,
                type: this.type,
                spec: this.spec,
                quantity: this.quantity,
                price: this.price
            }
            this.result = result;
        }).catch(error=>{
            console.log(`failed inserting Others to database ${error}`);
        });
    }
}
export const deleteProduct = (code) => {
    var db_products = db.collection("products");
    db_products.doc(code).delete().then(()=>{
        console.log("item has been removed");
    }).catch((error)=>{
        console.log(`cannot delete item ${error}`);
    });
}
export const getAllProduct = () => {
  
    const allProducts = db_products.get();
    //return the promise
    return allProducts.then((obj) =>{
        let objResult = {};
        let results = [];
        //console.log(obj);
        obj.forEach(cur => {
            //store the cur.data() in new object to combine with cur.id
            //because I couldn't insert the cur.id which will be used for edit and deletion
            //into the cur.data() object. so this is...kind of a hack.
            objResult = {
                docId: cur.id,
                code: cur.data().code,
                price: cur.data().price,
                quantity: cur.data().quantity,
                ratio: cur.data().ratio,
                size: cur.data().size,
                type: cur.data().type,
                flange: cur.data().flange,
                hp:cur.data().hp,
                phase: cur.data().phase,
                rpm:cur.data().rpm,
                material:cur.data().material,
                model:cur.data().model,
                spec:cur.data().spec,
                partType:cur.data().partType,
            }
            results.push(objResult);
        });
        //return results as array
        return results;
    }).catch(error => {
        console.log(`error:${error}`);
    });

}

export const getSingleProduct = (code) =>{
    return db_products.doc(code).get()
    .then((field)=>{
        const result = {
            code: code,
            data: field.data()
        }
        //console.log(result);
        return result;
    }).catch((error)=>{
        console.log(`failed to get single prod from db ${error}`);
    });
}
