var db = firebase.firestore();
var db_products = db.collection("products");
var db_warehouse = db.collection("warehouse");

export class WarehouseRow{
    constructor(code, intent){
        this.code = code;
        this.intent = intent;
    }
    getDatafromCode(){
        let getResult={};
        return db_products.where("code","==",this.code).get().then(result=>{
            result.forEach(cur=>{
                //console.log(cur.data());
                getResult[this.intent] = cur.data();
                getResult = {
                    intent: this.intent,
                    docId: cur.id,
                    code: cur.data().code,
                    stock: cur.data().quantity,
                    type: cur.data().type,
                    size: cur.data().size,
                    ratio: cur.data().ratio,
                    flange: cur.data().flange,
                    phase:cur.data().phase,
                    hp: cur.data().hp,
                    rpm: cur.data().rpm,
                    material: cur.data().material,
                    model: cur.data().model
                }
            });
            return getResult;
        }).catch(error=>`failed to get data from product db from warehouse model code X83610JSK ${error}`);
    }
}

export const curQty = (code)=>{
    let getResult={};
    return db_products.where("code","==",code).get().then(result=>{
        result.forEach(cur=>{
            console.log(cur.data());
            getResult = {
                stock: cur.data().quantity
            }
        });
        return getResult;
    }).catch(error=>`failed to get data from product db from warehouse model code X83610JSK ${error}`);
}


export const insertWarehouseRow = (data)=>{
    //console.log(data);
    var uniqueId = function() {
        return 'id-' + Math.random().toString(36).substr(2, 16);
      }();
      //console.log(uniqueId);
    let db_warehouse_ref = db_warehouse.doc(data.bulan);
    return db_warehouse_ref.set({
        [uniqueId]: {
            mapId:uniqueId,
            docId:data.docId,
            desc:data.desc,
            intent: data.intent,
            sisaStock: data.stock,
            code:data.code,
            tanggal: data.tanggal,
            enteredAmount: data.enteredAmount,
            customer:data.namaCustomer        
        }
    },{ merge: true }).then(()=> {
        let result = {
            mapId:uniqueId,
            docId:data.docId,
            desc:data.desc,
            intent: data.intent,
            sisaStock: data.stock,
            code:data.code,
            tanggal: data.tanggal,
            enteredAmount: data.enteredAmount,
            customer:data.namaCustomer 
        } 
        return result;
    });
}

export const updateStock = (data)=>{
    //perlu data:
    //1. stock
    //2. newly entered stock
    //3. prevly entered stock
    //4. intent
    //5. target id
    let newStock;
    let temp = (data.intent).split(" ");
    let intent = temp[0]
    let stock = parseInt(data.stock,10);
    let enteredAmount = parseInt(data.enteredAmount,10);
    console.log("databulan: "+data.bulan);
    //console.log(enteredAmount);
    if(data.prevValue || data.prevValue === 0){
        //code ketika update amount dan competitor saja,
        //ketika user sudah pernah input record
        let prevValue = parseInt(data.prevValue,10);
        if(intent === 'rowKeluarBarang'){
            //newStock = stock - enteredAmount;
            newStock = (stock + prevValue) - enteredAmount;
        }else if(intent === 'rowMasukBarang'){
            //newStock = stock + enteredAmount;
            newStock = (stock - prevValue) + enteredAmount;
        }
        //jika sudah pernah input record maka update record warehouse yang berdasarkan tanggal juga
        //update warehouse record
        db_warehouse.doc(data.bulan).update({
            [`${data.mapId}.enteredAmount`]: enteredAmount,
            [`${data.mapId}.sisaStock`]: newStock,
            [`${data.mapId}.customer`]: data.customer
      })//.then(()=>{console.log("Berhasil update record")}).catch(error=>`gagal mengupdate editan ${error}`)
    }else{
        //ketike user belum pernah insert record
        console.log("masuk kesini karena user belum pernah enter record");
        if(intent === 'rowKeluarBarang'){
            newStock = stock - enteredAmount;
        }else if(intent === 'rowMasukBarang'){
            newStock = stock + enteredAmount;
        }
    }
    return db_products.doc(data.docId).update({
        quantity: newStock
    //db_warehouse.doc(data.tanggal).update({
    }).then(()=>{
        console.log("Data berhasil ter update");
        return newStock;
    }).catch(error=>{
        console.log(`failed updating warehouse new amount to database ${error}`);
    });
}

export const getRecordOnDate=(bulan)=>{
    return db_warehouse.doc(bulan).get().then((resolve)=>{
        if(resolve.exists){
            return resolve.data();
        }
    }).catch(error=>{
        console.log(`failed getting all record from database ${error} code X11kwea3s432`);
    });
}

export const deleteWarehouseRecord = (bulan, mapId,inputValue,code,intent,docId)=>{
    curQty(code).then((data)=>{
        console.log(data.stock);
        let newStock;
        if(intent === 'rowKeluarBarang'){
            newStock = parseInt(data.stock,10) + parseInt(inputValue,10);
        }else if(intent === 'rowMasukBarang'){
            newStock = parseInt(data.stock,10) - parseInt(inputValue,10);
        }
        
        db_products.doc(docId).update({
            quantity: newStock
        }).then(()=>{
                console.log("Data berhasil ter delete di database");
            }).catch(error=>{
                console.log(`failed delete warehouse new amount to database ${error}`);
            });
    }).catch();
    
    db_warehouse.doc(bulan).update({
        [mapId]: firebase.firestore.FieldValue.delete()
    }).then(()=>{
        console.log("data berhasil di delete di warehouse Record");
    }).catch();
}